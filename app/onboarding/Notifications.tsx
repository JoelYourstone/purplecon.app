import { useOnboarding } from "@/features/onboarding/OnboardingContext";
import { theme } from "@/theme";
import { View, Text, Button } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

export default function NotificationSetup() {
  const {
    onboardingState,
    RedirectToCurrentState,
    isNotificationsGranted,
    setIsNotificationsGranted,
  } = useOnboarding();

  if (onboardingState !== "4.notifications") {
    return RedirectToCurrentState;
  }

  async function registerForPushNotificationsAsync() {
    let token;

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }

      setIsNotificationsGranted(true);

      // Learn more about projectId:
      // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
      // EAS projectId is used here.
      // try {
      //   const projectId =
      //     Constants?.expoConfig?.extra?.eas?.projectId ??
      //     Constants?.easConfig?.projectId;
      //   if (!projectId) {
      //     throw new Error("Project ID not found");
      //   }
      //   token = (
      //     await Notifications.getExpoPushTokenAsync({
      //       projectId,
      //     })
      //   ).data;
      //   console.log(token);
      // } catch (e) {
      //   token = `${e}`;
      // }
    } else {
      alert("Must use physical device for Push Notifications");
    }

    return token;
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        backgroundColor: theme.colorWhite,
      }}
    >
      <Text>
        Notifications {isNotificationsGranted ? "granted" : "not granted"}
      </Text>
      <Button
        title="Enable notifications"
        onPress={registerForPushNotificationsAsync}
      />
    </View>
  );
}
