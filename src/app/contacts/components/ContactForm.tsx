// src/app/contacts/components/ContactForm.tsx
"use client";

import React, { useState, useEffect } from "react";

interface ContactFormProps {
  initialData: {
    _id?: string;
    nombre: string;
    apellido: string;
    telefono: string;
    email?: string;
  } | null;
  onSuccess: () => void;
  onCancel?: () => void;
}

export default function ContactForm({
  initialData,
  onSuccess,
  onCancel,
}: ContactFormProps) {
  const [nombre, setNombre] = useState(initialData?.nombre || "");
  const [apellido, setApellido] = useState(initialData?.apellido || "");
  const [telefono, setTelefono] = useState(initialData?.telefono || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({
    nombre: false,
    apellido: false,
    telefono: false,
    email: false,
  });

  useEffect(() => {
    setNombre(initialData?.nombre || "");
    setApellido(initialData?.apellido || "");
    setTelefono(initialData?.telefono || "");
    setEmail(initialData?.email || "");
    setError(null);
    setSuccessMessage(null);
    setTouched({ nombre: false, apellido: false, telefono: false, email: false });
  }, [initialData]);

  const validateFields = () => {
    if (!nombre.trim() || !apellido.trim() || !telefono.trim()) {
      setError("Los campos Nombre, Apellido y Teléfono son obligatorios.");
      return false;
    }
    const phoneRegex = /^[0-9- ]+$/;
    if (!phoneRegex.test(telefono.trim())) {
      setError("El campo Teléfono solo puede contener números, espacios o guiones.");
      return false;
    }
    if (email.trim()) {
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(email.trim())) {
        setError("El formato de Email no es válido.");
        return false;
      }
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      nombre: true,
      apellido: true,
      telefono: true,
      email: true,
    });

    if (!validateFields()) return;

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Definimos payload con tipo explícito
      const payload: {
        nombre: string;
        apellido: string;
        telefono: string;
        email?: string;
        id?: string;
      } = {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        telefono: telefono.trim(),
      };

      if (email.trim()) {
        payload.email = email.trim();
      }

      let res: Response;
      if (initialData && initialData._id) {
        payload.id = initialData._id;
        res = await fetch("/api/contacts", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/contacts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Ocurrió un error al guardar.");
      } else {
        const msg = initialData && initialData._id
          ? "Contacto actualizado correctamente."
          : "Contacto creado correctamente.";
        setSuccessMessage(msg);
        if (!initialData) {
          setNombre("");
          setApellido("");
          setTelefono("");
          setEmail("");
          setTouched({ nombre: false, apellido: false, telefono: false, email: false });
        }
        setTimeout(() => {
          setSuccessMessage(null);
          onSuccess();
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
    <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">
        {initialData ? "Editar Contacto" : "Nuevo Contacto"}
      </h2>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded-md">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="bg-green-100 text-green-700 px-4 py-2 mb-4 rounded-md">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre *</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, nombre: true }))}
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              touched.nombre && !nombre.trim() ? "border-red-500" : "border-gray-300"
            }`}
          />
          {touched.nombre && !nombre.trim() && (
            <p className="text-red-600 text-sm mt-1">El nombre es obligatorio.</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Apellido *</label>
          <input
            type="text"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, apellido: true }))}
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              touched.apellido && !apellido.trim() ? "border-red-500" : "border-gray-300"
            }`}
          />
          {touched.apellido && !apellido.trim() && (
            <p className="text-red-600 text-sm mt-1">El apellido es obligatorio.</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Teléfono *</label>
          <input
            type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, telefono: true }))}
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              touched.telefono && !telefono.trim() ? "border-red-500" : "border-gray-300"
            }`}
          />
          {touched.telefono && !telefono.trim() && (
            <p className="text-red-600 text-sm mt-1">El teléfono es obligatorio.</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              touched.email && email.trim() && !/^\S+@\S+\.\S+$/.test(email.trim())
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {touched.email && email.trim() && !/^\S+@\S+\.\S+$/.test(email.trim()) && (
            <p className="text-red-600 text-sm mt-1">Formato de email inválido.</p>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center space-x-3">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-md transition disabled:opacity-50"
        >
          {loading ? (initialData ? "Actualizando..." : "Guardando...") : initialData ? "Actualizar" : "Crear"}
        </button>
        {initialData && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-md transition"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
