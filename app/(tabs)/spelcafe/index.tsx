import { View } from "react-native";
import { useSession } from "@/components/SessionProvider";
import Account from "@/components/account";
import Auth from "@/components/login";

export default function App() {
  const { session } = useSession();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      {session && session.user ? (
        <Account key={session.user.id} session={session} />
      ) : (
        <Auth />
      )}
    </View>
  );
}
