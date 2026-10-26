import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { cazadorService, JWT_SECRET } from "../services/cazador.service.js";
import { PerfilCazadorDTO } from "../dtos/cazador.dto.js";

export { JWT_SECRET };