import { TalkCard } from "@/components/TalkCard";
import { ThemedText, ThemedView } from "@/components/Themed";
import { theme } from "@/theme";
import { useScrollToTop } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  SectionList,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

// import { theme } from "@/theme";
import { FlatList } from "react-native-gesture-handler";

export default function Cafe() {
  const scrollRef = React.useRef<FlatList>(null);
  useScrollToTop(scrollRef);

  const [cartTotal, setCartTotal] = useState(0);

  const menuSections = [
    {
      title: "Dryck",
      data: [
        { id: 1, name: "Läsk", price: 10 },
        { id: 2, name: "Cider", price: 15 },
        { id: 3, name: "Hot Chocolate", price: 4.0 },
        { id: 4, name: "Iced Coffee", price: 4.0 },
        { id: 5, name: "Iced Tea", price: 3.0 },
        { id: 6, name: "Iced Chocolate", price: 4.5 },
      ],
    },
    {
      title: "Snacks",
      data: [
        { id: 7, name: "Cookie", price: 5 },
        { id: 8, name: "Chokladboll", price: 5 },
        { id: 9, name: "Chokladstycksak", price: 10 },
      ],
    },
    {
      title: "Mat",
      data: [
        { id: 10, name: "Pizza", price: 20 },
        { id: 11, name: "Pirog", price: 15 },
      ],
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SectionList
        sections={menuSections}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={() =>
              alert(
                "You have selected " + item.name + " for " + item.price + ":-",
              )
            }
          >
            <Text style={styles.menuText}>{item.name}</Text>
            <Text style={styles.menuText}>{item.price}:-</Text>
          </TouchableOpacity>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <ThemedView
            style={styles.sectionHeader}
            lightColor={theme.colorWhite}
            darkColor={theme.colorDarkBlue}
          >
            <ThemedText fontWeight="bold" fontSize={20}>
              {title}
            </ThemedText>
          </ThemedView>
        )}
        contentContainerStyle={styles.flatListContainer}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colorWhite,
  },
  sectionHeader: {
    backgroundColor: theme.colorPurple,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  menuText: {
    color: theme.colorBlack,
    fontSize: 16,
  },
  flatListContainer: {
    paddingTop: theme.space16,
  },
});
