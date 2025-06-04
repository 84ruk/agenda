// src/app/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import ContactCard, { Contact as ContactType } from "./contacts/components/ContactCard";
import ContactForm from "./contacts/components/ContactForm";

export default function HomePage() {
  const [contacts, setContacts] = useState<ContactType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Si estamos editando, guardamos el contacto; si es null, el formulario va en modo “crear”
  const [editingContact, setEditingContact] = useState<ContactType | null>(null);

  const fetchContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/contacts");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al cargar contactos.");
      } else {
        setContacts(data);
      }
    } catch (err) {
      console.error(err);
      setError("Error de red al cargar contactos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este contacto?")) return;
    try {
      const res = await fetch(`/api/contacts?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Error al eliminar.");
      } else {
        fetchContacts();
      }
    } catch (err) {
      console.error(err);
      alert("Error de red al eliminar.");
    }
  };

  const handleEdit = (contact: ContactType) => {
    setEditingContact(contact);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingContact(null);
  };

  const handleSuccess = () => {
    setEditingContact(null);
    fetchContacts();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Formulario (crear / editar) */}
      <div className="max-w-4xl mx-auto py-6 px-4">
        <ContactForm
          initialData={editingContact}
          onSuccess={handleSuccess}
          onCancel={editingContact ? handleCancelEdit : undefined}
        />
      </div>

      {/* Mensaje de carga o error */}
      <div className="max-w-4xl mx-auto px-4">
        {loading && (
          <p className="text-center text-gray-600">Cargando contactos...</p>
        )}
        {error && (
          <p className="text-center text-red-500 mt-4">{error}</p>
        )}
      </div>

      {/* Grid de tarjetas */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {!loading && !error && contacts.length === 0 && (
          <p className="text-center text-gray-600 mt-6">
            No hay contactos en la agenda. ¡Agrega uno arriba!
          </p>
        )}

        {!loading && !error && contacts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {contacts.map((c) => (
              <ContactCard
                key={c._id}
                contact={c}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
