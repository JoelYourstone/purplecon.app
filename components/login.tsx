import { useScrollToTop } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Alert,
  AppState,
  StyleSheet,
  View,
  Button,
  TextInput,
  Text,
} from "react-native";
import { ThemedView, useThemeColor } from "@/components/Themed";
import { theme } from "@/theme";
import { ScrollView } from "react-native-gesture-handler";
import { supabase } from "@/lib/supabase";
import { Link } from "expo-router";
// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Info() {
  const backgroundColor = useThemeColor({
    light: theme.colorWhite,
    dark: theme.colorDarkBlue,
  });
  const ref = React.useRef(null);
  useScrollToTop(ref);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const {
      error,
      data: { session },
    } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);

    if (session) {
      Alert.alert("Signed in!");
    }
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    // TODO email deep link to user

    if (error) Alert.alert(error.message);
    if (!session)
      Alert.alert("Please check your inbox for email verification!");
    setLoading(false);
  }

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <ScrollView style={styles.scrollView} ref={ref}>
        <View style={styles.container}>
          <View style={[styles.verticallySpaced, styles.mt20]}>
            <TextInput
              // label="Email"
              // leftIcon={{ type: "font-awesome", name: "envelope" }}
              onChangeText={(text) => setEmail(text)}
              value={email}
              placeholder="email@address.com"
              textContentType="emailAddress"
              autoCapitalize={"none"}
            />
          </View>
          <View style={styles.verticallySpaced}>
            <TextInput
              // label="Password"
              // leftIcon={{ type: "font-awesome", name: "lock" }}
              onChangeText={(text) => setPassword(text)}
              value={password}
              secureTextEntry={true}
              placeholder="Password"
              textContentType="password"
              autoCapitalize={"none"}
            />
          </View>
          <View style={[styles.verticallySpaced, styles.mt20]}>
            <Button
              title="Sign in"
              disabled={loading}
              onPress={() => signInWithEmail()}
            />
          </View>
          <View style={styles.verticallySpaced}>
            <Button
              title="Sign up"
              disabled={loading}
              onPress={() => signUpWithEmail()}
            />
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  authContainer: {
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
