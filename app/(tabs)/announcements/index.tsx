import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";
import { useState, useCallback, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { AnnouncementCard } from "@/components/announcements/AnnouncementCard";
import { AnnouncementSkeleton } from "@/components/announcements/AnnouncementSkeleton";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/components/SessionProvider";
import { Tables } from "@/supabase";
export default function Announcements() {
  const [isLoading, setIsLoading] = useState(true);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const { session } = useSession();
  const userId = session?.user.id;

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

  const handleLike = async (announcementId: string) => {
    if (!userId) {
      console.error("User ID is not available");
      return;
    }

    try {
      const { error } = await supabase
        .from("announcement_likes")
        .insert({ announcement_id: announcementId, user_id: userId });

      if (error) {
        console.error("Error liking announcement:", error.message);
      } else {
        console.log("Announcement liked successfully");
      }
    } catch (error) {
      console.error("Error liking announcement:", error);
    }
  };

  const handleUnlike = async (announcementId: string) => {
    if (!userId) {
      console.error("User ID is not available");
      return;
    }

    try {
      const { error } = await supabase
        .from("announcement_likes")
        .delete()
        .match({ announcement_id: announcementId, user_id: userId });

      if (error) {
        console.error("Error unliking announcement:", error.message);
      } else {
        console.log("Announcement unliked successfully");
      }
    } catch (error) {
      console.error("Error unliking announcement:", error);
    }
  };

  const handleComment = async (announcementId: string, commentText: string) => {
    if (!userId) {
      console.error("User ID is not available");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("announcement_comments")
        .insert({
          announcement_id: announcementId,
          content: commentText,
          user_id: userId,
        });

      if (error) {
        console.error("Error adding comment:", error.message);
      } else {
        console.log("Comment added successfully");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const { data: announcements, error } = await supabase
        .from("announcements")
        .select(
          `
          *,
          author:profiles (
            name,
            avatar
          ),
          likes:announcement_likes (
            user_id
          ),
          comments:announcement_comments (
            id,
            content,
            created_at,
            user:profiles (
              name,
              avatar
            )
          )
        `,
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching announcements:", error.message);
        return;
      }

      setAnnouncements(announcements);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
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

export type Announcement = Tables<"announcements">;
