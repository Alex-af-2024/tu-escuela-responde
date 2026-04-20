import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ALLOWED_DOMAIN, isValidInstitutionalEmail } from '../lib/supabase';

export default function SignupPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    /* ---- Client-side validations ---- */

    if (!isValidInstitutionalEmail(email)) {
      setError(`Solo se permiten correos ${ALLOWED_DOMAIN}`);
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    /* ---- Signup ---- */

    setSubmitting(true);
    const { error: authError } = await signUp(email, password, nombre || undefined);
    setSubmitting(false);

    if (authError) {
      setError(authError);
    } else {
      navigate('/verify-email', { replace: true });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Branding */}
        <div className="auth-header">
          <div className="auth-logo">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="10" fill="url(#grad2)" />
              <path d="M14 20h12M20 14v12" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
              <defs>
                <linearGradient id="grad2" x1="0" y1="0" x2="40" y2="40">
                  <stop stopColor="#D4A843" />
                  <stop offset="1" stopColor="#B8860B" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1>Crear Cuenta</h1>
          <p className="auth-subtitle">Regístrate con tu correo institucional</p>
        </div>

        {/* Error */}
        {error && (
          <div className="auth-error" role="alert">
            <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="signup-nombre">Nombre</label>
            <input
              id="signup-nombre"
              type="text"
              placeholder="Ej: María González"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              autoComplete="name"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="signup-email">Correo institucional</label>
            <input
              id="signup-email"
              type="email"
              placeholder={`usuario${ALLOWED_DOMAIN}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <span className="form-hint">Solo correos {ALLOWED_DOMAIN}</span>
          </div>

          <div className="form-group">
            <label htmlFor="signup-password">Contraseña</label>
            <input
              id="signup-password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="signup-confirm-password">Confirmar contraseña</label>
            <input
              id="signup-confirm-password"
              type="password"
              placeholder="Repite tu contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          {/* Rol badge — informational only */}
          <div className="role-badge">
            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
            </svg>
            <span>Tu cuenta será registrada como <strong>Estudiante</strong></span>
          </div>

          <button
            id="signup-submit"
            type="submit"
            className="btn-primary"
            disabled={submitting}
          >
            {submitting ? (
              <span className="btn-loading">
                <span className="spinner-small" />
                Creando cuenta…
              </span>
            ) : (
              'Crear Cuenta'
            )}
          </button>
        </form>

        <p className="auth-footer">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
