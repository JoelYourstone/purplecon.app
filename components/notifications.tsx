import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";
import { Alert, Platform } from "react-native";
import { useSession } from "./SessionProvider";
import { supabase } from "@/lib/supabase";

export function useExpoNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [channelSetup, setChannelSetup] = useState(Platform.OS === "ios");
  const notificationSentRef = useRef(false);
  const session = useSession();

  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;

  useEffect(() => {
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("purplecon-notifications", {
        name: "Purplecon notifications",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      })
        .then(() => {
          setChannelSetup(true);
        })
        .catch((error) => {
          console.log("Error setting notification channel");
          console.error(error);
        });
    }
  }, []);

  useEffect(() => {
    if (!channelSetup || !session.isLoggedIn || notificationSentRef.current)
      return;

    Notifications.getExpoPushTokenAsync({ projectId })
      .then((token) => {
        console.log("Expo push token", token);
        setExpoPushToken(token.data);
        notificationSentRef.current = true;
        supabase
          .from("profiles")
          .update({
            expo_push_token: token.data,
          })
          .eq("id", session.session!.user.id!);
      })
      .catch((error) => {
        console.log("Error getting expo push token");
        console.error(error);
      });
  }, [channelSetup, projectId, session.isLoggedIn, session.session]);

  return expoPushToken;
}
