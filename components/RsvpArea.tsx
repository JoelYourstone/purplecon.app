import { theme } from "@/theme";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useThemeColor, ThemedText } from "./Themed";
import { RsvpStatus, useEvent } from "./EventProvider";
import { supabase } from "@/lib/supabase";
import { useSession } from "./SessionProvider";

const TAB_BAR_HEIGHT = 49;

export function RsvpArea() {
  const { userRsvpStatus, currentEventInfo, confirmRsvp } = useEvent();
  const { session } = useSession();
  const backgroundColor = useThemeColor({
    light: theme.colorWhite,
    dark: theme.colorDarkestBlue,
  });

  if (userRsvpStatus !== "pending" || !currentEventInfo || !session?.user.id) {
    return null;
  }

  return (
    <View style={[styles.rsvpContainer, { backgroundColor }]}>
      <ThemedText style={styles.title}>Lämna din RSVP!</ThemedText>
      <View style={styles.detailsContainer}>
        <ThemedText style={styles.detailText}>12 Juni</ThemedText>
        <View style={styles.dot} />
        <ThemedText style={styles.detailText}>10:00-22:00</ThemedText>
        <View style={styles.dot} />
        <ThemedText style={styles.detailText}>Lund</ThemedText>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.confirmButton]}
          onPress={() => confirmRsvp("confirmed")}
        >
          <Ionicons name="checkmark" size={24} color="white" />
          <ThemedText style={styles.buttonText}>Kommer!</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.maybeButton]}
          onPress={() => confirmRsvp("tentative")}
        >
          <Ionicons name="help" size={24} color="white" />
          <ThemedText style={styles.buttonText}>Kanske</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.rejectButton]}
          onPress={() => confirmRsvp("rejected")}
        >
          <Ionicons name="close" size={24} color="white" />
          <ThemedText style={styles.buttonText}>Kommer ej</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rsvpContainer: {
    position: "absolute",
    bottom: TAB_BAR_HEIGHT,
    width: "100%",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  detailText: {
    fontSize: 14,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "white",
    marginHorizontal: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  confirmButton: {
    backgroundColor: theme.colorDarkGreen,
  },
  maybeButton: {
    backgroundColor: theme.colorReactDarkBlue,
  },
  rejectButton: {
    backgroundColor: theme.colorRed,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
});
