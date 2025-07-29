
import { DATABASE_ID, databases, HABIT_COLLECTION_ID } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { Habit } from "@/types/database.type";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Query } from "react-native-appwrite";
import { Button } from "react-native-paper";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";


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
    <View style={styles.container}>
      <View>
        <Text style={styles.headline}>Today's Habits</Text>
        <Button onPress={signOut} mode="text" icon={"logout"}>Sign out</Button>
      </View>

      {
        habits?.length === 0 ? (
          <View>
            <Text>Theres no habit, Create your first habit</Text>
          </View>
        ) : (
          habits?.map((habit, key) => (
            <View key={key}>

            </View>
          ))
        )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(3),
    justifyContent: "center",
    alignItems: "center"
  },
  headline: {
    fontSize: RFValue(20)
  }
})
