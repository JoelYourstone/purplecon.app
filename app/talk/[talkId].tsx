import { Image } from "expo-image";
import { Link, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect } from "react";
import { Platform, StyleSheet, View, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolation,
  SharedValue,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";

import { NotFound } from "@/components/NotFound";
import { SpeakerImage } from "@/components/SpeakerImage";
import { ThemedText, ThemedView, useThemeColor } from "@/components/Themed";
import { theme } from "@/theme";
import { Session, Game } from "@/types";
import { formatSessionTime } from "@/utils/formatDate";
import { useHeaderHeight } from "@react-navigation/elements";
import { Bookmark } from "@/components/Bookmark";

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

const findTalk = (
  talkId: string | string[] | undefined,
  { dayOne, dayTwo }: { dayOne: Session[]; dayTwo: Session[] },
) => {
  const talkDay1 = dayOne.find((session) => session.id === talkId);
  if (talkDay1) {
    return { talk: talkDay1, isDayOne: true };
  }
  const talkDay2 = dayTwo.find((session) => session.id === talkId);
  if (talkDay2) {
    return { talk: talkDay2, isDayOne: false };
  }

  return { talk: null, isDayOne: false };
};

export default function TalkDetail() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const talkId = params.talkId || undefined;
  // const { dayOne, dayTwo } = useReactConfStore((state) => state.schedule);
  // const shouldUseLocalTz = useReactConfStore((state) => state.shouldUseLocalTz);
  const shouldUseLocalTz = true;
  const dayOne: Session[] = [];
  const dayTwo: Session[] = [];

  // Animated header on scroll
  const translationY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    translationY.value = event.contentOffset.y;
  });
  const headerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            translationY.value,
            [-120, 0, 150],
            [-90, 0, 120],
            Extrapolation.CLAMP,
          ),
        },
        {
          scale: interpolate(
            translationY.value,
            [-120, 0],
            [1.4, 1],
            Extrapolation.CLAMP,
          ),
        },
      ],
      opacity: interpolate(translationY.value, [0, 100], [1, 0.6]),
    };
  });

  const { talk, isDayOne } = findTalk(talkId, { dayOne, dayTwo });

  useEffect(() => {
    if (talk) {
      navigation.setOptions({ headerRight: () => <Bookmark session={talk} /> });
    }
  }, [navigation, talk]);

  const insets = useSafeAreaInsets();
  const iconColor = useThemeColor({
    light: theme.colorWhite,
    dark: theme.colorDarkBlue,
  });

  return (
    <ThemedView
      style={styles.container}
      darkColor={theme.colorDarkBlue}
      lightColor={theme.colorWhite}
    >
      {talk ? (
        <>
          <AnimatedScrollView
            style={styles.container}
            onScroll={scrollHandler}
            scrollEventThrottle={8}
            contentContainerStyle={[
              styles.contentContainer,
              {
                paddingBottom: insets.bottom + theme.space24,
              },
            ]}
          >
            <ThemedView
              animated
              lightColor={
                isDayOne ? theme.colorReactLightBlue : theme.colorLightGreen
              }
              darkColor={
                isDayOne ? "rgba(88,196,220, 0.5)" : "rgba(155,223,177, 0.5)"
              }
              style={[styles.header, headerStyle]}
            >
              <Image
                tintColor={iconColor}
                source={require("../../assets/images/react-logo.png")}
                style={styles.reactLogo}
              />
              <View style={styles.centered}>
                <ThemedText
                  fontWeight="bold"
                  fontSize={32}
                  style={styles.talkTitle}
                >
                  {talk?.title}
                </ThemedText>
              </View>
            </ThemedView>
            <ThemedView
              darkColor={theme.colorDarkBlue}
              lightColor={theme.colorWhite}
              style={styles.content}
            >
              {talk.games.map((game) => (
                <Link
                  push
                  key={game.id}
                  href={{
                    pathname: "/speaker/[speaker]",
                    params: { speaker: game.id },
                  }}
                  asChild
                >
                  <TouchableOpacity activeOpacity={0.8}>
                    <GameDetails game={game} />
                  </TouchableOpacity>
                </Link>
              ))}
              <Section
                title="Date"
                value={
                  isDayOne
                    ? "May 15, 2024 (Conference Day 1)"
                    : "May 15, 2024 (Conference Day 2)"
                }
              />
              <Section
                title="Time"
                value={formatSessionTime(talk, shouldUseLocalTz)}
              />
              <Section title="Venue" value={talk.room} />
              <Section title="Description" value={talk.description} />
            </ThemedView>
          </AnimatedScrollView>

          {Platform.OS === "android" ? (
            <HeaderBackgroundAndroid scrollTranslationY={translationY} />
          ) : (
            <HeaderBackgroundIOS scrollTranslationY={translationY} />
          )}
        </>
      ) : (
        <NotFound message="Talk not found" />
      )}
    </ThemedView>
  );
}

// We use a transparent header background on Android to provide a nice looking
// header that expands to the top of the screen. This component ensures that
// a header background becomes visible as we scroll past the header, so we don't
// just see a floating back button.
function HeaderBackgroundAndroid({
  scrollTranslationY,
}: {
  scrollTranslationY: SharedValue<number>;
}) {
  const headerHeight = useHeaderHeight();
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollTranslationY.value, [50, 150], [0, 1]),
  }));

  return (
    <ThemedView
      animated
      darkColor={theme.colorDarkBlue}
      lightColor={theme.colorWhite}
      style={[
        animatedStyle,
        {
          height: headerHeight,
          position: "absolute",
          elevation: 4,
          top: 0,
          left: 0,
          right: 0,
        },
      ]}
    />
  );
}

function HeaderBackgroundIOS({
  scrollTranslationY,
}: {
  scrollTranslationY: SharedValue<number>;
}) {
  const headerHeight = useHeaderHeight();
  const colorScheme = useColorScheme();
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollTranslationY.value,
      [0, 150],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          position: "absolute",
          elevation: 4,
          top: 0,
          left: 0,
          right: 0,
        },
      ]}
    >
      <BlurView
        intensity={40}
        tint={
          colorScheme === "light"
            ? "systemThinMaterialLight"
            : "systemThinMaterialDark"
        }
        style={{ height: headerHeight, flex: 1 }}
      />
    </Animated.View>
  );
}

function GameDetails({ game }: { game: Game }) {
  return (
    <View style={styles.speaker}>
      <SpeakerImage profilePicture={game.image} />
      <View style={styles.speakerDetails}>
        <ThemedText fontSize={18} fontWeight="bold">
          {game.name}
        </ThemedText>
        <ThemedText fontSize={16} fontWeight="bold">
          {game.mechanics}
        </ThemedText>
      </View>
    </View>
  );
}

function Section({ title, value }: { title: string; value: string | null }) {
  if (!value) {
    return null;
  }

  return (
    <View style={styles.sectionContainer}>
      <ThemedText fontSize={18} fontWeight="bold">
        {title}
      </ThemedText>
      <ThemedText fontSize={18} fontWeight="medium">
        {value}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 250,
    paddingTop: 50,
    paddingHorizontal: theme.space16,
    overflow: "hidden",
  },
  contentContainer: {
    borderBottomRightRadius: theme.borderRadius20,
    borderBottomLeftRadius: theme.borderRadius20,
  },
  speaker: {
    flexDirection: "row",
    marginBottom: theme.space12,
  },
  speakerDetails: {
    flex: 1,
    justifyContent: "center",
  },
  talkTitle: {
    textAlign: "center",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
  },
  reactLogo: {
    position: "absolute",
    right: -100,
    top: "30%",
    height: 300,
    width: 300,
    opacity: 0.2,
  },
  sectionContainer: {
    marginBottom: theme.space24,
  },
  content: {
    paddingTop: theme.space16,
    paddingHorizontal: theme.space16,
  },
});
