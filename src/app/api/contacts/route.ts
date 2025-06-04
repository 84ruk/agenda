import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "../db";
import { ContactModel } from "../models/Contact";
import { getUserFromRequest } from "../utils/auth";

// Función auxiliar para respuestas de error JSON
function errorResponse(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status });
}

type ContactBody = {
  nombre: string;
  apellido: string;
  telefono: string;
  email?: string;
};

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const user = await getUserFromRequest();
    if (!user) return errorResponse("No autorizado. Token inválido o ausente.", 401);

    const url = new URL(request.url);
    const idParam = url.searchParams.get("id");

    if (idParam) {
      if (!mongoose.Types.ObjectId.isValid(idParam)) {
        return errorResponse("El parámetro 'id' no es un ObjectId válido.", 400);
      }

      const contact = await ContactModel.findOne({ _id: idParam, userId: user.userId }).exec();
      if (!contact) {
        return errorResponse(`No existe contacto con id=${idParam}.`, 404);
      }
      return NextResponse.json(contact);
    } else {
      const contactos = await ContactModel.find({ userId: user.userId })
        .sort({ createdAt: -1 })
        .exec();
      return NextResponse.json(contactos);
    }
  } catch (err: unknown) {
    console.error("Error en GET /api/contacts:", err);
    return errorResponse("Error interno al leer contactos.", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const user = await getUserFromRequest();
    if (!user) return errorResponse("No autorizado. Token inválido o ausente.", 401);

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return errorResponse("Body inválido. Debe ser JSON.", 400);
    }

    const { nombre, apellido, telefono, email } = body as ContactBody;

    if (!nombre || typeof nombre !== "string") {
      return errorResponse("El campo 'nombre' es obligatorio y debe ser string.", 400);
    }
    if (!apellido || typeof apellido !== "string") {
      return errorResponse("El campo 'apellido' es obligatorio y debe ser string.", 400);
    }
    if (!telefono || typeof telefono !== "string") {
      return errorResponse("El campo 'telefono' es obligatorio y debe ser string.", 400);
    }
    if (email !== undefined && typeof email !== "string") {
      return errorResponse("El campo 'email', de existir, debe ser string.", 400);
    }

    try {
      const nuevo = await ContactModel.create({
        nombre,
        apellido,
        telefono,
        email,
        userId: user.userId,
      });
      return NextResponse.json(nuevo, { status: 201 });
    } catch (err: unknown) {
      if (err && typeof err === "object" && "name" in err) {
        if ((err as any).name === "ValidationError") {
          const validationErr = err as any;
          const firstError = Object.values(validationErr.errors)[0] as any;
          return errorResponse(firstError.message, 400);
        }
        if ("code" in err && (err as any).code === 11000) {
          const duplicatedField = Object.keys((err as any).keyPattern)[0];
          return errorResponse(`Ya existe un contacto con ese mismo "${duplicatedField}".`, 409);
        }
      }
      console.error("Error al crear contacto (catch POST):", err);
      return errorResponse("Error interno al crear contacto.", 500);
    }
  } catch (err: unknown) {
    console.error("Error en POST /api/contacts:", err);
    return errorResponse("Error interno al procesar la petición.", 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase();
    const user = await getUserFromRequest();
    if (!user) return errorResponse("No autorizado. Token inválido o ausente.", 401);

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return errorResponse("Body inválido. Debe ser JSON.", 400);
    }

    const { id, nombre, apellido, telefono, email } = body as any;

    if (!id || typeof id !== "string") {
      return errorResponse("Debes enviar el campo 'id' (string) para actualizar.", 400);
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse("El campo 'id' no es un ObjectId válido.", 400);
    }

    const existente = await ContactModel.findOne({ _id: id, userId: user.userId }).exec();
    if (!existente) {
      return errorResponse(`No existe contacto con id=${id}.`, 404);
    }

    if (nombre !== undefined) {
      if (typeof nombre !== "string") {
        return errorResponse("Si envías 'nombre', debe ser string.", 400);
      }
      existente.nombre = nombre;
    }
    if (apellido !== undefined) {
      if (typeof apellido !== "string") {
        return errorResponse("Si envías 'apellido', debe ser string.", 400);
      }
      existente.apellido = apellido;
    }
    if (telefono !== undefined) {
      if (typeof telefono !== "string") {
        return errorResponse("Si envías 'telefono', debe ser string.", 400);
      }
      existente.telefono = telefono;
    }
    if (email !== undefined) {
      if (typeof email !== "string") {
        return errorResponse("Si envías 'email', debe ser string.", 400);
      }
      existente.email = email;
    }

    try {
      const actualizado = await existente.save();
      return NextResponse.json(actualizado);
    } catch (err: unknown) {
      if (err && typeof err === "object" && "name" in err) {
        if ((err as any).name === "ValidationError") {
          const validationErr = err as any;
          const firstError = Object.values(validationErr.errors)[0] as any;
          return errorResponse(firstError.message, 400);
        }
        if ("code" in err && (err as any).code === 11000) {
          const duplicatedField = Object.keys((err as any).keyPattern)[0];
          return errorResponse(
            `No se pudo actualizar: ya existe otro contacto con ese mismo "${duplicatedField}".`,
            409
          );
        }
      }
      console.error("Error al actualizar contacto (catch PUT):", err);
      return errorResponse("Error interno al actualizar contacto.", 500);
    }
  } catch (err: unknown) {
    console.error("Error en PUT /api/contacts:", err);
    return errorResponse("Error interno al procesar la petición.", 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase();
    const user = await getUserFromRequest();
    if (!user) return errorResponse("No autorizado. Token inválido o ausente.", 401);

    const url = new URL(request.url);
    const idParam = url.searchParams.get("id");

    if (!idParam) {
      return errorResponse("Debes especificar 'id' en query params.", 400);
    }
    if (!mongoose.Types.ObjectId.isValid(idParam)) {
      return errorResponse("El parámetro 'id' no es un ObjectId válido.", 400);
    }

    const eliminado = await ContactModel.findOneAndDelete({
      _id: idParam,
      userId: user.userId,
    }).exec();

    if (!eliminado) {
      return errorResponse(`No existe contacto con id=${idParam}.`, 404);
    }
    return NextResponse.json({ message: `Contacto con id=${idParam} eliminado.` });
  } catch (err: unknown) {
    console.error("Error en DELETE /api/contacts:", err);
    return errorResponse("Error interno al eliminar contacto.", 500);
  }
}
