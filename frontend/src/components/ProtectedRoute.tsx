import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Wraps a route so that only authenticated (and email-verified) users
 * can access it. Redirects to /login otherwise.
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { session, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-surface-900">
        <div className="w-9 h-9 border-3 border-white/15 border-t-gold-400 rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Cargando…</p>
      </div>
    );
  }

  if (!session || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.email_confirmed_at) {
    return <Navigate to="/verify-email" replace />;
  }

  return <>{children}</>;
}
