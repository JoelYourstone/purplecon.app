import Account from "@/components/account";
import { theme } from "@/theme";
import { View } from "react-native";
import { useSession } from "@/components/SessionProvider";
import { Redirect } from "expo-router";
import { useOnboarding } from "@/features/onboarding/OnboardingContext";
import { ClearReloadButton } from "../(tabs)/info";

export default function Profile() {
  const { session } = useSession();

  const { onboardingState, RedirectToCurrentState } = useOnboarding();

  if (!session) {
    return <Redirect href="/" />;
  }

  if (onboardingState !== "3.profile") {
    return RedirectToCurrentState;
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        backgroundColor: theme.colorWhite,
      }}
    >
      <Account />
      <ClearReloadButton />
    </View>
  );
}
