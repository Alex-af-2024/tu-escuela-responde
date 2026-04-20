import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Usuario } from '../types/usuario';

/* ------------------------------------------------------------------ */
/*  Context shape                                                      */
/* ------------------------------------------------------------------ */

interface AuthState {
  /** Supabase session (null while loading or when logged out) */
  session: Session | null;
  /** Supabase Auth user object */
  user: User | null;
  /** Application-level profile from the `usuario` table */
  usuario: Usuario | null;
  /** True while the initial auth check is in progress */
  loading: boolean;
  /** Whether Supabase is properly configured */
  configured: boolean;

  /** Sign in with email + password */
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  /** Create a new account (always estudiante) */
  signUp: (email: string, password: string, nombreDisplay?: string) => Promise<{ error: string | null }>;
  /** Log out */
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

/* ------------------------------------------------------------------ */
/*  Provider component                                                 */
/* ------------------------------------------------------------------ */

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---------- fetch usuario profile ---------- */
  const fetchUsuario = useCallback(async (authUid: string) => {
    const { data, error } = await supabase
      .from('usuario')
      .select('*')
      .eq('auth_uid', authUid)
      .single();

    if (error) {
      console.error('Error fetching usuario profile:', error.message);
      setUsuario(null);
    } else {
      setUsuario(data as Usuario);
    }
  }, []);

  /* ---------- bootstrap: listen for auth changes ---------- */
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // Get the initial session
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        fetchUsuario(s.user.id);
      }
      setLoading(false);
    });

    // Subscribe to future changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        fetchUsuario(s.user.id);
      } else {
        setUsuario(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchUsuario]);

  /* ---------- auth actions ---------- */

  const signIn = useCallback(
    async (email: string, password: string): Promise<{ error: string | null }> => {
      if (!isSupabaseConfigured) return { error: 'Supabase no está configurado.' };
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      return { error: null };
    },
    [],
  );

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      nombreDisplay?: string,
    ): Promise<{ error: string | null }> => {
      if (!isSupabaseConfigured) return { error: 'Supabase no está configurado.' };
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nombre_display: nombreDisplay ?? email.split('@')[0],
          },
        },
      });
      if (error) return { error: error.message };
      return { error: null };
    },
    [],
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setUsuario(null);
  }, []);

  /* ---------- render ---------- */

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        usuario,
        loading,
        configured: isSupabaseConfigured,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
}
