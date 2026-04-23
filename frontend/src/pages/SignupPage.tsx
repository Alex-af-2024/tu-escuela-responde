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

    setSubmitting(true);
    const { error: authError } = await signUp(email, password, nombre || undefined);
    setSubmitting(false);

    if (authError) {
      setError(authError);
    } else {
      navigate('/verify-email', { replace: true });
    }
  };

  const inputClasses = `w-full px-4 py-3 rounded-xl bg-white/4 border border-white/8
                        text-gray-100 placeholder:text-gray-600
                        focus:outline-none focus:border-gold-400/50 focus:ring-2 focus:ring-gold-400/20
                        transition-all text-sm`;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-surface-900">
      <div className="w-full max-w-md glass rounded-3xl p-8 sm:p-10 border border-white/5
                    shadow-[0_8px_32px_rgba(0,0,0,0.4)] animate-slide-up">
        {/* Header */}
        <div className="text-center mb-7">
          <div className="inline-flex w-13 h-13 rounded-xl gradient-gold items-center justify-center mb-4
                        shadow-[0_4px_16px_rgba(212,168,67,0.3)]">
            <svg className="w-7 h-7 text-surface-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 6v12M6 12h12" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gradient">Crear Cuenta</h1>
          <p className="text-sm text-gray-500 mt-1">Regístrate con tu correo institucional</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20
                        text-sm text-red-300 flex items-center gap-2.5 animate-fade-in">
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="signup-nombre" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Nombre
            </label>
            <input id="signup-nombre" type="text" placeholder="Ej: María González"
              value={nombre} onChange={(e) => setNombre(e.target.value)}
              autoComplete="name" autoFocus className={inputClasses} />
          </div>

          <div>
            <label htmlFor="signup-email" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Correo institucional
            </label>
            <input id="signup-email" type="email" placeholder={`usuario${ALLOWED_DOMAIN}`}
              value={email} onChange={(e) => setEmail(e.target.value)}
              required autoComplete="email" className={inputClasses} />
            <span className="text-xs text-gray-600 mt-1 block">Solo correos {ALLOWED_DOMAIN}</span>
          </div>

          <div>
            <label htmlFor="signup-password" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Contraseña
            </label>
            <input id="signup-password" type="password" placeholder="Mínimo 6 caracteres"
              value={password} onChange={(e) => setPassword(e.target.value)}
              required minLength={6} autoComplete="new-password" className={inputClasses} />
          </div>

          <div>
            <label htmlFor="signup-confirm" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Confirmar contraseña
            </label>
            <input id="signup-confirm" type="password" placeholder="Repite tu contraseña"
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
              required minLength={6} autoComplete="new-password" className={inputClasses} />
          </div>

          {/* Role badge */}
          <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl
                        bg-gold-400/8 border border-gold-400/15 text-xs text-gold-400">
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
            </svg>
            <span>Tu cuenta será registrada como <strong>Estudiante</strong></span>
          </div>

          <button
            id="signup-submit" type="submit" disabled={submitting}
            className="w-full py-3 rounded-xl gradient-gold text-surface-900 font-semibold text-sm mt-2
                       shadow-[0_2px_8px_rgba(212,168,67,0.3)]
                       hover:shadow-[0_4px_16px_rgba(212,168,67,0.45)] hover:-translate-y-0.5
                       active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed
                       transition-all duration-200"
          >
            {submitting ? 'Creando cuenta…' : 'Crear Cuenta'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-gold-400 hover:text-gold-300 hover:underline transition-colors">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
