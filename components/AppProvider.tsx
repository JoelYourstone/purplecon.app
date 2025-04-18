import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { usePathname, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { setBackgroundColorAsync } from "expo-system-ui";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Notifications from "expo-notifications";

import { theme } from "../theme";

import { OfflineBanner } from "@/components/OfflineBanner";
import { SplashProvider } from "@/components/SplashProvider";
import { PropsWithChildren } from "react";
import { OnboardingProvider } from "@/features/onboarding/OnboardingContext";
import { SessionProvider } from "./SessionProvider";
import { useExpoNotifications } from "./notifications";
import { EventProvider } from "./EventProvider";

export function AppProvider({ children }: PropsWithChildren) {
  const [splashVisible, setSplashVisible] = useState(true);
  const colorScheme = useColorScheme() || "light";

  const router = useRouter();
  const pathName = usePathname();

  // Keep the root view background color in sync with the current theme
  useEffect(() => {
    setBackgroundColorAsync(
      colorScheme === "dark" ? theme.colorPurple : theme.colorWhite,
    );
  }, [colorScheme]);

  const lastNotificationResponse = Notifications.useLastNotificationResponse();
  useEffect(() => {
    if (
      lastNotificationResponse &&
      lastNotificationResponse.actionIdentifier ===
        Notifications.DEFAULT_ACTION_IDENTIFIER
    ) {
      try {
        const url =
          lastNotificationResponse.notification.request.content.data.url;
        if (pathName !== url) {
          router.push(url);
        }
      } catch {}
    }
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastNotificationResponse]);

  useEffect(() => {
    const fetchData = async () => {
      if (
        true
        // !lastRefreshed ||
        // differenceInMinutes(new Date(), new Date(lastRefreshed)) > 5
      ) {
        // await refreshData();
      }
    };

    fetchData();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ActionSheetProvider>
        <SplashProvider
          animationEnded={!splashVisible}
          onAnimationEnd={() => {
            setSplashVisible(false);
          }}
        >
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
            <SessionProvider>
              <OnboardingProvider>
                <EventProvider>
                  <InnerAppProvider>{children}</InnerAppProvider>
                </EventProvider>
              </OnboardingProvider>
            </SessionProvider>
            <OfflineBanner />
          </ThemeProvider>
        </SplashProvider>
      </ActionSheetProvider>
    </GestureHandlerRootView>
  );
}

function InnerAppProvider({ children }: PropsWithChildren) {
  useExpoNotifications();
  return children;
}
