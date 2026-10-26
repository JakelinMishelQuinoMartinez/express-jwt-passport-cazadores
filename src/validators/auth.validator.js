import { body, validationResult } from "express-validator";

const responderErrores = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  next();
};

export const validarLogin = [
  body("username").trim().isLength({ min: 3, max: 30 }).withMessage("El username debe tener entre 3 y 30 caracteres"),
  body("password").isLength({ min: 4, max: 60 }).withMessage("El password debe tener al menos 4 caracteres"),
  responderErrores,
];