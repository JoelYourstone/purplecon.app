import React, { useEffect, useState } from "react";
import { Keyboard, Platform, StyleSheet, View } from "react-native";

import { NotFound } from "@/components/NotFound";

import { SpeakerCard } from "@/components/SpeakerCard";
import { ThemedText, ThemedView } from "@/components/Themed";
import { theme } from "@/theme";
import { FlatList } from "react-native-gesture-handler";
import { useLocalSearchParams } from "expo-router";
import useScrollToTopWithOffset from "@/utils/useScrollToTopWithOffset";
import { Speaker } from "@/types";
import { supabase } from "@/lib/supabase";

export default function Speakers() {
  const ref = React.useRef(null);
  useScrollToTopWithOffset(
    ref,
    Platform.select({
      ios: -90,
      default: 0,
    }),
  );
  // const speakers = useReactConfStore((state) => state.allSessions.speakers);'
  const [speakers, setSpeakers] = useState<Speaker[]>([]);

  useEffect(() => {
    const fetchSpeakers = async () => {
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) {
        console.error("Error fetching speakers:", error.message);
      }

      setSpeakers(
        data?.map((speaker) => {
          let profilePicture = "";
          if (speaker.avatar_url) {
            const storageResult = supabase.storage
              .from("avatars")
              .getPublicUrl(speaker.avatar_url);
            profilePicture = storageResult.data.publicUrl;
          }
          return {
            id: speaker.id,
            firstName: speaker.first_name ?? "",
            lastName: speaker.last_name ?? "",
            tagLine: "",
            profilePicture: profilePicture,
            bio: "",
            links: [],
            sessions: [],
            fullName: `${speaker.first_name} ${speaker.last_name}`,
            categoryItems: [],
          };
        }) ?? [],
      );
    };
    fetchSpeakers();
  }, []);

  const params = useLocalSearchParams<{ q?: string }>();

  if (!speakers.length) {
    return <NotFound message="Speakers unavailable" />;
  }

  const searchText = params?.q?.toLowerCase() || "";

  let filteredSpeakers = speakers.filter((speaker) => {
    if (!searchText) {
      return true;
    }
    return speaker.fullName.toLowerCase().includes(searchText);
  });

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <ThemedView
      style={styles.container}
      darkColor={theme.colorDarkBlue}
      lightColor={theme.colorWhite}
    >
      <FlatList
        scrollToOverflowEnabled
        contentInsetAdjustmentBehavior="automatic"
        onScrollBeginDrag={dismissKeyboard}
        keyboardShouldPersistTaps="handled"
        ref={ref}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        ItemSeparatorComponent={() => (
          <View style={{ height: theme.space16 }} />
        )}
        renderItem={({ item }) => <SpeakerCard speaker={item} key={item.id} />}
        data={filteredSpeakers}
        ListEmptyComponent={
          <ThemedView style={styles.noResultsContainer}>
            <ThemedText>
              No results found for{" "}
              <ThemedText fontWeight="bold">{searchText}</ThemedText>
            </ThemedText>
          </ThemedView>
        }
      />
    </ThemedView>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: theme.space16,
  },
  noResultsContainer: {
    paddingHorizontal: theme.space24,
  },
});
