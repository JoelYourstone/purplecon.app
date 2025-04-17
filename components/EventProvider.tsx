import { supabase } from "@/lib/supabase";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useSplashContext } from "./SplashProvider";
import { useSession } from "./SessionProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type RsvpStatus = "pending" | "confirmed" | "rejected" | "tentative";

type Rsvp = {
  userId: string;
  status: RsvpStatus;
};

type EventInfo = {
  id: number;
  rsvps: Rsvp[];
  announcementIds: string[];
};

export interface ReadStatus {
  [announcementId: string]: boolean;
}

export const READ_STATUS_KEY = "@announcement_read_status";

type EventContextType = {
  currentEventInfo: EventInfo | null;
  userRsvpStatus?: RsvpStatus;
  confirmRsvp: (status: RsvpStatus) => Promise<void>;
  readStatus: ReadStatus;
  hasUnreadAnnouncements: boolean;
  markAllAnnouncementsAsRead: () => Promise<void>;
};

const EventContext = createContext<EventContextType | null>(null);

export function EventProvider({ children }: PropsWithChildren) {
  const [currentEventInfo, setCurrentEventInfo] = useState<EventInfo | null>(
    null,
  );
  const [userRsvpStatus, setUserRsvpStatus] = useState<RsvpStatus>();
  const [readStatus, setReadStatus] = useState<ReadStatus>({});

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
        .select("id, event_invite(rsvp, user_id), announcements(id)")
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
        announcementIds: data.announcements.map((a) => a.id),
      });

      setHasFinishedEventLoading(true);
    };

    const loadReadStatus = async () => {
      try {
        const storedStatus = await AsyncStorage.getItem(READ_STATUS_KEY);
        if (storedStatus) {
          console.log("storedStatus", storedStatus);
          const parsedStatus = JSON.parse(storedStatus) as ReadStatus;
          setReadStatus(parsedStatus);
        }
      } catch (error) {
        console.error("Error loading read status:", error);
      }
    };

    fetchEventInfo();
    loadReadStatus();
  }, [setHasFinishedEventLoading, isLoggedIn, session?.user.id]);

  const markAllAnnouncementsAsRead = useCallback(async () => {
    console.log("markAllAnnouncementsAsRead");
    if (!currentEventInfo) return;
    try {
      const newStatus = { ...readStatus };
      currentEventInfo.announcementIds.forEach((id) => {
        newStatus[id] = true;
      });
      await AsyncStorage.setItem(READ_STATUS_KEY, JSON.stringify(newStatus));
      setReadStatus(newStatus);
    } catch (error) {
      console.error("Error marking all announcements as read:", error);
    }
  }, [readStatus, currentEventInfo]);

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

  console.log(
    "announcementIds",
    currentEventInfo?.announcementIds,
    "readstatus",
    readStatus,
  );

  const hasUnreadAnnouncements =
    currentEventInfo?.announcementIds.some((id) => !readStatus[id]) ?? false;

  return (
    <EventContext.Provider
      value={{
        currentEventInfo,
        userRsvpStatus,
        confirmRsvp,
        readStatus,
        hasUnreadAnnouncements,
        markAllAnnouncementsAsRead,
      }}
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
