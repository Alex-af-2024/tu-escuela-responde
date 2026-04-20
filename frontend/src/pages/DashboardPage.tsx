import { useAuth } from '../contexts/AuthContext';

export default function DashboardPage() {
  const { user, usuario, signOut } = useAuth();

  const rolLabels: Record<string, string> = {
    admin: 'Administrador',
    estudiante: 'Estudiante',
    autoridad: 'Autoridad',
  };

  return (
    <div className="dashboard-page">
      {/* Top nav */}
      <header className="dashboard-header">
        <div className="dashboard-brand">
          <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" fill="url(#dbGrad)" />
            <path d="M10 16l4 4 8-10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <defs>
              <linearGradient id="dbGrad" x1="0" y1="0" x2="32" y2="32">
                <stop stopColor="#D4A843" />
                <stop offset="1" stopColor="#B8860B" />
              </linearGradient>
            </defs>
          </svg>
          <span>TuEscuelaResponde</span>
        </div>

        <button id="logout-button" className="btn-outline" onClick={signOut}>
          Cerrar sesión
        </button>
      </header>

      {/* Main content */}
      <main className="dashboard-main">
        <div className="welcome-card">
          <div className="welcome-avatar">
            {(usuario?.nombre_display ?? user?.email ?? '?')[0].toUpperCase()}
          </div>

          <h1>
            ¡Bienvenido, {usuario?.nombre_display ?? user?.email?.split('@')[0]}!
          </h1>

          <div className="profile-info">
            <div className="info-row">
              <span className="info-label">Correo</span>
              <span className="info-value">{user?.email}</span>
            </div>

            <div className="info-row">
              <span className="info-label">Rol</span>
              <span className={`role-chip role-${usuario?.rol ?? 'estudiante'}`}>
                {rolLabels[usuario?.rol ?? 'estudiante']}
              </span>
            </div>

            <div className="info-row">
              <span className="info-label">Estado</span>
              <span className="status-chip status-active">
                <span className="status-dot" />
                Verificado
              </span>
            </div>

            <div className="info-row">
              <span className="info-label">Miembro desde</span>
              <span className="info-value">
                {usuario?.created_at
                  ? new Date(usuario.created_at).toLocaleDateString('es-CL', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
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
