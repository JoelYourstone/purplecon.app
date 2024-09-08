import { useScrollToTop } from "@react-navigation/native";
import { useFocusEffect } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, View, ViewToken } from "react-native";
import Animated, {
  useAnimatedRef,
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  SharedValue,
  Extrapolation,
  interpolate,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";

import { ActivityCard } from "@/components/ActivityCard";
import { NotFound } from "@/components/NotFound";
import { ReactConfHeader } from "@/components/ReactConfHeader";
import { TalkCard } from "@/components/TalkCard";
import { ThemedText, ThemedView, useThemeColor } from "@/components/Themed";
import { COLLAPSED_HEADER, EXPANDED_HEADER, ROW_HEIGHT } from "@/consts";
import { useReactConfStore } from "@/store/reactConfStore";
import { theme } from "@/theme";
import { Session } from "@/types";

export type SessionItem =
  | {
      type: "session";
      day: number;
      item: Session;
    }
  | {
      type: "section-header";
      day: number;
    };

const AnimatedFlatList = Animated.createAnimatedComponent(
  FlatList<SessionItem>
);

export default function Schedule() {
  const insets = useSafeAreaInsets();
  const scrollRef = useAnimatedRef<FlatList>();
  useScrollToTop(scrollRef as any);
  const [shouldShowDayOneHeader, setShouldShowDayOneHeader] = useState(true);

  const scrollOffset = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollOffset.value = event.contentOffset.y;
  });

  const paddingTopStyle = useAnimatedStyle(() => ({
    paddingTop: interpolate(
      scrollOffset.value,
      [COLLAPSED_HEADER, EXPANDED_HEADER - 55],
      [0, ROW_HEIGHT],
      Extrapolation.CLAMP
    ),
  }));

  const sectionListBackgroundColor = useThemeColor({
    light: theme.colorWhite,
    dark: theme.colorDarkestBlue,
  });

  useFocusEffect(() => {
    refreshSchedule({ ttlMs: 60_000 });
  });

  const { dayOne, dayTwo } = useReactConfStore((state) => state.schedule);
  const refreshSchedule = useReactConfStore((state) => state.refreshData);
  const isRefreshing = useReactConfStore((state) => !!state.isRefreshing);

  const scrollToSection = ({
    isSchedule: isDayOne,
  }: {
    isSchedule: boolean;
  }) => {
    scrollRef.current?.scrollToIndex({
      index: isDayOne ? 0 : dayOne.length,
      animated: true,
    });
  };

  const onViewableItemsChanged = (items: {
    viewableItems: ViewToken<SessionItem>[];
    changed: ViewToken<SessionItem>[];
  }) => {
    const topVisibleIndex = items.viewableItems?.[0]?.index || 0;
    const isDayOneThreshold = topVisibleIndex <= dayOne.length;
    const isDayTwoThreshold = topVisibleIndex >= dayOne.length;

    if (!shouldShowDayOneHeader && isDayOneThreshold) {
      setShouldShowDayOneHeader(true);
    }

    if (shouldShowDayOneHeader && isDayTwoThreshold) {
      setShouldShowDayOneHeader(false);
    }
  };

  const data = [
    ...dayOne.map((item) => ({ type: "session", day: 1, item })),
    { type: "section-header", day: 2 },
    ...dayTwo.map((item) => ({ type: "session", day: 2, item })),
  ] as SessionItem[];

  if (!dayOne.length || !dayTwo.length) {
    return <NotFound message="Schedule unavailable" />;
  }

  return (
    <ThemedView
      style={[styles.container, { paddingTop: insets.top }]}
      darkColor={theme.colorDarkBlue}
      lightColor={theme.colorWhite}
    >
      <ThemedView style={[styles.container, paddingTopStyle]} animated>
        <AnimatedFlatList
          ref={scrollRef}
          onViewableItemsChanged={onViewableItemsChanged}
          onScroll={scrollHandler}
          style={{ backgroundColor: sectionListBackgroundColor }}
          contentContainerStyle={{
            paddingTop: EXPANDED_HEADER - 55,
          }}
          scrollEventThrottle={8}
          data={data}
          stickyHeaderIndices={[0]}
          ListHeaderComponent={() => {
            return (
              <ThemedView
                style={[
                  styles.sectionHeader,
                  {
                    borderBottomColor: shouldShowDayOneHeader
                      ? theme.colorReactLightBlue
                      : theme.colorLightGreen,
                  },
                ]}
                lightColor={theme.colorWhite}
                darkColor={theme.colorDarkBlue}
              >
                <SectionListButton
                  title="Spelschema"
                  isBold={shouldShowDayOneHeader}
                  onPress={() => scrollToSection({ isSchedule: true })}
                />
                <SectionListButton
                  title="Spelbiblioteket"
                  isBold={!shouldShowDayOneHeader}
                  onPress={() => scrollToSection({ isSchedule: false })}
                />
              </ThemedView>
            );
          }}
          renderItem={({ item }) => {
            const isDayOne = item.day === 1;
            if (item.type === "section-header") {
              return (
                <ThemedView
                  style={[
                    styles.sectionHeader,
                    {
                      borderBottomColor: isDayOne
                        ? theme.colorReactLightBlue
                        : theme.colorLightGreen,
                    },
                  ]}
                  lightColor={theme.colorWhite}
                  darkColor={theme.colorDarkBlue}
                >
                  <SectionListButton
                    title="Day 1"
                    isBold={isDayOne}
                    onPress={() => scrollToSection({ isSchedule: true })}
                  />
                  <SectionListButton
                    title="Day 2"
                    isBold={!isDayOne}
                    onPress={() => scrollToSection({ isSchedule: false })}
                  />
                </ThemedView>
              );
            }

            if (item.item.isServiceSession) {
              return <ActivityCard session={item.item} />;
            } else {
              return (
                <TalkCard
                  key={item.item.id}
                  session={item.item}
                  isDayOne={isDayOne}
                />
              );
            }
          }}
        />
        <Header scrollOffset={scrollOffset} refreshing={isRefreshing} />
      </ThemedView>
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

interface HeaderProps {
  scrollOffset: SharedValue<number>;
  refreshing: boolean;
}

function Header({ scrollOffset, refreshing }: HeaderProps) {
  const animatedHeader = useAnimatedStyle(() => ({
    height: interpolate(
      scrollOffset.value,
      [0, EXPANDED_HEADER],
      [EXPANDED_HEADER, 0]
    ),
  }));

  return (
    <Animated.View style={[styles.header, animatedHeader]}>
      <ReactConfHeader scrollOffset={scrollOffset} />
      <View style={{ position: "absolute", right: 20, top: 15 }}>
        <ActivityIndicator
          size="small"
          hidesWhenStopped={true}
          animating={refreshing}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.space8,
    backgroundColor: theme.colorThemeLightGrey,
    overflow: "hidden",
  },
  header: {
    position: "absolute",
    top: 0,
    zIndex: 1,
    width: "100%",
  },
});
