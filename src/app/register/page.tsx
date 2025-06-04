// src/app/register/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Validaciones en cliente
  const validate = () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Todos los campos con * son obligatorios.");
      return false;
    }
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Formato de correo inválido.");
      return false;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true, confirmPassword: true });
    setError(null);
    setSuccess(null);

    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password: password.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al registrarse.");
      } else {
        setSuccess("Registro exitoso. Redirigiendo al login...");
        setTimeout(() => {
          window.location.href = "/login";
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
          Crear Cuenta
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
            <label className="block text-sm font-medium text-gray-700">Nombre *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                touched.name && !name.trim() ? "border-red-500" : "border-gray-300"
              }`}
            />
            {touched.name && !name.trim() && (
              <p className="text-red-600 text-sm mt-1">El nombre es obligatorio.</p>
            )}
          </div>

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
                touched.email &&
                (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim()))
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
              Contraseña * (mín. 6 car.)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                touched.password && password.length < 6
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {touched.password && password.length < 6 && (
              <p className="text-red-600 text-sm mt-1">
                Mínimo 6 caracteres para la contraseña.
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Confirmar Contraseña *
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, confirmPassword: true }))}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                touched.confirmPassword && confirmPassword !== password
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {touched.confirmPassword && confirmPassword !== password && (
              <p className="text-red-600 text-sm mt-1">
                Las contraseñas no coinciden.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-md transition disabled:opacity-50"
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Inicia Sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
