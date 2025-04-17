import { useScrollToTop } from "@react-navigation/native";
import React from "react";
import { StyleSheet, View, Text } from "react-native";

import { BuildDetails } from "@/components/BuildDetails";
import { OrganizersInfo } from "@/components/OrganizersInfo";
import { SponsorsInfo } from "@/components/SponsorsInfo";
import { ThemedView, useThemeColor } from "@/components/Themed";
import { VenueInfo } from "@/components/VenueInfo";
import { theme } from "@/theme";
import { ScrollView } from "react-native-gesture-handler";
import { Button } from "@/components/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { reloadAppAsync } from "expo";
import { useAnnouncementReadStatus } from "@/lib/announcementReadStatus";

export default function Info() {
  const backgroundColor = useThemeColor({
    light: theme.colorWhite,
    dark: theme.colorDarkBlue,
  });
  const ref = React.useRef(null);
  useScrollToTop(ref);

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <ScrollView style={styles.scrollView} ref={ref}>
        <VenueInfo />
        {/* <LiveStreamInfo /> */}
        {/* <DiscordInfo /> */}
        <SponsorsInfo />
        <OrganizersInfo />
        <BuildDetails />
        {/* <PoweredByExpo /> */}

        {__DEV__ && (
          <View style={styles.devContainer}>
            <Text>DEV stuffs</Text>
            <ClearReloadButton />
            <ClearReadStatusButton />
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

export function ClearReloadButton() {
  if (!__DEV__) return null;
  return (
    <Button
      onPress={async () => {
        await AsyncStorage.clear();
        await reloadAppAsync();
      }}
      title="Reset entire app and reload"
    />
  );
}

export function ClearReadStatusButton() {
  const { markAllAsRead } = useAnnouncementReadStatus();

  if (!__DEV__) return null;

  return (
    <Button
      onPress={async () => {
        await AsyncStorage.removeItem("@announcement_read_status");
        await reloadAppAsync();
      }}
      title="Clear all read statuses"
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  devContainer: {
    color: "white",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
});
