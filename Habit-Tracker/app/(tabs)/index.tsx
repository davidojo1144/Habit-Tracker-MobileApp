
import { useAuth } from "@/lib/auth-context";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";


export default function Index() {
  const {signOut} = useAuth()
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>index screen</Text>
      <Button onPress={signOut} mode="text" icon={"logout"}>Sign out</Button>
    </View>
  );
}
