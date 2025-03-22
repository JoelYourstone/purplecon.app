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
};

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  const { setHasFinishedSupabaseLoading } = useSplashContext();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session?.user?.id) {
        const { data, error, status } = await supabase
          .from("profiles")
          .select(`first_name, last_name, avatar_url`)
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
    });

    supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user?.id) {
        const { data, error, status } = await supabase
          .from("profiles")
          .select(`first_name, last_name, avatar_url`)
          .eq("id", session.user.id)
          .single();
        if (error && status !== 406) {
          throw error;
        }
        setProfile(data);
      }
    });
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

      setProfile(updates);
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
