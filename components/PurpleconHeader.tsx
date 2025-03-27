import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";

import { ThemedText, ThemedView, useThemeColor } from "./Themed";
import { theme } from "../theme";

const AnimatedImage = Animated.createAnimatedComponent(Image);

export function PurpleconHeader() {
  return (
    <ThemedView
      style={styles.header}
      darkColor={theme.colorDarkBlue}
      lightColor={theme.colorWhite}
      animated
    >
      <AnimatedImage
        priority="high"
        source={require("../assets/images/meeple.svg")}
        style={styles.reactImage}
      />
      <View>
        <ThemedText
          fontSize={36}
          fontWeight="bold"
          style={styles.logoText}
          darkColor={theme.colorWhite}
          lightColor={theme.colorBlack}
          animated
        >
          PURPLECON
        </ThemedText>
        <ThemedText
          // numberOfLines={1}
          fontSize={24}
          style={styles.logoText}
          animated
        >
          2025
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  reactImage: {
    width: 75,
    height: 75,
  },
  logoText: {
    paddingStart: theme.space8,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
});
