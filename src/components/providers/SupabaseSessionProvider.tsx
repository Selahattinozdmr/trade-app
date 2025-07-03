'use client';
import { createBrowserClient } from '@supabase/ssr';
import {
  useState,
  useEffect,
  createContext,
  useContext,
  type ReactNode,
} from 'react';
import type { Session, SupabaseClient, User } from '@supabase/supabase-js';

type SupabaseContext = {
  supabase: SupabaseClient;
  session: Session | null;
  user: User | null;
  loading: boolean;
};

const Context = createContext<SupabaseContext | undefined>(undefined);

export function SupabaseProvider({
  children,
  initialSession,
}: {
  children: ReactNode;
  initialSession: Session | null;
}) {
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );

  const [session, setSession] = useState<Session | null>(initialSession);
  const [user, setUser] = useState<User | null>(initialSession?.user ?? null);
  const [loading, setLoading] = useState(!initialSession);

  useEffect(() => {
    const init = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const { data: sessionData } = await supabase.auth.getSession();

      setUser(userData.user);
      setSession(sessionData.session);
      setLoading(false);
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      init(); // Refresh session and user on auth change
    });

    init(); // Initial load

    return () => subscription.unsubscribe();
  }, [supabase]);

  const value: SupabaseContext = {
    supabase,
    session,
    user,
    loading,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export const useSupabase = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useSupabase must be used inside SupabaseProvider');
  }
  return context;
};
