import express from "express";
import cors from "cors";
import { configurarPassport } from "./config/passport.js";
import { inicializarBaseDatos } from "./config/database.js";
import { authRouter } from "./routes/auth.routes.js";
import { manejarError, rutaNoEncontrada } from "./middlewares/error.middleware.js";

const API_VERSION = "1.0.0";
const app = express();
const passport = configurarPassport();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use((req, res, next) => {
  res.set("X-API-Version", API_VERSION);
  next();
});

app.get("/health", (req, res) => {
  res.status(200).json({ estado: "ok", version: API_VERSION, servicio: "api-jwt-passport-gremio" });
});

app.use("/api/v1", authRouter);
app.use(rutaNoEncontrada);
app.use(manejarError);

const PORT = process.env.PORT || 4000;

async function iniciarServidor() {
  await inicializarBaseDatos();
  app.listen(PORT, () => {
    console.log(`API escuchando en http://localhost:${PORT}`);
  });
}

iniciarServidor().catch((error) => {
  console.error("No se pudo iniciar la API o conectar con MySQL:", error);
  process.exitCode = 1;
});

export default app;