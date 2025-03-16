import { Image, ImageSource, ImageStyle } from "expo-image";
import { StyleSheet, ViewStyle, Text } from "react-native";
import openWebBrowserAsync from "@/utils/openWebBrowserAsync";
import { TouchableOpacity } from "react-native-gesture-handler";

import { InfoSection } from "./InfoSection";
import { ThemedText, ThemedView } from "./Themed";

import { theme } from "@/theme";

const logoHeight = 40;

export function SponsorsInfo() {
  return (
    <InfoSection title="Sponsorer">
      <ThemedText fontSize={24} style={styles.firstHeading}>
        Diamond
      </ThemedText>
      <SponsorImage
        sponsor={{
          url: "https://yourstone.bar",
          image: require("../assets/images/yourstonebar.jpeg"),
        }}
        imageStyle={styles.mainImage}
      />
      <Text>Rebecca Yourstone &lt;INSERT LOGO HERE &gt;</Text>
    </InfoSection>
  );
}

const SponsorImage = ({
  sponsor,
  style,
  imageStyle,
}: {
  sponsor: {
    url: string;
    image: ImageSource;
  };
  style?: ViewStyle;
  imageStyle?: ImageStyle;
}) => {
  return (
    <ThemedView
      lightColor={theme.colorThemeLightGrey}
      darkColor="rgba(255,255,255, 0.9)"
      style={[style, styles.imageContainer]}
    >
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => openWebBrowserAsync(sponsor.url)}
        style={styles.imageContent}
      >
        <Image
          source={sponsor.image}
          style={[styles.image, imageStyle]}
          contentFit="contain"
        />
      </TouchableOpacity>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  twoSponsorContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  heading: {
    marginTop: theme.space24,
    marginBottom: theme.space12,
    textAlign: "center",
  },
  firstHeading: {
    marginBottom: theme.space16,
    textAlign: "center",
  },
  imageContainer: {
    borderRadius: theme.borderRadius10,
  },
  imageContent: {
    padding: theme.space16,
  },
  smallImageContainer: {
    flex: 1,
    marginRight: theme.space12,
  },
  mainImage: {
    height: logoHeight * 2,
    width: "100%",
  },
  image: {
    height: logoHeight,
    width: "100%",
  },
  halfWidth: {
    width: "50%",
  },
});
