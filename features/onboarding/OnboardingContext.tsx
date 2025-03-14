import { supabase } from "@/lib/supabase";
import React, {
  createContext,
  useContext,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type OnboardingContextType = {
  invitationCode: string;
  isLoading: boolean;
  submitInvitationCode: (code: string) => Promise<boolean>;
};

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export function OnboardingProvider({ children }: PropsWithChildren) {
  const [invitationCode, setInvitationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  const submitInvitationCode = async (code: string) => {
    setIsLoading(true);
    try {
      // 1. Fetch invitation row by code
      const { data, error } = await supabase
        .from("invitations")
        .select("*")
        // .eq("code", code)
        .maybeSingle();

      console.log("data", data);
      console.log("error", error);
      console.log("code", code);

      if (error) {
        console.error("Error fetching invitation:", error.message);
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
        const { error: updateError } = await supabase
          .from("invitations")
          .update({ consumed: true })
          .eq("id", data.id);

        if (updateError) {
          console.error("Error consuming invitation:", updateError.message);
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
  };

  return (
    <OnboardingContext.Provider
      value={{
        invitationCode,
        isLoading,
        submitInvitationCode,
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
