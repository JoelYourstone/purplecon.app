import { supabase } from "@/lib/supabase";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSplashContext } from "./SplashProvider";
import { useSession } from "./SessionProvider";

export type RsvpStatus = "pending" | "confirmed" | "rejected" | "tentative";

type Rsvp = {
  userId: string;
  status: RsvpStatus;
};

type EventInfo = {
  id: number;
  rsvps: Rsvp[];
};

type EventContextType = {
  currentEventInfo: EventInfo | null;
  userRsvpStatus?: RsvpStatus;
  confirmRsvp: (status: RsvpStatus) => Promise<void>;
};

const EventContext = createContext<EventContextType | null>(null);

export function EventProvider({ children }: PropsWithChildren) {
  const [currentEventInfo, setCurrentEventInfo] = useState<EventInfo | null>(
    null,
  );
  const [userRsvpStatus, setUserRsvpStatus] = useState<RsvpStatus>();

  const { setHasFinishedEventLoading } = useSplashContext();
  const { isLoggedIn, session } = useSession();

  useEffect(() => {
    if (!isLoggedIn) {
      setHasFinishedEventLoading(true);
      return;
    }

    const fetchEventInfo = async () => {
      const eventsWithInvitesQuery = supabase
        .from("events")
        .select("id, event_invite(rsvp, user_id)")
        // TODO multiple events
        .single();
      const { data, error } = await eventsWithInvitesQuery;

      if (error) throw error;

      setUserRsvpStatus(
        rsvpToStatus(
          data.event_invite.find(
            (invite) => invite.user_id === session?.user.id,
          )?.rsvp,
        ),
      );

      setCurrentEventInfo({
        id: data.id,
        rsvps: data.event_invite.map((invite) => ({
          userId: invite.user_id,
          status: rsvpToStatus(invite.rsvp),
        })),
      });

      setHasFinishedEventLoading(true);
    };
    fetchEventInfo();
  }, [setHasFinishedEventLoading, isLoggedIn, session?.user.id]);

  async function confirmRsvp(status: RsvpStatus) {
    if (!currentEventInfo || !session?.user.id) {
      return;
    }

    await supabase.from("event_invite").upsert({
      event_id: currentEventInfo.id,
      user_id: session.user.id,
      rsvp: status,
    });
    setUserRsvpStatus(status);
  }

  return (
    <EventContext.Provider
      value={{ currentEventInfo, userRsvpStatus, confirmRsvp }}
    >
      {children}
    </EventContext.Provider>
  );
}

export function useEvent() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEvent must be used within an EventProvider");
  }
  return context;
}

function rsvpToStatus(rsvp: string | null | undefined) {
  if (!rsvp) return "pending";
  if (rsvp === "pending") return "pending";
  if (rsvp === "confirmed") return "confirmed";
  if (rsvp === "rejected") return "rejected";
  if (rsvp === "tentative") return "tentative";
  throw new Error(`Invalid RSVP status: ${rsvp}`);
}
