// src/app/login/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Para saber si el usuario salió (blur) de cada campo, y así mostrar errores específicos
  const [touched, setTouched] = useState({ email: false, password: false });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Validaciones simples del formulario
  const validate = () => {
    if (!email.trim() || !password.trim()) {
      setError("El correo y la contraseña son obligatorios.");
      return false;
    }
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Formato de correo inválido.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    setError(null);
    setSuccess(null);

    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Credenciales inválidas.");
      } else {
        // Aquí guardas el token en localStorage (o cookie) según prefieras
        localStorage.setItem("token", data.token);
        setSuccess("Inicio de sesión exitoso. Redirigiendo...");
        // Opcional: redirigir luego de un rato
        setTimeout(() => {
          window.location.href = "/";
        }, 1200);
      }
    } catch (err) {
      console.error(err);
      setError("Error de red. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Iniciar Sesión
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded-md">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 text-green-700 px-4 py-2 mb-4 rounded-md">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Correo *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                touched.email && (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim()))
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {touched.email && !email.trim() && (
              <p className="text-red-600 text-sm mt-1">El correo es obligatorio.</p>
            )}
            {touched.email &&
              email.trim() &&
              !/^\S+@\S+\.\S+$/.test(email.trim()) && (
                <p className="text-red-600 text-sm mt-1">Formato de correo inválido.</p>
              )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Contraseña *
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                touched.password && !password.trim()
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {touched.password && !password.trim() && (
              <p className="text-red-600 text-sm mt-1">
                La contraseña es obligatoria.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-md transition disabled:opacity-50"
          >
            {loading ? "Validando..." : "Entrar"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="text-blue-500 hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
