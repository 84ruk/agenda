// app/api/register/route.ts
import { NextResponse } from 'next/server';
import { connectToDatabase } from '../db';
import { UserModel } from '../models/User';

export async function POST(req: Request) {
  await connectToDatabase();
  const { email, password, name } = await req.json();

  if (!email || !password || !name) {
    return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
  }

  const exists = await UserModel.findOne({ email });
  if (exists) {
    return NextResponse.json({ error: 'El correo ya está registrado' }, { status: 409 });
  }

  // ✅ Crea el usuario (el modelo se encarga de hashear la contraseña)
  await UserModel.create({ email, password, name });

  return NextResponse.json({ message: 'Usuario creado correctamente' }, { status: 201 });
}
