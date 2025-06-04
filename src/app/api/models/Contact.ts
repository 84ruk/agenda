// src/app/api/models/Contact.ts
import { Schema, model, models, Document, Types } from "mongoose";

export interface IContact extends Document {
  nombre: string;
  apellido: string;
  telefono: string;
  email?: string;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio."],
      trim: true,
      maxlength: [100, "El nombre no puede superar 100 caracteres."],
    },
    apellido: {
      type: String,
      required: [true, "El apellido es obligatorio."],
      trim: true,
      maxlength: [100, "El apellido no puede superar 100 caracteres."],
    },
    telefono: {
      type: String,
      required: [true, "El teléfono es obligatorio."],
      trim: true,
      maxlength: [15, "El teléfono no puede superar 15 caracteres."],
    },
    email: {
      type: String,
      required: false,
      trim: true,
      maxlength: [200, "El email no puede superar 200 caracteres."],
      match: [/^\S+@\S+\.\S+$/, "El email no tiene un formato válido."],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El ID del usuario es obligatorio."],
    },
  },
  {
    timestamps: true,
    collection: "contacts",
  }
);

// Para evitar el error “OverwriteModelError” en desarrollo
export const ContactModel =
  models.Contact || model<IContact>("Contact", ContactSchema);
