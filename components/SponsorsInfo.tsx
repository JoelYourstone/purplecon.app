import { Image, ImageSource, ImageStyle } from "expo-image";
import { StyleSheet, View, ViewStyle, Text } from "react-native";
import openWebBrowserAsync from "@/utils/openWebBrowserAsync";
import { TouchableOpacity } from "react-native-gesture-handler";

import { InfoSection } from "./InfoSection";
import { ThemedText, ThemedView } from "./Themed";

import { theme } from "@/theme";

const logoHeight = 40;

const sponsors = {
  remixSpotify: {
    image: require("../assets/images/sponsor-remix-spotify.svg"),
    url: "https://remix.run/",
  },
  mui: {
    image: require("../assets/images/sponsor-mui.svg"),
    url: "https://mui.com/",
  },
  sentry: {
    image: require("../assets/images/sponsor-sentry.svg"),
    url: "https://sentry.io/for/react/?utm_source=sponsored-conf&utm_medium=sponsored-event&utm_campaign=frontend-fy25q2-evergreen&utm_content=logo-reactconf2024-learnmore",
  },
  expo: {
    image: require("../assets/images/sponsor-expo.svg"),
    url: "https://expo.dev/",
  },
  redwood: {
    image: require("../assets/images/sponsor-redwood.svg"),
    url: "https://redwoodjs.com/",
  },
  vercel: {
    image: require("../assets/images/sponsor-vercel.svg"),
    url: "https://vercel.com/",
  },
  abbott: {
    image: require("../assets/images/sponsor-abbott.svg"),
    url: "https://www.jobs.abbott/software",
  },
  amazon: {
    image: require("../assets/images/sponsor-amazon.webp"),
    url: "https://developer.amazon.com/apps-and-games?cmp=US_2024_05_3P_React-Conf-2024&ch=prtnr&chlast=prtnr&pub=ref&publast=ref&type=org&typelast=org",
  },
};

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
