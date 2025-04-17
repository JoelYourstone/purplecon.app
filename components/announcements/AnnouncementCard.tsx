import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { formatDistanceToNow } from "date-fns";
import { Announcement } from "@/app/(tabs)/announcements";
import { getPublicAvatarUrl } from "@/supabase/index";
import { sv } from "date-fns/locale";
import { LikeButton } from "./LikeButton";

interface AnnouncementCardProps {
  announcement: Announcement;
  onPress: () => void;
  onLike: () => Promise<void>;
  onUnlike: () => Promise<void>;
  isLiked: boolean;
}

export function AnnouncementCard({
  announcement,
  onPress,
  onLike,
  onUnlike,
  isLiked,
}: AnnouncementCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        {announcement.author.avatar_url && (
          <Image
            source={{ uri: getPublicAvatarUrl(announcement.author.avatar_url) }}
            style={styles.avatar}
          />
        )}
        <View
          style={[
            styles.headerText,
            !announcement.author.avatar_url && styles.headerTextNoAvatar,
          ]}
        >
          <Text style={styles.authorName}>
            {`${announcement.author.first_name} ${announcement.author.last_name}`}
          </Text>
          <Text style={styles.timestamp}>
            {formatDistanceToNow(new Date(announcement.created_at), {
              addSuffix: true,
              locale: sv,
            })}
          </Text>
        </View>
      </View>
      <Text style={styles.title}>{announcement.title}</Text>
      <Text style={styles.content}>{announcement.content}</Text>
      <View style={styles.footer}>
        <View style={styles.interaction}>
          <LikeButton
            isLiked={isLiked}
            likesCount={announcement.likes_count}
            onLike={onLike}
            onUnlike={onUnlike}
          />
        </View>
        <View style={styles.interaction}>
          {announcement.comments_count > 0 && (
            <Text style={styles.interactionText}>
              {announcement.comments_count} comments
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerText: {
    marginLeft: 12,
  },
  headerTextNoAvatar: {
    marginLeft: 0,
  },
  authorName: {
    fontSize: 16,
    fontWeight: "600",
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 12,
  },
  content: {
    fontSize: 16,
    color: "#333",
    marginTop: 8,
    lineHeight: 24,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  interaction: {
    flexDirection: "row",
    alignItems: "center",
  },
  interactionText: {
    fontSize: 14,
    color: "#666",
  },
});
