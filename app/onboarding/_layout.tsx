import { BackButton } from "@/components/BackButton";
import { theme } from "@/theme";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="EnterCode"
        options={{
          title: "Enter Code",
          headerLeft: () => <BackButton />,
          headerStyle: {
            backgroundColor: theme.colorWhite,
          },
        }}
      />

      <Stack.Screen
        name="CreateAccount"
        options={{
          title: "Create Account",
          headerLeft: () => <BackButton />,
          headerStyle: {
            backgroundColor: theme.colorWhite,
          },
        }}
      />
    </Stack>
  );
}
