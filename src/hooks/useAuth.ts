import { useSupabase } from "@/components/providers/SupabaseSessionProvider";
import { useRouter } from "next/navigation";

export function useAuth() {
  const { supabase, session, user, loading } = useSupabase();
  const router = useRouter();

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const signInWithEmail = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signUpWithEmail = async (email: string, password: string) => {
    return await supabase.auth.signUp({ email, password });
  };

  const signInWithGoogle = async () => {
    return await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return {
    user,
    session,
    loading,
    signOut,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    isAuthenticated: !!user,
  };
}
