import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { Platform } from "react-native";

export function useExpoNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [channelSetup, setChannelSetup] = useState(Platform.OS === "ios");

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
    if (!channelSetup) return;
    Notifications.getExpoPushTokenAsync()
      .then((token) => {
        console.log("Expo push token", token);
        setExpoPushToken(token.data);
      })
      .catch((error) => {
        console.log("Error getting expo push token");
        console.error(error);
      });
  }, [channelSetup]);

  return expoPushToken;
}
