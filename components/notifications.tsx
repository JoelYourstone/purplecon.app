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
    if (
      !channelSetup ||
      !session.isLoggedIn ||
      notificationSentRef.current ||
      __DEV__
    )
      return;
    notificationSentRef.current = true;

    Notifications.getExpoPushTokenAsync({ projectId })
      .then(async (token) => {
        console.log("Expo push token", token);
        setExpoPushToken(token.data);
        const { error } = await supabase
          .from("profiles")
          .update({
            expo_push_token: token.data,
          })
          .eq("id", session.session!.user.id!);
        if (error) {
          Alert.alert(
            "Error updating expo push token for " + session.session!.user.id!,
            error.message,
          );
        } else {
          // Alert.alert("Expo push token updated");
        }
      })
      .catch((error) => {
        console.log("Error getting expo push token");
        console.error(error);
      });
  }, [channelSetup, projectId, session.isLoggedIn, session.session]);

  return expoPushToken;
}
