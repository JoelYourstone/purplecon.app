import * as Application from "expo-application";
import { View, StyleSheet } from "react-native";

import { ThemedText } from "./Themed";

import { theme } from "@/theme";
import { useUpdates } from "expo-updates";

export function BuildDetails() {
  const updates = useUpdates();

  const currentUpdateId = updates?.currentlyRunning?.updateId;

  return (
    <View style={styles.container}>
      <ThemedText fontSize={12}>
        v{Application.nativeApplicationVersion} (
        {Application.nativeBuildVersion})
      </ThemedText>
      <ThemedText fontSize={12}>
        This update was released on{" "}
        {updates?.currentlyRunning?.createdAt?.toLocaleDateString()}
      </ThemedText>
      {currentUpdateId ? (
        <ThemedText fontSize={12} style={{ color: theme.colorGrey }}>
          {currentUpdateId}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: theme.space12,
    paddingBottom: theme.space8,
  },
});
