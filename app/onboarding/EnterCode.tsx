import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, View, StyleSheet } from "react-native";

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { theme } from "@/theme";
import { useOnboarding } from "@/features/onboarding/OnboardingContext";
import { ClearReloadButton } from "@/app/(tabs)/info";
const CELL_COUNT = 5;

export default function EnterCode() {
  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const {
    invitationCode,
    submitInvitationCode,
    onboardingState,
    RedirectToCurrentState,
  } = useOnboarding();

  // console.log(invitationCode);

  useEffect(() => {
    // console.log("value", value);
    if (value.length === CELL_COUNT) {
      submitInvitationCode(value).then((success) => {
        if (success) {
          console.log("success!!");
          // router.push("/onboarding/success");
        } else {
          console.log("failed!!");
          setValue("");
        }
      });
    }
  }, [value, submitInvitationCode]);

  if (onboardingState !== "1.enterCode") {
    return RedirectToCurrentState;
  }

  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.title}>Enter code</Text>
      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={setValue}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({ index, symbol, isFocused }) => (
          <View
            onLayout={getCellOnLayoutHandler(index)}
            key={index}
            style={[styles.cellRoot, isFocused && styles.focusCell]}
          >
            <Text style={styles.cellText}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          </View>
        )}
      />
      <ClearReloadButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    padding: 20,
    backgroundColor: theme.colorDarkestBlue,
  },
  title: { textAlign: "center", fontSize: 30, color: theme.colorWhite },
  codeFieldRoot: {
    marginTop: 20,
    width: 280,
    marginLeft: "auto",
    marginRight: "auto",
  },
  cellRoot: {
    width: 40,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "white",
    borderBottomWidth: 1,
  },
  cellText: {
    color: theme.colorWhite,
    fontSize: 36,
    textAlign: "center",
  },
  focusCell: {
    borderBottomColor: "white",
    borderBottomWidth: 2,
  },
});
