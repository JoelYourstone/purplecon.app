import { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";

import { PurpleconHeader } from "@/components/PurpleconHeader";
import { GameDescriptionCard } from "@/components/GameDescriptionCard";
import { ThemedText, ThemedView, useThemeColor } from "@/components/Themed";
import { theme } from "@/theme";
import { Session } from "@/types";

// MOCK

const sessionOne: Session[] = [
  {
    id: "1",
    title: "Modern Classics",
    description:
      "This session contains games that we consider to be modern classics. These games are easy to learn, provide strategic challenges to keep the players engaged and have a good presentation.",
    startsAt: "2025-05-10T11:00:00",
    endsAt: "2025-05-10T14:00:00",
    games: [
      {
        id: "g1",
        name: "7 Wonders",
        mechanics: "Deckbuilding",
        short_description: "A game about building wonders.",
        description:
          "7 Wonders is a card drafting game that is played using three decks of cards featuring depictions of ancient civilizations, military conflicts, and commercial activity. The game is highly regarded, being one of the highest rated games on the board game database BoardGameGeek.",
        image:
          "https://cf.geekdo-images.com/35h9Za_JvMMMtx_92kT0Jg__imagepage/img/WKlTys0Dc3F6x9r05Fwyvs82tz4=/fit-in/900x600/filters:no_upscale():strip_icc()/pic7149798.jpg",
        links: [
          {
            title: "Boardgame Geek",
            url: "https://boardgamegeek.com/boardgame/68448/7-wonders",
          },
        ],
      },
      {
        id: "g2",
        name: "Pandemic",
        mechanics: "Co-op",
        short_description: "A game about saving the world.",
        description:
          "Pandemic is a cooperative board game designed by Matt Leacock and first published y",
        image:
          "https://cf.geekdo-images.com/S3ybV1LAp-8SnHIXLLjVqA__imagepage/img/kIBu-2Ljb_ml5n-S8uIbE6ehGFc=/fit-in/900x600/filters:no_upscale():strip_icc()/pic1534148.jpg",
        links: [
          {
            title: "Boardgame Geek",
            url: "https://boardgamegeek.com/boardgame/30549/pandemic",
          },
        ],
      },
    ],
  },
];

const sessionTwo: Session[] = [
  {
    id: "2",
    title: "Advanced TypeScript Patterns",
    description: "Deep dive into advanced usage of TypeScript.",
    startsAt: "2025-03-14T11:00:00",
    endsAt: "2025-03-14T12:00:00",
    games: [
      {
        id: "g1",
        name: "7 Wonders",
        mechanics: "Deckbuilding",
        short_description: "A game about building wonders.",
        description:
          "7 Wonders is a card drafting game that is played using three decks of cards featuring depictions of ancient civilizations, military conflicts, and commercial activity. The game is highly regarded, being one of the highest rated games on the board game database BoardGameGeek.",
        image: null,
        links: [
          {
            title: "Boardgame Geek",
            url: "https://boardgamegeek.com/boardgame/68448/7-wonders",
          },
        ],
      },
      {
        id: "g2",
        name: "Pandemic",
        mechanics: "Co-op",
        short_description: "A game about saving the world.",
        description:
          "Pandemic is a cooperative board game designed by Matt Leacock and first published y",
        image: null,
        links: [
          {
            title: "Boardgame Geek",
            url: "https://boardgamegeek.com/boardgame/30549/pandemic",
          },
        ],
      },
    ],
  },
];

// These should not be Sessions - just a list of games.
const sessionOneSpelbibliotek: Session[] = [
  {
    id: "1",
    title: "Another page with Modern Classics",
    description:
      "This session contains games that we consider to be modern classics. These games are easy to learn, provide strategic challenges to keep the players engaged and have a good presentation.",
    startsAt: "2025-05-10T11:00:00",
    endsAt: "2025-05-10T14:00:00",
    games: [
      {
        id: "g1",
        name: "7 Wonders",
        mechanics: "Deckbuilding",
        short_description: "A game about building wonders.",
        description:
          "7 Wonders is a card drafting game that is played using three decks of cards featuring depictions of ancient civilizations, military conflicts, and commercial activity. The game is highly regarded, being one of the highest rated games on the board game database BoardGameGeek.",
        image:
          "https://cf.geekdo-images.com/35h9Za_JvMMMtx_92kT0Jg__imagepage/img/WKlTys0Dc3F6x9r05Fwyvs82tz4=/fit-in/900x600/filters:no_upscale():strip_icc()/pic7149798.jpg",
        links: [
          {
            title: "Boardgame Geek",
            url: "https://boardgamegeek.com/boardgame/68448/7-wonders",
          },
        ],
      },
      {
        id: "g2",
        name: "Pandemic",
        mechanics: "Co-op",
        short_description: "A game about saving the world.",
        description:
          "Pandemic is a cooperative board game designed by Matt Leacock and first published y",
        image:
          "https://cf.geekdo-images.com/S3ybV1LAp-8SnHIXLLjVqA__imagepage/img/kIBu-2Ljb_ml5n-S8uIbE6ehGFc=/fit-in/900x600/filters:no_upscale():strip_icc()/pic1534148.jpg",
        links: [
          {
            title: "Boardgame Geek",
            url: "https://boardgamegeek.com/boardgame/30549/pandemic",
          },
        ],
      },
    ],
  },
];

const sessionTwoSpelbibliotek: Session[] = [
  {
    id: "2",
    title: "Advanced TypeScript Patterns",
    description: "Deep dive into advanced usage of TypeScript.",
    startsAt: "2025-03-14T11:00:00",
    endsAt: "2025-03-14T12:00:00",
    games: [
      {
        id: "g1",
        name: "7 Wonders",
        mechanics: "Deckbuilding",
        short_description: "A game about building wonders.",
        description:
          "7 Wonders is a card drafting game that is played using three decks of cards featuring depictions of ancient civilizations, military conflicts, and commercial activity. The game is highly regarded, being one of the highest rated games on the board game database BoardGameGeek.",
        image: null,
        links: [
          {
            title: "Boardgame Geek",
            url: "https://boardgamegeek.com/boardgame/68448/7-wonders",
          },
        ],
      },
      {
        id: "g2",
        name: "Pandemic",
        mechanics: "Co-op",
        short_description: "A game about saving the world.",
        description:
          "Pandemic is a cooperative board game designed by Matt Leacock and first published y",
        image: null,
        links: [
          {
            title: "Boardgame Geek",
            url: "https://boardgamegeek.com/boardgame/30549/pandemic",
          },
        ],
      },
    ],
  },
];

export type SessionItem = {
  day: number;
  item: Session;
};

export default function Schedule() {
  const insets = useSafeAreaInsets();
  const [shouldShowSpelschema, setShouldShowSpelschema] = useState(true);

  const flatListRef = useRef<FlatList<SessionItem>>(null);

  function Header() {
    return (
      <View style={{ paddingTop: insets.top }}>
        <PurpleconHeader />
      </View>
    );
  }

  const sectionListBackgroundColor = useThemeColor({
    light: theme.colorWhite,
    dark: theme.colorDarkestBlue,
  });

  const data = shouldShowSpelschema
    ? ([
        ...sessionOne.map((item) => ({ day: 1, item })),
        ...sessionTwo.map((item) => ({ day: 2, item })),
      ] as SessionItem[])
    : ([
        ...sessionOneSpelbibliotek.map((item) => ({ day: 1, item })),
        ...sessionTwoSpelbibliotek.map((item) => ({ day: 2, item })),
      ] as SessionItem[]);

  return (
    <ThemedView
      style={[styles.container, { paddingTop: insets.top }]}
      darkColor={theme.colorDarkBlue}
      lightColor={theme.colorWhite}
    >
      <ThemedView style={[styles.container]}>
        <Header />

        <FlatList<SessionItem>
          ref={flatListRef}
          style={{ backgroundColor: sectionListBackgroundColor }}
          scrollEventThrottle={8}
          data={data}
          stickyHeaderIndices={[0]}
          ListHeaderComponent={() => {
            return (
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
                  title="Spelschema"
                  isBold={shouldShowSpelschema}
                  onPress={() => {
                    setShouldShowSpelschema(true);
                    flatListRef.current?.scrollToOffset({
                      offset: 0,
                      animated: true,
                    });
                  }}
                />
                <SectionListButton
                  title="Spelbiblioteket"
                  isBold={!shouldShowSpelschema}
                  onPress={() => {
                    setShouldShowSpelschema(false);
                    flatListRef.current?.scrollToOffset({
                      offset: 0,
                      animated: true,
                    });
                  }}
                />
              </ThemedView>
            );
          }}
          renderItem={({ item }) => {
            const isOddSession = item.day % 2 !== 0;

            return (
              <GameDescriptionCard
                key={item.item.id}
                session={item.item}
                isOddSession={isOddSession}
              />
            );
          }}
        />
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
});
