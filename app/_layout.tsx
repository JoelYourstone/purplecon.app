import { Stack } from "expo-router/stack";
import { Platform, useColorScheme } from "react-native";
import * as Notifications from "expo-notifications";

import { theme } from "../theme";

import { BackButton } from "@/components/BackButton";
import { OfflineBanner } from "@/components/OfflineBanner";
import { ThemedText, useThemeColor } from "@/components/Themed";
import { AppProvider } from "@/components/AppProvider";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function Layout() {
  const colorScheme = useColorScheme() || "light";
  const tabBarBackgroundColor = useThemeColor({
    light: theme.colorWhite,
    dark: theme.colorDarkestBlue,
  });

  return (
    <AppProvider>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="talk/[talkId]"
          options={{
            headerLeft: () => (Platform.OS === "ios" ? <BackButton /> : null),
            title: "",
            headerTransparent: true,
            // `headerBlurEffect` prop does not work on New Architecture at the moment
            // headerBlurEffect: "systemUltraThinMaterialLight",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="speaker/[speakerId]"
          options={{
            presentation: "modal",
            headerLeft: () => (Platform.OS === "ios" ? <BackButton /> : null),
            headerStyle: {
              backgroundColor: tabBarBackgroundColor,
            },
            headerTitleAlign: "center",
            headerTitle: (props) => (
              <ThemedText fontSize={24} fontWeight="bold">
                {props.children}
              </ThemedText>
            ),
          }}
        />
        <Stack.Screen
          name="secretModal"
          options={{
            presentation: "modal",
            title: "Secret Modal",
            headerTitleAlign: "center",
            headerTitle: (props) => (
              <ThemedText fontSize={24} fontWeight="bold">
                {props.children}
              </ThemedText>
            ),
            ...(colorScheme === "dark"
              ? {
                  headerStyle: { backgroundColor: theme.colorDarkBlue },
                  headerTitleStyle: { color: "white" },
                }
              : {}),
          }}
        />
      </Stack>
      <OfflineBanner />
    </AppProvider>
  );
}
