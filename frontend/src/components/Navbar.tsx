import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Top navigation bar. Shows brand + auth controls.
 * Sticky on scroll with glass blur effect.
 */
export default function Navbar() {
  const { session, usuario, signOut } = useAuth();

  return (
    <header
      className="sticky top-0 z-50 border-b border-white/5
                 bg-surface-900/80 backdrop-blur-xl"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center
                        shadow-[0_2px_8px_rgba(212,168,67,0.25)]
                        group-hover:shadow-[0_2px_12px_rgba(212,168,67,0.4)]
                        transition-shadow">
            <svg className="w-4.5 h-4.5 text-surface-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="font-semibold text-sm text-gray-100 hidden sm:block">
            TuEscuelaResponde
          </span>
        </Link>

        {/* Auth controls */}
        <div className="flex items-center gap-3">
          {session ? (
            <>
              <span className="text-xs text-gray-500 hidden sm:block">
                {usuario?.nombre_display ?? session.user.email?.split('@')[0]}
              </span>
              <button
                id="navbar-logout"
                onClick={signOut}
                className="px-3 py-1.5 rounded-lg text-xs font-medium
                           border border-white/8 text-gray-400
                           hover:border-gold-400/30 hover:text-gold-400 hover:bg-gold-400/5
                           transition-all duration-200"
              >
                Salir
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 py-1.5 rounded-lg text-xs font-medium
                         gradient-gold text-surface-900
                         shadow-[0_2px_8px_rgba(212,168,67,0.25)]
                         hover:shadow-[0_2px_16px_rgba(212,168,67,0.4)]
                         transition-shadow"
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
