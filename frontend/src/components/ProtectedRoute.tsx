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
      <div className="loading-screen">
        <div className="spinner" />
        <p>Cargando…</p>
      </div>
    );
  }

  // Not logged in
  if (!session || !user) {
    return <Navigate to="/login" replace />;
  }

  // Email not yet confirmed
  if (!user.email_confirmed_at) {
    return <Navigate to="/verify-email" replace />;
  }

  return <>{children}</>;
}
