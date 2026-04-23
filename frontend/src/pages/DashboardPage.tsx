import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

export default function DashboardPage() {
  const { user, usuario } = useAuth();

  const rolLabels: Record<string, string> = {
    admin: 'Administrador',
    estudiante: 'Estudiante',
    autoridad: 'Autoridad',
  };

  const rolColors: Record<string, string> = {
    admin: 'bg-purple-500/15 text-purple-400',
    estudiante: 'bg-blue-500/15 text-blue-400',
    autoridad: 'bg-amber-500/15 text-amber-400',
  };

  return (
    <div className="min-h-screen bg-surface-900">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <div className="glass rounded-3xl p-8 sm:p-10 border border-white/5
                      shadow-[0_8px_32px_rgba(0,0,0,0.4)] text-center animate-slide-up">
          {/* Avatar */}
          <div className="inline-flex w-18 h-18 rounded-full gradient-gold items-center justify-center
                        text-surface-900 text-2xl font-bold mb-4
                        shadow-[0_4px_20px_rgba(212,168,67,0.25)]">
            {(usuario?.nombre_display ?? user?.email ?? '?')[0].toUpperCase()}
          </div>

          <h1 className="text-xl font-bold text-gradient mb-6">
            ¡Bienvenido, {usuario?.nombre_display ?? user?.email?.split('@')[0]}!
          </h1>

          {/* Profile info */}
          <div className="flex flex-col rounded-2xl overflow-hidden border border-white/5 divide-y divide-white/5">
            <div className="flex items-center justify-between px-5 py-3.5 bg-surface-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">Correo</span>
              <span className="text-sm text-gray-400">{user?.email}</span>
            </div>

            <div className="flex items-center justify-between px-5 py-3.5 bg-surface-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">Rol</span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide
                              ${rolColors[usuario?.rol ?? 'estudiante']}`}>
                {rolLabels[usuario?.rol ?? 'estudiante']}
              </span>
            </div>

            <div className="flex items-center justify-between px-5 py-3.5 bg-surface-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">Estado</span>
              <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-dot" />
                Verificado
              </span>
            </div>

            <div className="flex items-center justify-between px-5 py-3.5 bg-surface-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">Miembro desde</span>
              <span className="text-sm text-gray-400">
                {usuario?.created_at
                  ? new Date(usuario.created_at).toLocaleDateString('es-CL', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })
                  : '—'}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
