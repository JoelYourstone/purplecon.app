import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Announcement } from "../types/announcement";
import { formatDistanceToNow } from "date-fns";

interface AnnouncementCardProps {
  announcement: Announcement;
  onPress: () => void;
}

export function AnnouncementCard({
  announcement,
  onPress,
}: AnnouncementCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <Image
          source={{ uri: announcement.author.avatar }}
          style={styles.avatar}
        />
        <View style={styles.headerText}>
          <Text style={styles.authorName}>{announcement.author.name}</Text>
          <Text style={styles.timestamp}>
            {formatDistanceToNow(new Date(announcement.createdAt), {
              addSuffix: true,
            })}
          </Text>
        </View>
      </View>
      <Text style={styles.title}>{announcement.title}</Text>
      <Text style={styles.content}>{announcement.content}</Text>
      <View style={styles.footer}>
        <View style={styles.interaction}>
          <Text style={styles.interactionText}>{announcement.likes} likes</Text>
        </View>
        <View style={styles.interaction}>
          <Text style={styles.interactionText}>
            {announcement.comments} comments
          </Text>
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
