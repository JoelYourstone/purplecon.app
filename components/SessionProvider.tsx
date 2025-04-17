import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { PropsWithChildren } from "react";
import { Alert } from "react-native";
import { useSplashContext } from "./SplashProvider";

type SessionContextType = {
  session: Session | null;
  isLoggedIn: boolean;
  profile: Profile | null;
  updateProfile: (profile: Profile) => Promise<void>;
  loading: boolean;
};

type Profile = {
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
};

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  const { setHasFinishedSupabaseLoading } = useSplashContext();

  useEffect(() => {
    async function getSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      if (session?.user?.id) {
        const { data, error, status } = await supabase
          .from("profiles")
          .select(`first_name, last_name, avatar_url, is_admin`)
          .eq("id", session.user.id)
          .single();
        if (error && status !== 406) {
          setHasFinishedSupabaseLoading(true);
          throw error;
        }
        setProfile(data);
        setHasFinishedSupabaseLoading(true);
      } else {
        setHasFinishedSupabaseLoading(true);
      }
    }

    getSession();

    supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user?.id) {
        const { data, error, status } = await supabase
          .from("profiles")
          .select(`first_name, last_name, avatar_url, is_admin`)
          .eq("id", session.user.id)
          .single();
        if (error && status !== 406) {
          setHasFinishedSupabaseLoading(true);
          throw error;
        }
        setProfile(data);
      }
      setHasFinishedSupabaseLoading(true);
    });

    setTimeout(() => {
      setHasFinishedSupabaseLoading(true);
    }, 5000);
  }, [setHasFinishedSupabaseLoading]);

  async function updateProfile({ first_name, last_name, avatar_url }: Profile) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const updates = {
        id: session?.user.id,
        first_name,
        last_name,
        avatar_url,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        throw error;
      }

      setProfile((p) => ({
        ...p!,
        first_name,
        last_name,
        avatar_url,
      }));
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <SessionContext.Provider
      value={{
        session,
        isLoggedIn: !!session,
        profile,
        updateProfile,
        loading,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const session = useContext(SessionContext);
  if (!session) {
    throw new Error("SessionProvider not found");
  }
  return session;
}
