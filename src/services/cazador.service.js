import jwt from "jsonwebtoken";
import { pool } from "../config/database.js";
import { PerfilCazadorDTO } from "../dtos/cazador.dto.js";

export const JWT_SECRET = process.env.JWT_SECRET || "campuslands_secret_key_256_bits";
export const JWT_EXPIRES_IN = "2h";

export const cazadorService = {
  async buscarPorUsername(username) {
    const limpio = String(username ?? "").trim().toLowerCase();
    const [cazadores] = await pool.execute(
      "SELECT id, sub, username, password, name, rango, admin FROM cazadores WHERE username = ? LIMIT 1",
      [limpio],
    );
    return cazadores[0] || null;
  },
  async buscarPorSub(sub) {
    const [cazadores] = await pool.execute(
      "SELECT id, sub, username, password, name, rango, admin FROM cazadores WHERE sub = ? LIMIT 1",
      [String(sub)],
    );
    return cazadores[0] || null;
  },
  async listarPerfiles() {
    const [cazadores] = await pool.execute(
      "SELECT id, username, name, rango, admin FROM cazadores ORDER BY created_at, id",
    );
    return cazadores.map((cazador) => new PerfilCazadorDTO(cazador));
  },
  firmarTokenJWT(cazador) {
    const payload = {
      sub: cazador.sub,
      username: cazador.username,
      name: cazador.name,
      rango: cazador.rango,
      admin: Boolean(cazador.admin),
    };
    return jwt.sign(payload, JWT_SECRET, { algorithm: "HS256", expiresIn: JWT_EXPIRES_IN });
  },
  async crearRecompensa(datos, adminUsername) {
    const [resultado] = await pool.execute(
      "INSERT INTO recompensas (mision, cristales, autorizado_por) VALUES (?, ?, ?)",
      [datos.mision, datos.cristales, adminUsername],
    );
    return {
      id: `bov-${resultado.insertId}`,
      ...datos,
      autorizadoPor: adminUsername,
      createdAt: new Date().toISOString(),
    };
  },
};