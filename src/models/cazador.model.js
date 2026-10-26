import { Schema, model } from "mongoose";

const cazadorSchema = new Schema({
  sub: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  rango: { type: String, enum: ["S", "A", "B", "C"], default: "B" },
  admin: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });

export const Cazador = model("Cazador", cazadorSchema);