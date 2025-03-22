import { ScrollView, Alert, View, TextInput, StyleSheet } from "react-native";
import { theme } from "@/theme";
import { useOnboarding } from "@/features/onboarding/OnboardingContext";
import { Button } from "@/components/Button";
import { ThemedView, useThemeColor } from "@/components/Themed";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const { RedirectToCurrentState, onboardingState, setLoginInstead } =
    useOnboarding();

  const backgroundColor = useThemeColor({
    light: theme.colorWhite,
    dark: theme.colorDarkBlue,
  });

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

  if (onboardingState !== "10.login") {
    return RedirectToCurrentState;
  }

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <View style={[styles.verticallySpaced, styles.mt20]}>
            <TextInput
              style={styles.textInputStyle}
              // label="Email"
              // leftIcon={{ type: "font-awesome", name: "envelope" }}
              onChangeText={(text) => setEmail(text.trim())}
              value={email}
              placeholder="Email"
              textContentType="emailAddress"
              // keyboardType="phone-pad"
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
              placeholder="Lösenord"
              textContentType="password"
              autoCapitalize={"none"}
            />
          </View>
          <View style={[styles.verticallySpaced, styles.mt20]}>
            <Button
              title="Sign in"
              isLoading={loading}
              onPress={() => signInWithEmail()}
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
  textInputStyle: {
    color: theme.colorWhite,
  },
});
