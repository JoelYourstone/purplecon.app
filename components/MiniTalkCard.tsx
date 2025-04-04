import { Image } from "expo-image";
import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { ThemedText, ThemedView, useThemeColor } from "./Themed";

import { theme } from "@/theme";
import { formatSessionTime } from "@/utils/formatDate";
import { Bookmark } from "./Bookmark";
import { Session } from "@/types";

export function MiniTalkCard({ sessionId }: { sessionId: string | number }) {
  const shouldUseLocalTz = true;
  const dayOne: Session[] = [];
  const dayTwo: Session[] = [];

  const iconColor = useThemeColor({
    light: theme.colorWhite,
    dark: theme.colorDarkBlue,
  });

  const { talk, isDayOne } = (() => {
    const dayOneTalk = dayOne.find(
      (session) => session.id === String(sessionId),
    );
    if (dayOneTalk) {
      return { talk: dayOneTalk, isDayOne: true };
    }
    const dayTwoTalk = dayTwo.find(
      (session) => session.id === String(sessionId),
    );
    if (dayTwoTalk) {
      return { talk: dayTwoTalk, isDayOne: false };
    }
    return { talk: null, isDayOne: null };
  })();

  if (!talk) {
    return null;
  }

  return (
    <Link
      push
      href={{
        pathname: "/talk/[speaker]",
        params: { speaker: talk.id },
      }}
      asChild
    >
      <TouchableOpacity activeOpacity={0.8}>
        <ThemedView
          lightColor={
            isDayOne ? theme.colorReactLightBlue : theme.colorLightGreen
          }
          darkColor={
            isDayOne ? "rgba(88,196,220, 0.5)" : "rgba(155,223,177, 0.5)"
          }
          style={styles.container}
        >
          <Image
            tintColor={iconColor}
            source={require("../assets/images/react-logo.png")}
            style={styles.reactLogo}
          />
          <View style={styles.heading}>
            <ThemedText
              fontSize={18}
              fontWeight="medium"
              style={{ marginBottom: theme.space8 }}
            >
              {formatSessionTime(talk, shouldUseLocalTz)}
              {` `}({isDayOne ? "Day 1" : "Day 2"})
            </ThemedText>
            <Bookmark session={talk} />
          </View>
          <ThemedText fontSize={20} fontWeight="bold">
            {talk.title}
          </ThemedText>
        </ThemedView>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.borderRadius10,
    padding: theme.space16,
    marginBottom: theme.space24,
  },
  heading: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  reactLogo: {
    position: "absolute",
    height: 200,
    width: 200,
    opacity: 0.2,
    right: 0,
  },
});
