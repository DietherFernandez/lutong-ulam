// AuthContext: wraps the Supabase session lifecycle.
// Shows a clear "setup required" state when .env is not yet configured.
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { authApi } from '../api';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  needsSetup: boolean; // true when VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are missing
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(!isSupabaseConfigured);

  useEffect(() => {
    setNeedsSetup(!isSupabaseConfigured);

    // If Supabase is not configured, skip all session calls — just set loading=false.
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // Grab current session (handles page refresh).
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? '',
          username: (session.user.email ?? '').split('@')[0],
          role: 'admin',
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Listen for future session changes.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email ?? '',
            username: (session.user.email ?? '').split('@')[0],
            role: 'admin',
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await authApi.login(email, password);
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, needsSetup }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
