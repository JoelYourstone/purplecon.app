import { ThemedText, useThemeColor } from "@/components/Themed";
import { theme } from "@/theme";
import { Stack, useRouter } from "expo-router";

export default function Layout() {
  const router = useRouter();
  const tabBarBackgroundColor = useThemeColor({
    light: theme.colorWhite,
    dark: theme.colorDarkestBlue,
  });
  const tabBarTintColor = useThemeColor({
    light: theme.colorReactDarkBlue,
    dark: theme.colorWhite,
  });

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerStyle: {
            backgroundColor: theme.colorPurple,
          },
          headerTitle: () => (
            <ThemedText fontSize={20} fontWeight="bold">
              Deltagare
            </ThemedText>
          ),

          headerSearchBarOptions: {
            headerIconColor: tabBarTintColor,
            tintColor: tabBarTintColor,
            textColor: tabBarTintColor,
            hintTextColor: tabBarTintColor,
            onChangeText: (event) => {
              router.setParams({
                q: event.nativeEvent.text,
              });
            },
          },
        }}
      />
    </Stack>
  );
}
