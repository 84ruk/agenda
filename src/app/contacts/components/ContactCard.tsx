// src/app/contacts/components/ContactCard.tsx
"use client";

import React from "react";

export interface Contact {
  _id: string;
  nombre: string;
  apellido: string;
  telefono: string;
  email?: string;
}

interface ContactCardProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
}

export default function ContactCard({ contact, onEdit, onDelete }: ContactCardProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between">
      <div>
        <h2 className="text-lg font-medium text-gray-800">
          {contact.nombre} {contact.apellido}
        </h2>
        <p className="text-gray-600 mt-1">
          <span className="font-semibold">Tel:</span> {contact.telefono}
        </p>
        {contact.email && (
          <p className="text-gray-600 mt-1">
            <span className="font-semibold">Email:</span> {contact.email}
          </p>
        )}
      </div>
      <div className="mt-4 flex justify-end space-x-2">
        <button
          onClick={() => onEdit(contact)}
          className="px-3 py-1 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-md transition"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(contact._id)}
          className="px-3 py-1 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-md transition"
        >
          Borrar
        </button>
      </div>
    </div>
  );
}
