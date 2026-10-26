import { PerfilCazadorDTO, CrearRecompensaDTO } from "../dtos/cazador.dto.js";
import { cazadorService } from "../services/cazador.service.js";

export async function autenticarUsuario(req, res, next) {
  try {
    const token = cazadorService.firmarTokenJWT(req.user);
    const perfil = new PerfilCazadorDTO(req.user);
    res.status(200).json({ token, tipo: "Bearer", expiraEn: "2h", cazador: perfil });
  } catch (error) { next(error); }
}