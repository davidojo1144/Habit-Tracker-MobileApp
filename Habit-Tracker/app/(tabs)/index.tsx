
import { DATABASE_ID, databases, HABIT_COLLECTION_ID } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { Habit } from "@/types/database.type";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Query } from "react-native-appwrite";
import { Button } from "react-native-paper";


export default function Index() {
  const {signOut, user} = useAuth()

  const [habits, setHabits] = useState<Habit[]>()

  useEffect(() => {
    fetchHabits()
  }, [user])

  const fetchHabits = async () => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        HABIT_COLLECTION_ID,
        [Query.equal("user_id", user?.$id ?? "")]
      )
      setHabits(response.documents as Habit[])
    } catch (error) {
      console.error(error)
    }
  }
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
