import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function VerifyEmailPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-surface-900">
      <div className="w-full max-w-md glass rounded-3xl p-8 sm:p-10 border border-white/5
                    shadow-[0_8px_32px_rgba(0,0,0,0.4)] text-center animate-slide-up">
        {/* Mail icon */}
        <div className="text-gold-400 mb-4">
          <svg className="w-16 h-16 mx-auto" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="14" width="56" height="36" rx="4" stroke="currentColor" strokeWidth="3"/>
            <path d="M4 18l28 18 28-18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h1 className="text-xl font-bold text-gradient mb-3">Revisa tu correo</h1>

        <p className="text-sm text-gray-400 mb-2">
          Hemos enviado un enlace de verificación a{' '}
          <strong className="text-gray-200">{user?.email ?? 'tu correo institucional'}</strong>.
        </p>

        <p className="text-sm text-gray-500 mb-6">
          Haz clic en el enlace del correo para confirmar tu cuenta.
          Si no lo encuentras, revisa tu carpeta de spam.
        </p>

        <div className="h-px bg-white/5 mb-5" />

        <p className="text-sm text-gray-500">
          ¿Ya verificaste tu correo?{' '}
          <Link to="/login" className="text-gold-400 hover:text-gold-300 hover:underline transition-colors">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
