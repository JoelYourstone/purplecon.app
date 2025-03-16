import Feather from "@expo/vector-icons/build/Feather";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import Octicons from "@expo/vector-icons/build/Octicons";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Redirect, Tabs } from "expo-router";
import React from "react";

import { TabBarButton } from "@/components/TabBarButton";
import { ThemedText, useThemeColor } from "@/components/Themed";
import { theme } from "@/theme";
import { useOnboarding } from "@/features/onboarding/OnboardingContext";

export default function TabLayout() {
  const tabBarBackgroundColor = useThemeColor({
    light: theme.colorWhite,
    dark: theme.colorDarkestBlue,
  });

  const tabBarActiveTintColor = useThemeColor({
    light: theme.colorReactDarkBlue,
    dark: theme.colorWhite,
  });

  const tabBarInactiveTintColor = useThemeColor({
    light: theme.colorGrey,
    dark: `rgba(255, 255, 255, 0.35)`,
  });

  const { onboardingState } = useOnboarding();

  if (onboardingState !== "5.completed") {
    return <Redirect href="/onboarding" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor,
        tabBarInactiveTintColor,
        tabBarStyle: {
          backgroundColor: tabBarBackgroundColor,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarButton: (props) => (
            <TabBarButton
              {...props}
              activeTintColor={tabBarActiveTintColor}
              inactiveTintColor={tabBarInactiveTintColor}
              icon={({ color }) => (
                <Ionicons size={24} name="dice-outline" color={color} />
              )}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cafe" //todo change
        options={{
          headerStyle: {
            backgroundColor: tabBarBackgroundColor,
          },
          headerTitle: () => (
            <ThemedText fontSize={20} fontWeight="bold">
              Spelcafé
            </ThemedText>
          ),
          tabBarButton: (props) => (
            <TabBarButton
              {...props}
              activeTintColor={tabBarActiveTintColor}
              inactiveTintColor={tabBarInactiveTintColor}
              icon={({ color }) => <Feather name={"coffee"} size={24} color={color} />}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="social"
        options={{
          headerStyle: {
            backgroundColor: tabBarBackgroundColor,
          },
          headerShown: false,
          headerTitle: () => (
            <ThemedText fontSize={20} fontWeight="bold">
              Social
            </ThemedText>
          ),
          tabBarButton: (props) => (
            <TabBarButton
              {...props}
              activeTintColor={tabBarActiveTintColor}
              inactiveTintColor={tabBarInactiveTintColor}
              icon={({ color }) => (
                <FontAwesome5 name="users" size={24} color={color} />
              )}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="announcements"
        options={{
          headerStyle: {
            backgroundColor: tabBarBackgroundColor,
          },
          headerShown: false,
          tabBarButton: (props) => (
            <TabBarButton
              {...props}
              activeTintColor={tabBarActiveTintColor}
              inactiveTintColor={tabBarInactiveTintColor}
              icon={({ color }) => (
                <MaterialCommunityIcons name="newspaper-variant-outline" size={24} color={color} />
              )}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="info"
        options={{
          headerStyle: {
            backgroundColor: tabBarBackgroundColor,
          },
          headerTitle: () => (
            <ThemedText fontSize={20} fontWeight="bold">
              Info
            </ThemedText>
          ),
          tabBarButton: (props) => (
            <TabBarButton
              {...props}
              activeTintColor={tabBarActiveTintColor}
              inactiveTintColor={tabBarInactiveTintColor}
              icon={({ color }) => (
                <Octicons size={24} name="info" color={color} />
              )}
            />
          ),
        }}
      />
    </Tabs>
  );
}
