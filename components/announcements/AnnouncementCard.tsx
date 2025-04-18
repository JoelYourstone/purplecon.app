import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { formatDistanceToNow } from "date-fns";
import { Announcement } from "@/app/(tabs)/announcements";
import { getPublicAvatarUrl } from "@/supabase/index";
import { sv } from "date-fns/locale";
import { LikeButton } from "./LikeButton";
import { useEvent } from "@/components/EventProvider";
import { useEffect, useState, useCallback } from "react";

interface AnnouncementCardProps {
  announcement: Announcement;
  onPress: () => void;
  onLike: () => Promise<void>;
  onUnlike: () => Promise<void>;
  isLiked: boolean;
  isNew?: boolean;
}

export function AnnouncementCard({
  announcement,
  onPress,
  onLike,
  onUnlike,
  isLiked,
  isNew = false,
}: AnnouncementCardProps) {
  const { readStatus } = useEvent();
  const isRead = readStatus[announcement.id] || false;
  const [highlightAnim] = useState(() => new Animated.Value(0));

  const startHighlightAnimation = useCallback(() => {
    if (isNew) {
      Animated.sequence([
        Animated.timing(highlightAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(highlightAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isNew, highlightAnim]);

  useEffect(() => {
    startHighlightAnimation();
  }, [startHighlightAnimation]);

  const handlePress = useCallback(() => {
    onPress();
  }, [onPress]);

  const backgroundColor = highlightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["white", "rgba(98, 0, 238, 0.1)"],
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      <TouchableOpacity onPress={handlePress}>
        <View style={styles.header}>
          {announcement.author.avatar_url && (
            <Image
              source={{
                uri: getPublicAvatarUrl(announcement.author.avatar_url),
              }}
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
          {!isRead && <View style={styles.unreadIndicator} />}
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
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  headerTextNoAvatar: {
    marginLeft: 0,
  },
  authorName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  content: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
    marginBottom: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  interaction: {
    flexDirection: "row",
    alignItems: "center",
  },
  interactionText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#6200ee",
    marginLeft: 8,
  },
});
