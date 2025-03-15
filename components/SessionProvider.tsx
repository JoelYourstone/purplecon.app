import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { PropsWithChildren } from "react";

type SessionContextType = {
  session: Session | null;
  isLoggedIn: boolean;
  profile: Profile | null;
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
          throw error;
        }
        setProfile(data);
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
  }, []);

  return (
    <SessionContext.Provider
      value={{ session, isLoggedIn: !!session, profile }}
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
