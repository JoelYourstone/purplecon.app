import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import initialAllSessions from "@/data/allSessions.json";
import { ApiAllSessions, Session } from "@/types";
import { formatSessions } from "@/utils/sessions";
import type { SessionItem } from "@/app/(tabs)";

const doFetch = async (url: string) => {
  try {
    const result = await fetch(url);
    return await result.json();
  } catch {
    return null;
  }
};

type ConfState = {
  schedule: {
    dayOne: Session[];
    dayTwo: Session[];
  };
  allSessions: ApiAllSessions;
  isRefreshing?: boolean;
  lastRefreshed: string | null;
  refreshData: (options?: { ttlMs?: number }) => Promise<void>;
  shouldUseLocalTz: boolean;
  toggleLocalTz: () => void;
};

const getInitialSchedule = () => {
  console.log("LOADING INITIAL SCHEDULE");
  const [dayOne, dayTwo] = formatSessions(initialAllSessions);
  console.log(initialAllSessions.sessions[0].title);
  console.log(dayOne[0].title);
  return {
    schedule: {
      dayOne,
      dayTwo,
    },
    allSessions: initialAllSessions as ApiAllSessions,
  };
};

// export const mockData: SessionItem[] = [
//   {}
// ];

export const useReactConfStore = create(
  persist<ConfState>(
    (set, get) => ({
      ...getInitialSchedule(),
      isRefreshing: false,
      lastRefreshed: null,
      shouldUseLocalTz: false,
      refreshData: async (options) => {
        // set({
        //   ...getInitialSchedule(),
        //   isRefreshing: false,
        //   lastRefreshed: new Date().toISOString(),
        // });
        return;
        // Don't refresh, always use hardcoded data
      },
      toggleLocalTz: () => {
        set((state) => ({ shouldUseLocalTz: !state.shouldUseLocalTz }));
      },
    }),
    {
      name: "purplecon-2024-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => {
        const { isRefreshing: _, ...dataToPersist } = state;
        return dataToPersist;
      },
    }
  )
);
