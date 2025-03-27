import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";

import { Bookmark } from "./Bookmark";
import { SpeakerImage } from "./SpeakerImage";
import { ThemedText, ThemedView, useThemeColor } from "./Themed";
import { theme } from "../theme";
import { Session, Game } from "../types";
import { formatSessionTime } from "../utils/formatDate";

import { TouchableOpacity } from "react-native-gesture-handler";

type Props = {
  session: Session;
  isOddSession: boolean;
};

export function GameDescriptionCard({ session, isOddSession }: Props) {
  const shouldUseLocalTz = true;

  const shadow = useThemeColor({ light: theme.dropShadow, dark: undefined });

  return (
    <Link
      push
      href={{
        pathname: "/game/[game]",
        params: { game: session.id },
      }}
      asChild
    >
      <TouchableOpacity activeOpacity={0.8}>
        <ThemedView
          lightColor={theme.colorWhite}
          darkColor={theme.colorBlack}
          style={[styles.container, shadow]}
        >
          <ThemedView
            lightColor={
              isOddSession ? theme.colorReactLightBlue : theme.colorLightGreen
            }
            darkColor={
              isOddSession ? "rgba(88,196,220, 0.5)" : "rgba(155,223,177, 0.5)"
            }
            style={styles.heading}
          >
            <View style={styles.timeAndBookmark}>
              <ThemedText fontSize={18} fontWeight="medium">
                {formatSessionTime(session, shouldUseLocalTz)}
              </ThemedText>
              <Bookmark session={session} />
            </View>
            <ThemedText
              fontSize={20}
              fontWeight="bold"
              marginBottom={theme.space12}
            >
              {session.title}
            </ThemedText>
          </ThemedView>
          <ThemedView
            style={styles.content}
            lightColor={
              isOddSession
                ? "rgba(88,196,220, 0.15)"
                : "rgba(155,223,177, 0.15)"
            }
            darkColor={
              isOddSession
                ? "rgba(88,196,220, 0.15)"
                : "rgba(155,223,177, 0.15)"
            }
          >
            {session.games.map((game) => (
              <GameDetails game={game} key={game.id} />
            ))}
          </ThemedView>
        </ThemedView>
      </TouchableOpacity>
    </Link>
  );
}

function GameDetails({ game }: { game: Game }) {
  return (
    <View style={styles.speaker}>
      <SpeakerImage profilePicture={game.image} size="large" />
      <View style={styles.speakerDetails}>
        <ThemedText fontSize={18} fontWeight="bold">
          {game.name}
        </ThemedText>
        <ThemedText fontSize={16} fontWeight="light">
          {game.mechanics}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: theme.space16,
    marginBottom: theme.space16,
    borderRadius: theme.borderRadius10,
  },
  heading: {
    borderTopRightRadius: theme.borderRadius10,
    borderTopLeftRadius: theme.borderRadius10,
    paddingHorizontal: theme.space12,
    paddingTop: theme.space12,
  },
  speaker: {
    flexDirection: "row",
    marginBottom: theme.space12,
  },
  speakerDetails: {
    flex: 1,
    justifyContent: "center",
  },
  content: {
    paddingTop: theme.space12,
    paddingHorizontal: theme.space12,
    borderBottomRightRadius: theme.borderRadius10,
    borderBottomLeftRadius: theme.borderRadius10,
  },
  timeAndBookmark: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
