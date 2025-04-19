import { supabase } from "@/lib/supabase";
import React, {
  createContext,
  useContext,
  PropsWithChildren,
  useEffect,
  useState,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useSession } from "@/components/SessionProvider";
import { getPermisions } from "./notification-permissions";
import { useSplashContext } from "@/components/SplashProvider";
type OnboardingContextType = {
  invitationCode: string;
  isLoading: boolean;
  submitInvitationCode: (code: string) => Promise<boolean>;
  onboardingState: OnboardingState;
  setOnboardingState: (state: OnboardingState) => void;
  RedirectToCurrentState: React.ReactNode;
  isNotificationsGranted: boolean;
  setIsNotificationsGranted: (granted: boolean) => void;
  setLoginInstead: (loginInstead: boolean) => void;
};

const OnboardingContext = createContext<OnboardingContextType | null>(null);

type OnboardingState =
  | "1.enterCode"
  | "2.createAccount"
  | "3.profile"
  | "4.notifications"
  | "5.completed"
  | "10.login";

export function OnboardingProvider({ children }: PropsWithChildren) {
  const [invitationCode, setInvitationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingState, setOnboardingState] =
    useState<OnboardingState>("1.enterCode");
  const { isLoggedIn, profile } = useSession();
  const [isNotificationsGranted, setIsNotificationsGranted] = useState(false);
  const { setHasFinishedOnboardingLoading } = useSplashContext();
  const [loginInstead, setLoginInstead] = useState(false);

  console.log("Onboarding status:", onboardingState);

  useEffect(() => {
    async function loadInitialStuff() {
      try {
        const timer = setTimeout(() => {
          setHasFinishedOnboardingLoading(true);
        }, 5000);

        console.log(1);
        const granted = await getPermisions();
        console.log(2);
        setIsNotificationsGranted(granted);
        console.log(3);

        const onboardingCompleted = await AsyncStorage.getItem(
          "onboardingCompleted",
        );
        console.log(4, onboardingCompleted);
        if (onboardingCompleted) {
          console.log(4.5);
          setOnboardingState("5.completed");
        }
        console.log(5);
        clearTimeout(timer);

        setHasFinishedOnboardingLoading(true);
      } catch (error) {
        console.error("Error loading initial stuff:", error);
        setHasFinishedOnboardingLoading(true);
      }
    }

    loadInitialStuff();
  }, [setHasFinishedOnboardingLoading]);

  let RedirectToCurrentState;
  switch (onboardingState) {
    case "1.enterCode":
      RedirectToCurrentState = <Redirect href="/onboarding/EnterCode" />;
      break;
    case "2.createAccount":
      RedirectToCurrentState = <Redirect href="/onboarding/CreateAccount" />;
      break;
    case "3.profile":
      RedirectToCurrentState = <Redirect href="/onboarding/Profile" />;
      break;
    case "4.notifications":
      RedirectToCurrentState = <Redirect href="/onboarding/Notifications" />;
      break;
    case "5.completed":
      RedirectToCurrentState = <Redirect href="/" />;
      break;
    case "10.login":
      RedirectToCurrentState = <Redirect href="/onboarding/login" />;
      break;
  }

  useEffect(() => {
    if (loginInstead && !isLoggedIn) {
      console.log("Setting onboarding state to 10.login");
      setOnboardingState("10.login");
      return;
    }

    if (!invitationCode && !isLoggedIn) {
      console.log("Setting onboarding state to 1.enterCode");
      setOnboardingState("1.enterCode");
      return;
    }

    if (!isLoggedIn) {
      console.log("Setting onboarding state to 2.createAccount");
      setOnboardingState("2.createAccount");
      return;
    }

    if (!profile?.first_name || !profile?.last_name) {
      console.log("Setting onboarding state to 3.profile");
      setOnboardingState("3.profile");
      return;
    }

    if (!isNotificationsGranted) {
      console.log("Setting onboarding state to 4.notifications");
      setOnboardingState("4.notifications");
      return;
    }

    console.log("Setting onboarding state to 5.completed");
    setOnboardingState("5.completed");
    AsyncStorage.setItem("onboardingCompleted", "true");
  }, [
    invitationCode,
    isLoggedIn,
    onboardingState,
    profile?.first_name,
    profile?.last_name,
    isNotificationsGranted,
    loginInstead,
  ]);

  // On mount, check localStorage for an existing code
  useEffect(() => {
    const getInvitationCode = async () => {
      const storedCode = await AsyncStorage.getItem("invitationCode");
      if (storedCode) {
        setInvitationCode(storedCode);
      }
    };
    getInvitationCode();
  }, []);

  const submitInvitationCode = useCallback(async (code: string) => {
    setIsLoading(true);
    try {
      // 1. Fetch invitation row by code
      const { data, error } = await supabase
        .from("invitations")
        .select("*")
        .eq("code", code)
        .maybeSingle();

      if (error) {
        console.error("Error fetching invitation:", error.message, data);
        alert("Something went wrong. Please try again.");
        setIsLoading(false);
        return false;
      }

      if (!data) {
        // No invitation found
        alert("Invalid code. Please try again.");
        setIsLoading(false);
        return false;
      }

      // 2. Check if code is expired or consumed (for single-use)
      const isExpired = data.expires && new Date(data.expires) < new Date();
      if (isExpired) {
        alert("This code is expired.");
        setIsLoading(false);
        return false;
      }

      if (data.single_use && data.consumed) {
        alert("This code has already been used.");
        setIsLoading(false);
        return false;
      }

      // 3. If it's single-use, mark it as consumed
      if (data.single_use && !data.consumed) {
        console.log("Consuming invitation");
        const x = await supabase.rpc("consume_invitation", {
          _id: data.id,
        });

        if (x.error) {
          console.error(
            "Error consuming invitation:",
            x.error.message,
            data.id,
          );
          alert("Something went wrong. Please try again.");
          setIsLoading(false);
          return false;
        }
      }

      // 4. (Optional) Grab the eventId or other data from the invitation
      // e.g. data.auto_invited_to_event might be your event ID
      // const eventId = data.auto_invited_to_event;

      // 5. Store the invitation code in localStorage to persist
      await AsyncStorage.setItem("invitationCode", code);

      // 6. Update state so the UI knows we have a valid code
      setInvitationCode(code);

      // Successfully submitted and verified the code
      setIsLoading(false);
      return true;
    } catch (err) {
      console.error("Caught an error:", err);
      alert("Something went wrong. Please try again.");
      setIsLoading(false);
      return false;
    }
  }, []);

  return (
    <OnboardingContext.Provider
      value={{
        invitationCode,
        isLoading,
        submitInvitationCode,
        onboardingState,
        setOnboardingState,
        RedirectToCurrentState,
        isNotificationsGranted,
        setIsNotificationsGranted,
        setLoginInstead,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);

  if (!context) {
    throw new Error("useOnboarding must be used within a OnboardingProvider");
  }
  return context;
}
