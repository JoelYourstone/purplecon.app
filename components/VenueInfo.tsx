import FontAwesome6 from "@expo/vector-icons/build/FontAwesome6";
import { Image } from "expo-image";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Linking from "expo-linking";
import { InfoSection } from "./InfoSection";
import { ThemedText, useThemeColor } from "./Themed";

import { theme } from "@/theme";

const venueName = "Vipeholms Allé 53, 224 66, Lund";

export function VenueInfo() {
  const { width } = useWindowDimensions();

  const hotelImageSize = width / 3;

  const onOpenVenue = () => {
    Linking.openURL(`https://www.google.com/maps?q=${venueName}`);
  };

  const iconColor = useThemeColor({
    light: theme.colorBlack,
    dark: theme.colorWhite,
  });

  return (
    <InfoSection title="Venue">
      <View style={styles.venueContainer}>
        <Image
          source={
            "https://bilder.hemnet.se/images/itemgallery_cut/b4/92/b49277c4b2ee795c8804b24e02879c46.jpg"
          }
          style={{
            width: hotelImageSize,
            height: hotelImageSize,
            borderRadius: hotelImageSize,
          }}
        />
        <View style={styles.hotelName}>
          <ThemedText fontWeight="bold" fontSize={24}>
            Purplecon Arena
          </ThemedText>
        </View>
      </View>
      <TouchableOpacity
        style={styles.venueAddress}
        onPress={onOpenVenue}
        activeOpacity={0.8}
      >
        <FontAwesome6 name="location-dot" size={24} color={iconColor} />
        <ThemedText style={styles.address}>{venueName}</ThemedText>
      </TouchableOpacity>
    </InfoSection>
  );
}

const styles = StyleSheet.create({
  venueContainer: {
    flexDirection: "row",
    marginBottom: theme.space24,
  },
  hotelName: {
    flex: 1,
    paddingLeft: theme.space12,
    justifyContent: "center",
  },
  venueAddress: {
    flexDirection: "row",
    marginHorizontal: theme.space24,
    alignItems: "center",
  },
  address: {
    marginLeft: theme.space24,
    flex: 1,
    textDecorationLine: "underline",
  },
});
