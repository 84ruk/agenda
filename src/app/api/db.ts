import mongoose from "mongoose";

if (!process.env.MONGODB_URI) {
  throw new Error(
    "Por favor define la variable de entorno MONGODB_URI en .env.local o en Vercel"
  );
}

const uri = process.env.MONGODB_URI;

// Evita múltiples conexiones en modo desarrollo con hot-reload
declare global {
  // Agregamos este tipo al objeto global para cachear la conexión
  // eslint-disable-next-line no-var
  var _mongoConnection: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose>;
  } | undefined;
}

let cached = global._mongoConnection;

if (!cached) {
  cached = { conn: null, promise: mongoose.connect(uri, { dbName: "agenda" }) };
  global._mongoConnection = cached;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached!.conn) {
    return cached!.conn;
  }
  const conn = await cached!.promise;
  cached!.conn = conn;
  return conn;
}