import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Keyboard,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { NotFound } from "@/components/NotFound";

import { SpeakerCard } from "@/components/SpeakerCard";
import { ThemedText, ThemedView } from "@/components/Themed";
import { theme } from "@/theme";
import { FlatList } from "react-native-gesture-handler";
import { useLocalSearchParams } from "expo-router";
import { Speaker } from "@/types";
import { supabase } from "@/lib/supabase";
import { useEvent } from "@/components/EventProvider";
const { width: screenWidth } = Dimensions.get("window");

export default function Speakers() {
  const flatListRef = React.useRef<FlatList<string>>(null);
  const { currentEventInfo } = useEvent();

  // const speakers = useReactConfStore((state) => state.allSessions.speakers);'
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [currentTab, setCurrentTab] = useState<"attending" | "tentative">(
    "attending",
  );

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

  let filteredSpeakers = speakers;

  filteredSpeakers = speakers.filter((speaker) => {
    if (!searchText) {
      return true;
    }
    return speaker.fullName.toLowerCase().includes(searchText);
  });

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const attendingList = (
    <PersonList
      people={filteredSpeakers.filter(
        (speaker) =>
          currentEventInfo?.rsvps.find((rsvp) => rsvp.userId === speaker.id)
            ?.status === "confirmed",
      )}
      searchText={searchText}
      dismissKeyboard={dismissKeyboard}
    />
  );

  const tentativeList = (
    <PersonList
      people={filteredSpeakers.filter(
        (speaker) =>
          currentEventInfo?.rsvps.find((rsvp) => rsvp.userId === speaker.id)
            ?.status === "tentative",
      )}
      searchText={searchText}
      dismissKeyboard={dismissKeyboard}
    />
  );

  return (
    <ThemedView
      style={styles.container}
      darkColor={theme.colorDarkBlue}
      lightColor={theme.colorWhite}
    >
      <ThemedView
        style={[
          styles.sectionHeader,
          {
            borderBottomColor: theme.colorReactLightBlue,
          },
        ]}
        lightColor={theme.colorWhite}
        darkColor={theme.colorDarkBlue}
      >
        <SectionListButton
          title="Kommer"
          isBold={currentTab === "attending"}
          onPress={() => {
            setCurrentTab("attending");
            flatListRef.current?.scrollToIndex({
              index: 0,
              animated: true,
            });
          }}
        />
        <SectionListButton
          title="Tentativa"
          isBold={currentTab === "tentative"}
          onPress={() => {
            setCurrentTab("tentative");
            flatListRef.current?.scrollToIndex({
              index: 1,
              animated: true,
            });
          }}
        />
      </ThemedView>
      <FlatList
        ref={flatListRef}
        horizontal
        renderItem={({ item }) => {
          if (item === "attending") {
            return attendingList;
          }
          return tentativeList;
        }}
        data={["attending", "tentative"]}
        pagingEnabled={false}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1 }}
      />
    </ThemedView>
  );
}

const SectionListButton = ({
  onPress,
  isBold,
  title,
}: {
  onPress: () => void;
  isBold: boolean;
  title: string;
}) => {
  const opacity = { opacity: isBold ? 1 : 0.5 };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <ThemedText
        fontWeight="bold"
        lightColor={theme.colorBlack}
        darkColor={theme.colorWhite}
        fontSize={24}
        style={opacity}
      >
        {title}
      </ThemedText>
    </TouchableOpacity>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: theme.space16,
  },
  noResultsContainer: {
    paddingHorizontal: theme.space24,
    width: screenWidth,
    flex: 1,
  },
  sectionHeader: {
    marginBottom: theme.space12,
    paddingHorizontal: theme.space16,
    paddingVertical: theme.space12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 3,
  },
});

function PersonList({
  people,
  searchText,
  dismissKeyboard,
}: {
  people: Speaker[];
  searchText: string;
  dismissKeyboard: () => void;
}) {
  return (
    <FlatList
      scrollToOverflowEnabled
      contentInsetAdjustmentBehavior="automatic"
      onScrollBeginDrag={dismissKeyboard}
      keyboardShouldPersistTaps="handled"
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      ItemSeparatorComponent={() => <View style={{ height: theme.space16 }} />}
      renderItem={({ item }) => <SpeakerCard speaker={item} key={item.id} />}
      data={people}
      ListEmptyComponent={
        <ThemedView style={styles.noResultsContainer}>
          <ThemedText>
            Här var det tomt :(
            <ThemedText fontWeight="bold">{searchText}</ThemedText>
          </ThemedText>
        </ThemedView>
      }
    />
  );
}
