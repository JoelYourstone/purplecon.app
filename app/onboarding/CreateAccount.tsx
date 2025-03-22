import { View } from "react-native";
import { theme } from "@/theme";
import Login from "@/components/SignupForm";
import { useOnboarding } from "@/features/onboarding/OnboardingContext";
import { ClearReloadButton } from "@/app/(tabs)/info";
export default function CreateAccount() {
  const { RedirectToCurrentState, onboardingState } = useOnboarding();

  if (onboardingState !== "2.createAccount") {
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
      <Login />
      <ClearReloadButton />
    </View>
  );
}
