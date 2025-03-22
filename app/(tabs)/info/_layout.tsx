import Ionicons from "@expo/vector-icons/build/Ionicons";
import { useEffect } from "react";
import { ThemedText, useThemeColor } from "@/components/Themed";
import { theme } from "@/theme";
import { Stack, useRouter, useNavigation } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function Layout() {
  const router = useRouter();
  const navigation = useNavigation();
  const tabBarBackgroundColor = useThemeColor({
    light: theme.colorWhite,
    dark: theme.colorDarkestBlue,
  });
  const tabBarTintColor = useThemeColor({
    light: theme.colorReactDarkBlue,
    dark: theme.colorWhite,
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      router.dismissTo("/info");
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerStyle: {
            backgroundColor: tabBarBackgroundColor,
          },
          headerTitle: () => (
            <ThemedText fontSize={20} fontWeight="bold">
              Info
            </ThemedText>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push("/info/profile")}
              style={{ marginRight: 10 }}
            >
              <Ionicons
                name="person-circle-outline"
                size={24}
                color={tabBarTintColor}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
