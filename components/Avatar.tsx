import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  StyleSheet,
  View,
  Alert,
  Image,
  Button,
  TouchableOpacity,
  Text,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
// Add buffer polyfill for React Native
import { Buffer as BufferPolyfill } from "buffer";
// Make Buffer available globally
global.Buffer = global.Buffer || BufferPolyfill;

interface Props {
  size: number;
  url: string | null;
  onUpload: (filePath: string) => void;
  useCamera?: boolean;
  onCameraToggle?: () => void;
}

export default function Avatar({
  size,
  url,
  onUpload,
  useCamera = false,
  onCameraToggle,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const avatarSize = { height: size, width: size };

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path);

      if (error) {
        throw error;
      }

      const fr = new FileReader();
      fr.readAsDataURL(data);
      fr.onload = () => {
        setAvatarUrl(fr.result as string);
      };
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error downloading image: ", error.message);
      }
    }
  }

  async function uploadAvatar() {
    try {
      setUploading(true);

      // Request permission to access the photo library
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Sorry, we need camera roll permissions to make this work!",
        );
        return;
      }

      // Pick an image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        await processAndUploadImage(result.assets[0].uri);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setUploading(false);
    }
  }

  async function takePhoto() {
    try {
      setUploading(true);

      // Request permission to access the camera
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Sorry, we need camera permissions to make this work!");
        return;
      }

      // Take a photo
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        await processAndUploadImage(result.assets[0].uri);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setUploading(false);
    }
  }

  async function processAndUploadImage(uri: string) {
    try {
      const fileExt = uri.substring(uri.lastIndexOf(".") + 1);
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Get the actual file content
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) {
        throw new Error("File does not exist");
      }

      // Read the file
      const fileContents = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Upload the file - using Buffer from the polyfill
      const { error } = await supabase.storage
        .from("avatars")
        .upload(filePath, Buffer.from(fileContents, "base64"), {
          contentType: `image/${fileExt}`,
        });

      if (error) {
        throw error;
      }

      onUpload(filePath);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    }
  }

  return (
    <View style={styles.container}>
      {avatarUrl ? (
        <Image
          source={{ uri: avatarUrl }}
          accessibilityLabel="Avatar"
          style={[avatarSize, styles.avatar, styles.image]}
        />
      ) : (
        <View style={[avatarSize, styles.avatar, styles.noImage]} />
      )}
      <View style={styles.buttons}>
        <Button
          title="Choose Image"
          onPress={uploadAvatar}
          disabled={uploading}
        />
        <TouchableOpacity style={styles.cameraToggle} onPress={onCameraToggle}>
          <Text>OR</Text>
        </TouchableOpacity>
        <Button title="Take Photo" onPress={takePhoto} disabled={uploading} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  avatar: {
    borderRadius: 5,
    overflow: "hidden",
    maxWidth: "100%",
  },
  image: {
    objectFit: "cover",
    paddingTop: 0,
  },
  noImage: {
    backgroundColor: "#333",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "rgb(200, 200, 200)",
    borderRadius: 5,
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  cameraToggle: {
    marginHorizontal: 10,
  },
});
