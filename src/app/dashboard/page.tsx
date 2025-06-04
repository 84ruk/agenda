// app/dashboard/page.tsx
import { redirect } from 'next/navigation';
import { getUserFromServer } from '@/lib/auth/getUserFromServer';

export default function DashboardPage() {
  const user = getUserFromServer();

  if (!user) {
    redirect('/login'); // Redirige al login si no está autenticado
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Bienvenido, {user.email}</h1>
      {/* Aquí puedes renderizar los contactos */}
    </main>
  );
}
