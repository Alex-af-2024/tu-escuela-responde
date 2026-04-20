import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function VerifyEmailPage() {
  const { user } = useAuth();

  return (
    <div className="auth-page">
      <div className="auth-card verify-card">
        {/* Mail icon */}
        <div className="verify-icon">
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="14" width="56" height="36" rx="4" stroke="currentColor" strokeWidth="3"/>
            <path d="M4 18l28 18 28-18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h1>Revisa tu correo</h1>

        <p className="verify-text">
          Hemos enviado un enlace de verificación a{' '}
          <strong>{user?.email ?? 'tu correo institucional'}</strong>.
        </p>

        <p className="verify-text">
          Haz clic en el enlace del correo para confirmar tu cuenta.
          Si no lo encuentras, revisa tu carpeta de spam.
        </p>

        <div className="verify-divider" />

        <p className="auth-footer" style={{ marginTop: 0 }}>
          ¿Ya verificaste tu correo?{' '}
          <Link to="/login">Iniciar sesión</Link>
        </p>
      </div>
    </div>
  );
}
