import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";
import { useState, useCallback } from "react";
import { AnnouncementCard } from "../../components/AnnouncementCard";
import { AnnouncementSkeleton } from "../../components/AnnouncementSkeleton";
import { mockAnnouncements, Announcement } from "../../types/announcement";
import { Ionicons } from "@expo/vector-icons";

export default function Announcements() {
  const [isLoading, setIsLoading] = useState(true);
  const [announcements, setAnnouncements] = useState(mockAnnouncements);

  // Simulate loading
  useState(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  });

  const renderItem = useCallback(({ item }: { item: Announcement }) => {
    return (
      <AnnouncementCard
        announcement={item}
        onPress={() => {
          // Handle announcement press
          console.log("Announcement pressed:", item.id);
        }}
      />
    );
  }, []);

  const renderSkeleton = useCallback(() => {
    return <AnnouncementSkeleton />;
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={isLoading ? Array(3).fill(null) : announcements}
        renderItem={({ item }) =>
          isLoading ? renderSkeleton() : renderItem({ item })
        }
        keyExtractor={(item, index) => (item?.id || index).toString()}
        contentContainerStyle={styles.listContent}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          // Handle new announcement press
          console.log("New announcement pressed");
        }}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  listContent: {
    padding: 16,
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#6200ee",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
