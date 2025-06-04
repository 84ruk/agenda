// src/app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Agenda Telefónica",
  description: "Frontend de la agenda telefónica con Next.js y TailwindCSS",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col">
        <header className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto py-4 px-6">
            <h1 className="text-2xl font-semibold">Agenda Telefónica</h1>
          </div>
        </header>
        <main className="flex-1 max-w-4xl mx-auto w-full py-6 px-6">
          {children}
        </main>
        <footer className="bg-white border-t py-4 mt-auto">
          <div className="max-w-4xl mx-auto px-6 text-sm text-gray-500">
             {new Date().getFullYear()} Baruk Ramos
          </div>
        </footer>
      </body>
    </html>
  );
}
