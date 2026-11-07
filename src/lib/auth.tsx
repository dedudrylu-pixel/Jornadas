import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { ProfileRow } from '@/lib/supabase';

interface AuthState {
  session: Session | null;
  profile: ProfileRow | null;
  loading: boolean;
  isAdmin: boolean;
}

interface AuthContextValue extends AuthState {
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    session: null,
    profile: null,
    loading: true,
    isAdmin: false,
  });

  const fetchProfile = useCallback(async (uid: string): Promise<ProfileRow | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, role, created_at')
      .eq('id', uid)
      .maybeSingle();
    if (error) return null;
    return data as ProfileRow | null;
  }, []);

  const refreshProfile = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));
    const { data: { session: sess } } = await supabase.auth.getSession();
    if (!sess) {
      setState({ session: null, profile: null, loading: false, isAdmin: false });
      return;
    }
    const profile = await fetchProfile(sess.user.id);
    setState({
      session: sess,
      profile,
      loading: false,
      isAdmin: profile?.role === 'admin',
    });
  }, [fetchProfile]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data: { session: sess } } = await supabase.auth.getSession();
      if (!mounted) return;
      if (!sess) {
        setState({ session: null, profile: null, loading: false, isAdmin: false });
        return;
      }
      const profile = await fetchProfile(sess.user.id);
      if (!mounted) return;
      setState({
        session: sess,
        profile,
        loading: false,
        isAdmin: profile?.role === 'admin',
      });
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        if (!session) {
          setState({ session: null, profile: null, loading: false, isAdmin: false });
          return;
        }
        const profile = await fetchProfile(session.user.id);
        setState({
          session,
          profile,
          loading: false,
          isAdmin: profile?.role === 'admin',
        });
      })();
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setState({ session: null, profile: null, loading: false, isAdmin: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, refreshProfile, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
