import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../../services/supabase';
import { deleteUserAccount, signOut } from '../../shared/utils/auth';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  refresh: () => Promise<void>;
  deleteUser: () => Promise<void>;
};

const AuthContext = createContext({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const { data, error } = await supabase!.auth.getSession();
    if (error) console.error(error);
    setSession(data.session ?? null);
    setUser(data.session?.user ?? null);
  };

  const deleteUser = async () => {
    if (!confirm('This will permanently delete your account. Continue?'))
      return;
    setLoading(true);
    try {
      const data = await deleteUserAccount(user!.id);
      console.log(data, 'User signed out before deletion');
      await signOut();
    } catch (err: any) {
      console.error(err?.message ?? 'Delete error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      await refresh();
      if (mounted) setLoading(false);
    })();

    const { data: sub } = supabase!.auth.onAuthStateChange(
      (_event: any, newSession: any) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({ user, session, loading, refresh, deleteUser }),
    [user, session, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error('useAuthContext must be used within AuthProvider');
  return context;
};
