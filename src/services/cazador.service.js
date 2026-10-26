import jwt from "jsonwebtoken";
import { CAZADORES_SEMILLA } from "../models/cazador.model.js";
import { PerfilCazadorDTO } from "../dtos/cazador.dto.js";

export const JWT_SECRET = process.env.JWT_SECRET || "campuslands_secret_key_256_bits";
export const JWT_EXPIRES_IN = "2h";
const recompensasMemoria = [];