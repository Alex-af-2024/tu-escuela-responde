import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ALLOWED_DOMAIN, isValidInstitutionalEmail } from '../lib/supabase';

export default function LoginPage() {
  const { signIn, configured } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValidInstitutionalEmail(email)) {
      setError(`Solo se permiten correos ${ALLOWED_DOMAIN}`);
      return;
    }

    setSubmitting(true);
    const { error: authError } = await signIn(email, password);
    setSubmitting(false);

    if (authError) {
      setError(authError);
    } else {
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-surface-900">
      <div className="w-full max-w-md glass rounded-3xl p-8 sm:p-10 border border-white/5
                    shadow-[0_8px_32px_rgba(0,0,0,0.4)] animate-slide-up">
        {/* Header */}
        <div className="text-center mb-7">
          <div className="inline-flex w-13 h-13 rounded-xl gradient-gold items-center justify-center mb-4
                        shadow-[0_4px_16px_rgba(212,168,67,0.3)]">
            <svg className="w-7 h-7 text-surface-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gradient">TuEscuelaResponde</h1>
          <p className="text-sm text-gray-500 mt-1">Inicia sesión con tu correo institucional</p>
        </div>

        {/* Setup notice */}
        {!configured && (
          <div className="mb-5 p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20
                        text-sm text-blue-300">
            <strong>⚙️ Configuración pendiente</strong>
            <p className="text-blue-400/70 text-xs mt-1">
              Copia <code className="bg-white/5 px-1.5 rounded text-xs">.env.example</code> a{' '}
              <code className="bg-white/5 px-1.5 rounded text-xs">.env</code> y completa tus credenciales.
            </p>
          </div>
        )}

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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Correo institucional
            </label>
            <input
              id="login-email"
              type="email"
              placeholder={`usuario${ALLOWED_DOMAIN}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              autoFocus
              className="w-full px-4 py-3 rounded-xl bg-white/4 border border-white/8
                         text-gray-100 placeholder:text-gray-600
                         focus:outline-none focus:border-gold-400/50 focus:ring-2 focus:ring-gold-400/20
                         transition-all text-sm"
            />
          </div>

          <div>
            <label htmlFor="login-password" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Contraseña
            </label>
            <input
              id="login-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="current-password"
              className="w-full px-4 py-3 rounded-xl bg-white/4 border border-white/8
                         text-gray-100 placeholder:text-gray-600
                         focus:outline-none focus:border-gold-400/50 focus:ring-2 focus:ring-gold-400/20
                         transition-all text-sm"
            />
          </div>

          <button
            id="login-submit"
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl gradient-gold text-surface-900 font-semibold text-sm mt-2
                       shadow-[0_2px_8px_rgba(212,168,67,0.3)]
                       hover:shadow-[0_4px_16px_rgba(212,168,67,0.45)] hover:-translate-y-0.5
                       active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed
                       transition-all duration-200"
          >
            {submitting ? 'Ingresando…' : 'Iniciar Sesión'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          ¿No tienes cuenta?{' '}
          <Link to="/signup" className="text-gold-400 hover:text-gold-300 hover:underline transition-colors">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
