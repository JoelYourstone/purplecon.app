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
import { NewAnnouncementModal } from "@/components/announcements/NewAnnouncementModal";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/components/SessionProvider";
import { Tables } from "@/supabase";
import { useAnnouncementReadStatus } from "@/lib/announcementReadStatus";

export default function Announcements() {
  const [isLoading, setIsLoading] = useState(true);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [likedAnnouncements, setLikedAnnouncements] = useState<Set<string>>(
    new Set(),
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { markAllAsRead } = useAnnouncementReadStatus();

  const { session, profile } = useSession();
  const userId = session?.user.id;
  const isAdmin = profile?.is_admin ?? false;

  const renderItem = ({ item }: { item: Announcement }) => {
    const isLiked = likedAnnouncements.has(item.id);

    return (
      <AnnouncementCard
        announcement={item}
        isLiked={isLiked}
        onPress={() => {
          // Handle announcement press
          console.log("Announcement pressed:", item.id);
        }}
        onLike={async () => {
          await handleLike(item.id);
          setLikedAnnouncements((prev) => new Set(prev).add(item.id));
          // Update like count
          setAnnouncements((prev) =>
            prev.map((announcement) =>
              announcement.id === item.id
                ? { ...announcement, likes_count: announcement.likes_count + 1 }
                : announcement,
            ),
          );
        }}
        onUnlike={async () => {
          await handleUnlike(item.id);
          setLikedAnnouncements((prev) => {
            const newSet = new Set(prev);
            newSet.delete(item.id);
            return newSet;
          });
          // Update like count
          setAnnouncements((prev) =>
            prev.map((announcement) =>
              announcement.id === item.id
                ? {
                    ...announcement,
                    likes_count: Math.max(0, announcement.likes_count - 1),
                  }
                : announcement,
            ),
          );
        }}
      />
    );
  };

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
            first_name,
            last_name,
            avatar_url
          ),
          likes:announcement_likes (
            user_id
          ),
          comments:announcement_comments (
            id,
            content,
            created_at,
            user:profiles (
              first_name,
              last_name,
              avatar_url
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

      // Set initial liked announcements
      if (userId) {
        const likedIds = announcements
          .filter((announcement) =>
            announcement.likes.some((like) => like.user_id === userId),
          )
          .map((announcement) => announcement.id);
        setLikedAnnouncements(new Set(likedIds));
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewAnnouncementCreated = () => {
    fetchAnnouncements();
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    if (announcements.length > 0) {
      markAllAsRead(announcements.map((a) => a.id));
    }
  }, [announcements]);

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
      {isAdmin && (
        <>
          <TouchableOpacity
            style={styles.fab}
            onPress={() => setIsModalVisible(true)}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
          <NewAnnouncementModal
            visible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            onAnnouncementCreated={handleNewAnnouncementCreated}
          />
        </>
      )}
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

export type Announcement = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  author_id: string;
  event_id: number | null;
  comments_count: number;
  likes_count: number;
  author: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  };
  likes: {
    user_id: string;
  }[];
  comments: {
    id: string;
    content: string;
    created_at: string;
    user: {
      first_name: string | null;
      last_name: string | null;
      avatar_url: string | null;
    };
  }[];
};
