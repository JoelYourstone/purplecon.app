import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { StyleSheet, View, Alert, Button, TextInput, Text } from "react-native";
import { Session } from "@supabase/supabase-js";
import Avatar from "./Avatar";

export default function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    if (session) getProfile();
    else console.log("No session");
  }, [session]);

  async function getProfile() {
    try {
      console.log("Getting profile");
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`first_name, last_name, avatar_url`)
        .eq("id", session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setAvatarUrl(data.avatar_url ?? "");
        setFirstName(data.first_name ?? "");
        setLastName(data.last_name ?? "");
      } else {
        console.log("No data :((");
      }
    } catch (error) {
      console.log("Error: ", error);
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      console.log("Setting loading to false");
      setLoading(false);
    }
  }

  async function updateProfile({
    first_name,
    last_name,
    avatar_url,
  }: {
    first_name: string;
    last_name: string;
    avatar_url: string;
  }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const updates = {
        id: session?.user.id,
        first_name,
        last_name,
        avatar_url,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.verticallySpaced}>
        <Text>Förnamn:</Text>
        <TextInput
          value={firstName || ""}
          placeholder="Förnamn"
          onChangeText={(text) => setFirstName(text)}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Text>Efternamn:</Text>
        <TextInput
          value={lastName || ""}
          placeholder="Efternamn"
          onChangeText={(text) => setLastName(text)}
        />
      </View>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title={loading ? "Loading ..." : "Update"}
          onPress={() =>
            updateProfile({
              first_name: firstName,
              last_name: lastName,
              avatar_url: avatarUrl,
            })
          }
          disabled={loading}
        />
      </View>
      <View>
        <Avatar
          size={200}
          url={avatarUrl}
          onUpload={(url: string) => {
            setAvatarUrl(url);
            updateProfile({
              first_name: firstName,
              last_name: lastName,
              avatar_url: url,
            });
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});
