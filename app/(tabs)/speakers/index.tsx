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
            console.log(1, 2, storageResult);
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

  // filteredSpeakers = [
  //   {
  //     fullName: "Daniel Vinnlund",
  //     id: "1",
  //     bio: "Daniel Vinnlund is a software engineer at Facebook. He works on the React Native team, focusing on the developer experience and the integration of React Native with the wider JavaScript ecosystem.",
  //     profilePicture:
  //       "https://scontent.fmmx4-1.fna.fbcdn.net/v/t1.6435-9/143360765_10218661704915776_1567392295647185196_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=xmSY9kzWPEoQ7kNvgGRadUX&_nc_ht=scontent.fmmx4-1.fna&_nc_gid=AwLdj8CJkmHaiOzIvVQiP_i&oh=00_AYAHov9sskCfh82JSS-fAsiamxw4wZD_Ez-X8hNX6hnwtA&oe=6704E655",
  //     tagLine: "Värd",
  //     firstName: "Daniel",
  //     lastName: "Vinnlund",
  //     links: [],
  //     sessions: [],
  //     categoryItems: [],
  //   },
  //   {
  //     fullName: "Maria Vinnlund",
  //     id: "2",
  //     profilePicture:
  //       "https://scontent.fmmx4-1.fna.fbcdn.net/v/t1.6435-9/144862580_10160715515962293_1810334916615152494_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=2xiQ_HzVhHYQ7kNvgE3D0yq&_nc_ht=scontent.fmmx4-1.fna&oh=00_AYArUzRQ_sWyxlge2g2KJmKKcifgUdGgJGqjDJx_jAQsuQ&oe=6704E470",
  //     tagLine: "Värd",
  //     firstName: "Maria",
  //     lastName: "Vinnlund",
  //     links: [],
  //     sessions: [],
  //     categoryItems: [],
  //     bio: "Maria Vinnlund is a software engineer at Facebook. She works on the React Native team, focusing on the developer experience and the integration of React Native with the wider JavaScript ecosystem.",
  //   },
  // ];

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
