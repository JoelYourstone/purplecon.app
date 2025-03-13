import { useScrollToTop } from "@react-navigation/native";
import React from "react";
import { StyleSheet, View, Text } from "react-native";

import { theme } from "@/theme";
import { FlatList } from "react-native-gesture-handler";

export default function Bookmarks() {
  const scrollRef = React.useRef<FlatList>(null);
  useScrollToTop(scrollRef);

  return (
    <View>
      <Text>Bookmarks</Text>
    </View>
  );

  // return (
  //   <ThemedView
  //     style={styles.container}
  //     darkColor={theme.colorDarkBlue}
  //     lightColor={theme.colorWhite}
  //   >
  //     {dayOneFiltered.length || dayTwoFiltered.length ? (
  //       <FlatList
  //         ref={scrollRef}
  //         contentContainerStyle={styles.flatListContainer}
  //         data={[
  //           ...dayOneFiltered.map((talk) => ({ talk, isDayOne: true })),
  //           ...dayTwoFiltered.map((talk) => ({ talk, isDayOne: false })),
  //         ]}
  //         renderItem={({ item }) => (
  //           <TalkCard
  //             key={item.talk.id}
  //             session={item.talk}
  //             isDayOne={item.isDayOne}
  //           />
  //         )}
  //       />
  //     ) : (
  //       <View style={styles.bookmarks}>
  //         <ThemedText
  //           fontWeight="bold"
  //           fontSize={20}
  //           style={{ marginBottom: theme.space8 }}
  //         >
  //           No sessions bookmarked
  //         </ThemedText>
  //         <ThemedText fontSize={18}>
  //           Tap on the bookmark icon on a session to add it to your bookmarks,
  //           and it will be displayed here.
  //         </ThemedText>
  //       </View>
  //     )}
  //   </ThemedView>
  // );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatListContainer: {
    paddingTop: theme.space16,
  },
  bookmarks: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: theme.space24,
  },
});
