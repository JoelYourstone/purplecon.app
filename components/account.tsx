import { useState, useEffect } from "react";
import { StyleSheet, View, Button, TextInput, Text } from "react-native";
import Avatar from "./Avatar";
import { useSession } from "./SessionProvider";

export default function Account() {
  const [avatarUrl, setAvatarUrl] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [useCamera, setUseCamera] = useState(false);

  const { profile, session, updateProfile, loading } = useSession();

  useEffect(() => {
    if (session) {
      setAvatarUrl(profile?.avatar_url ?? "");
      setFirstName(profile?.first_name ?? "");
      setLastName(profile?.last_name ?? "");
    } else console.log("No session");
  }, [session, profile?.avatar_url, profile?.first_name, profile?.last_name]);

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
          useCamera={useCamera}
          onCameraToggle={() => setUseCamera(!useCamera)}
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
