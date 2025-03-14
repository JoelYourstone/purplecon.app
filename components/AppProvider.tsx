import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { usePathname, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { useColorScheme, View, Text } from "react-native";
import { setBackgroundColorAsync } from "expo-system-ui";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Notifications from "expo-notifications";

import { theme } from "../theme";

import { OfflineBanner } from "@/components/OfflineBanner";
import { AnimatedBootSplash } from "@/components/AnimatedBootSplash";
import { PropsWithChildren } from "react";
import {
  OnboardingProvider,
  useOnboarding,
} from "@/features/onboarding/OnboardingContext";
import EnterCode from "@/features/onboarding/EnterCode";

export function AppProvider({ children }: PropsWithChildren) {
  const [splashVisible, setSplashVisible] = useState(true);
  const colorScheme = useColorScheme() || "light";

  const router = useRouter();
  const pathName = usePathname();

  // Keep the root view background color in sync with the current theme
  useEffect(() => {
    setBackgroundColorAsync(
      colorScheme === "dark" ? theme.colorDarkestBlue : theme.colorWhite,
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
        <AnimatedBootSplash
          animationEnded={!splashVisible}
          onAnimationEnd={() => {
            setSplashVisible(false);
          }}
        >
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
            <OnboardingProvider>
              <InnerAppProvider>{children}</InnerAppProvider>
            </OnboardingProvider>
            <OfflineBanner />
          </ThemeProvider>
        </AnimatedBootSplash>
      </ActionSheetProvider>
    </GestureHandlerRootView>
  );
}

function InnerAppProvider({ children }: PropsWithChildren) {
  const { invitationCode } = useOnboarding();

  if (!invitationCode) {
    return <EnterCode />;
  }

  return children;
}
