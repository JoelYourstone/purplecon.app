import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const READ_STATUS_KEY = "@announcement_read_status";

export interface ReadStatus {
  [announcementId: string]: boolean;
}

export const useAnnouncementReadStatus = () => {
  const [readStatus, setReadStatus] = useState<ReadStatus>({});
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    loadReadStatus();
  }, []);

  const loadReadStatus = async () => {
    try {
      const storedStatus = await AsyncStorage.getItem(READ_STATUS_KEY);
      if (storedStatus) {
        const parsedStatus = JSON.parse(storedStatus);
        setReadStatus(parsedStatus);
        setHasUnread(Object.values(parsedStatus).some((status) => !status));
      }
    } catch (error) {
      console.error("Error loading read status:", error);
    }
  };

  const markAsRead = useCallback(
    async (announcementId: string) => {
      try {
        const newStatus = { ...readStatus, [announcementId]: true };
        await AsyncStorage.setItem(READ_STATUS_KEY, JSON.stringify(newStatus));
        setReadStatus(newStatus);
        setHasUnread(Object.values(newStatus).some((status) => !status));
      } catch (error) {
        console.error("Error marking announcement as read:", error);
      }
    },
    [readStatus],
  );

  const markAllAsRead = useCallback(
    async (announcementIds: string[]) => {
      try {
        const newStatus = { ...readStatus };
        announcementIds.forEach((id) => {
          newStatus[id] = true;
        });
        await AsyncStorage.setItem(READ_STATUS_KEY, JSON.stringify(newStatus));
        setReadStatus(newStatus);
        setHasUnread(false);
      } catch (error) {
        console.error("Error marking all announcements as read:", error);
      }
    },
    [readStatus],
  );

  return {
    readStatus,
    hasUnread,
    markAsRead,
    markAllAsRead,
  };
};
