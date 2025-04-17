import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  Switch,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/components/SessionProvider";
import { useEvent } from "../EventProvider";

interface NewAnnouncementModalProps {
  visible: boolean;
  onClose: () => void;
  onAnnouncementCreated: () => void;
}

export function NewAnnouncementModal({
  visible,
  onClose,
  onAnnouncementCreated,
}: NewAnnouncementModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sendNotification, setSendNotification] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { session } = useSession();
  const userId = session?.user.id;
  const { currentEventInfo } = useEvent();

  const handleSubmit = async () => {
    if (!userId || !title.trim() || !content.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("announcements")
        .insert({
          title: title.trim(),
          content: content.trim(),
          author_id: userId,
          event_id: currentEventInfo!.id,
          // send_notification: sendNotification,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating announcement:", error.message);
        return;
      }

      // Reset form and close modal
      setTitle("");
      setContent("");
      setSendNotification(false);
      onAnnouncementCreated();
      onClose();
    } catch (error) {
      console.error("Error creating announcement:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardAvoidingView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>New Announcement</Text>

              <TextInput
                style={styles.input}
                placeholder="What's the announcement about?"
                placeholderTextColor="#999"
                value={title}
                onChangeText={setTitle}
                maxLength={100}
              />

              <TextInput
                style={[styles.input, styles.contentInput]}
                placeholder="Share the details of your announcement..."
                placeholderTextColor="#999"
                value={content}
                onChangeText={setContent}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />

              <View style={styles.notificationContainer}>
                <Text style={styles.notificationLabel}>
                  Send as notification
                </Text>
                <Switch
                  value={sendNotification}
                  onValueChange={setSendNotification}
                />
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={onClose}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.submitButton]}
                  onPress={handleSubmit}
                  disabled={isSubmitting || !title.trim() || !content.trim()}
                >
                  <Text style={styles.buttonText}>
                    {isSubmitting ? "Creating..." : "Create"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  contentInput: {
    height: 120,
  },
  notificationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  notificationLabel: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#ddd",
  },
  submitButton: {
    backgroundColor: "#6200ee",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
