import { TouchableOpacity, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

interface LikeButtonProps {
  isLiked: boolean;
  likesCount: number;
  onLike: () => Promise<void>;
  onUnlike: () => Promise<void>;
}

export function LikeButton({
  isLiked,
  likesCount,
  onLike,
  onUnlike,
}: LikeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePress = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      if (isLiked) {
        await onUnlike();
      } else {
        await onLike();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      disabled={isLoading}
    >
      <Ionicons
        name={isLiked ? "heart" : "heart-outline"}
        size={20}
        color={isLiked ? "#FF3B30" : "#8E8E93"}
      />
      {likesCount > 0 && (
        <Text style={[styles.countText, isLiked && styles.countTextLiked]}>
          {likesCount}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  countText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#8E8E93",
  },
  countTextLiked: {
    color: "#FF3B30",
  },
});
