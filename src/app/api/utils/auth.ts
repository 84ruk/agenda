// src/app/api/lib/auth.ts
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export function getUserFromRequest(): { userId: string; email: string; rol: string } | null {
  const token = cookies().get("token")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
      rol: string;
    };
    return decoded;
  } catch (err) {
    console.error("Token inválido:", err);
    return null;
  }
}
