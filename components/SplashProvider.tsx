import BootSplash, { Manifest } from "react-native-bootsplash";
import MaskedView from "@react-native-masked-view/masked-view";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { StyleSheet, View, Text } from "react-native";
import { createContext, ReactNode, useContext, useRef, useState } from "react";

const MAX_SCALE = 1200;

const manifest: Manifest = require("../assets/bootsplash/manifest.json");

const styles = StyleSheet.create({
  mask: {
    backgroundColor: "green",
    borderRadius: 1,
    width: 1,
    height: 1,
  },
  transparent: {
    backgroundColor: "transparent",
  },
});

type Props = {
  animationEnded: boolean;
  children: ReactNode;
  onAnimationEnd: () => void;
};

type SplashContextType = {
  setHasFinishedSupabaseLoading: (hasFinished: boolean) => void;
  setHasFinishedOnboardingLoading: (hasFinished: boolean) => void;
};

const SplashContext = createContext<SplashContextType | null>(null);

export function SplashProvider({
  animationEnded,
  children,
  onAnimationEnd,
}: Props) {
  const [hasFinishedSupabaseLoading, setHasFinishedSupabaseLoading] =
    useState<boolean>(false);
  const [hasFinishedOnboardingLoading, setHasFinishedOnboardingLoading] =
    useState<boolean>(false);

  const hasFinishedLoading =
    hasFinishedSupabaseLoading && hasFinishedOnboardingLoading;

  const opacity = useSharedValue(1);
  const scale = useSharedValue(animationEnded ? MAX_SCALE : 1);

  const opacityStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const { container, logo, brand } = BootSplash.useHideAnimation({
    manifest,
    ready: hasFinishedLoading,

    logo: require("../assets/bootsplash/logo.png"),
    brand: require("../assets/bootsplash/brand.png"),

    statusBarTranslucent: true,
    navigationBarTranslucent: false,

    animate: () => {
      console.log("animate");
      opacity.value = withTiming(0, {
        duration: 700,
        easing: Easing.out(Easing.ease),
      });

      scale.value = withTiming(
        MAX_SCALE,
        {
          duration: 1000,
        },
        () => {
          runOnJS(onAnimationEnd)();
        },
      );
    },
  });

  return (
    <SplashContext.Provider
      value={{
        setHasFinishedSupabaseLoading,
        setHasFinishedOnboardingLoading,
      }}
    >
      {/* Apply background color under the mask */}
      {!animationEnded && <View style={container.style} />}

      <MaskedView
        style={StyleSheet.absoluteFill}
        maskElement={
          // Transparent background because mask is based off alpha channel
          <View style={[container.style, styles.transparent]}>
            <Animated.View
              style={[styles.mask, scaleStyle]}
              onLayout={() => {
                // setReady(true);
              }}
            />
          </View>
        }
      >
        {children}
      </MaskedView>

      {!animationEnded && (
        // Don't apply background color above the mask
        <View {...container} style={[container.style, styles.transparent]}>
          <Text style={{ color: "white" }}>
            Loading {hasFinishedSupabaseLoading ? "supabase" : ""}{" "}
            {hasFinishedOnboardingLoading ? "onboarding" : ""}
          </Text>
          <Animated.Image {...logo} style={[logo.style, opacityStyle]} />

          <Animated.Image {...brand} style={[brand.style, opacityStyle]} />
        </View>
      )}
    </SplashContext.Provider>
  );
}

export function useSplashContext() {
  const context = useContext(SplashContext);
  if (!context) {
    throw new Error("useSplash must be used within a SplashProvider");
  }
  return context;
}
