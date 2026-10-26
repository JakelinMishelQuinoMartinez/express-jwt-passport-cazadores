import "dotenv/config";
import mysql from "mysql2/promise";
import { CAZADORES_SEMILLA } from "../models/cazador.model.js";

export const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "cazadores",
  waitForConnections: true,
  connectionLimit: 10,
  charset: "utf8mb4",
});

export async function inicializarBaseDatos() {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS cazadores (
      id VARCHAR(36) NOT NULL PRIMARY KEY,
      sub VARCHAR(36) NOT NULL UNIQUE,
      username VARCHAR(30) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(100) NOT NULL,
      rango ENUM('S', 'A', 'B', 'C') NOT NULL DEFAULT 'B',
      admin BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS recompensas (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      mision VARCHAR(80) NOT NULL,
      cristales INT UNSIGNED NOT NULL,
      autorizado_por VARCHAR(30) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  for (const cazador of CAZADORES_SEMILLA) {
    await pool.execute(
      `INSERT IGNORE INTO cazadores (id, sub, username, password, name, rango, admin)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        cazador.id,
        cazador.sub,
        cazador.username,
        cazador.password,
        cazador.name,
        cazador.rango,
        cazador.admin,
      ],
    );
  }
}
