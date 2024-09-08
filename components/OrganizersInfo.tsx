import { Image, ImageSource } from "expo-image";
import { StyleSheet, View } from "react-native";
import openWebBrowserAsync from "@/utils/openWebBrowserAsync";
import { TouchableOpacity } from "react-native-gesture-handler";

import { InfoSection } from "./InfoSection";
import { ThemedText, ThemedView } from "./Themed";

import { theme } from "@/theme";

const organizers = {
  meta: {
    image: require("../assets/images/meeple.svg"),
    description:
      "Giving people the power to build community and bring the world closer together.",
    url: "https://www.meta.com/",
  },
};

export function OrganizersInfo() {
  return (
    <InfoSection title="Arrangörer">
      <View style={styles.content}>
        <Organizer organizer={organizers.meta} />
      </View>
    </InfoSection>
  );
}

const Organizer = ({
  organizer,
}: {
  organizer: { image: ImageSource; description: string; url: string };
}) => {
  return (
    <>
      <ThemedView
        lightColor={theme.colorThemeLightGrey}
        darkColor="rgba(255,255,255, 0.9)"
        style={styles.imageContainer}
      >
        <TouchableOpacity
          onPress={() => openWebBrowserAsync(organizer.url)}
          activeOpacity={0.6}
        >
          <Image
            source={organizer.image}
            style={styles.image}
            contentFit="contain"
          />
        </TouchableOpacity>
      </ThemedView>
      <ThemedText style={styles.organizerText} fontSize={18}>
        {organizer.description}
      </ThemedText>
    </>
  );
};

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
  },
  image: {
    height: 40,
    width: "100%",
  },
  imageContainer: {
    padding: theme.space16,
    borderRadius: theme.borderRadius10,
    width: "50%",
    marginBottom: theme.space16,
    marginTop: theme.space16,
  },
  organizerText: {
    marginBottom: theme.space24,
    textAlign: "center",
  },
});
