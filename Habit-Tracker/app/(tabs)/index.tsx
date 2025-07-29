
import { DATABASE_ID, databases, HABIT_COLLECTION_ID } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { Habit } from "@/types/database.type";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Query } from "react-native-appwrite";
import { Button } from "react-native-paper";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";
import { MaterialCommunityIcons } from "@expo/vector-icons";


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
        <Button 
        style={styles.button} 
        onPress={signOut} 
        mode="text" 
        icon={"logout"}>Sign out</Button>
      </View>
      <View style={styles.content}>
      {
        habits?.length === 0 ? (
          <View>
            <Text style={styles.habittext}>Theres no habit, Create your first habit</Text>
          </View>
        ) : (
          habits?.map((habit, key) => (
            <View style={styles.wrapper} key={key}>
              <Text>{habit.title}</Text>
              <Text>{habit.description}</Text>
              <View>
                <MaterialCommunityIcons 
                  name="fire"
                  size={28}
                  color={"#ff9800"}
                />
              </View>
              <Text>{habit.streak_count} day streak</Text>
              <View>
                <Text>{habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}</Text>
              </View>
            </View>
          ))
        )
      }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(3),
    //justifyContent: "center",
    //alignItems: "center"
  },
  headline: {
    fontSize: RFValue(25)
  },
  habittext: {
    fontSize: RFValue(15),
    marginTop: hp(2),
  },
  button: {
    backgroundColor: "blue",
    marginTop: hp(1),
    width: wp(40)
  },
  content: {
    gap: wp(2)
  },
 wrapper: {
  border: '#e0e0e0', 
  borderRadius: wp(3), 
  padding: wp(3), 
  backgroundColor: '#ffffff',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
  marginTop: hp(2), 
  transition: 'all 0.3s ease',
  ':hover': {
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)', 
    transform: 'translateY(-2px)', 
  },
}
})
