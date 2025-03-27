import { useNavigation, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Image } from "expo-image";

import { NotFound } from "@/components/NotFound";
import openWebBrowserAsync from "@/utils/openWebBrowserAsync";
import { IconButton } from "@/components/IconButton";
import { SpeakerImage } from "@/components/SpeakerImage";
import { ThemedText, ThemedView, useThemeColor } from "@/components/Themed";
import { theme } from "@/theme";
import { Game } from "@/types";

export default function SpeakerDetail() {
  const params = useLocalSearchParams();
  const games: Game[] = [];
  const game = games.find((game) => game.id === params.gameId);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: game?.name });
  }, [game, navigation]);

  return (
    <ThemedView
      style={styles.container}
      darkColor={theme.colorDarkBlue}
      lightColor={theme.colorWhite}
    >
      {game ? (
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.centered}>
            <SpeakerImage
              style={styles.speakerImage}
              profilePicture={game.image}
              size="xlarge"
            />
            {game.short_description ? (
              <ThemedText
                fontSize={theme.fontSize18}
                fontWeight="medium"
                style={styles.tagLine}
                italic
              >
                {game.short_description}
              </ThemedText>
            ) : null}
          </View>
          {game.links.length ? <Links game={game} /> : null}
          {game.description ? (
            <ThemedText
              fontSize={theme.fontSize18}
              style={{
                marginBottom: theme.space24,
                lineHeight: theme.fontSize18 * 1.5,
              }}
            >
              {game.description}
            </ThemedText>
          ) : null}
        </ScrollView>
      ) : (
        <NotFound message="Game not found" />
      )}
    </ThemedView>
  );
}

function Links({ game }: { game: Game }) {
  const iconColor = useThemeColor({
    light: theme.colorBlack,
    dark: theme.colorWhite,
  });
  return (
    <View style={styles.links}>
      {game.links.map((link) => {
        const icon = (() => {
          return (
            <Image
              source={require("../../assets/images/BGG.png")}
              style={styles.icon}
              tintColor={iconColor}
            />
          );
        })();

        if (!icon) {
          return null;
        }

        return (
          <IconButton
            onPress={() => openWebBrowserAsync(link.url)}
            key={link.title}
          >
            {icon}
          </IconButton>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.space16,
    paddingTop: theme.space24,
    borderBottomRightRadius: theme.borderRadius20,
    borderBottomLeftRadius: theme.borderRadius20,
  },
  centered: {
    alignItems: "center",
  },
  tagLine: {
    marginBottom: theme.space24,
  },
  speakerImage: {
    marginBottom: theme.space24,
  },
  icon: {
    height: 20,
    width: 20,
  },
  links: {
    marginBottom: theme.space24,
    flexDirection: "row",
    justifyContent: "center",
  },
});
