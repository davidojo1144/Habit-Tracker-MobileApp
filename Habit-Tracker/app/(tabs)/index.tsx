
import { client, DATABASE_ID, databases, HABIT_COLLECTION_ID, RealTimeResponse } from "@/lib/appwrite";
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

    const channel = `databases.${DATABASE_ID}.collections.${HABIT_COLLECTION_ID}.documents`
    const HabitsSubscription = client.subscribe(
      channel,
      (response: RealTimeResponse) => {
        if (response.events.includes(
          "databases.*.collections.*.documents.*.create"
        )) {
          fetchHabits()
        }
      }
    )
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
              <Text style={{fontSize: RFValue(20), color: "black", fontWeight: 500}}>{habit.title}</Text>
              <Text style={{fontSize: RFValue(17), marginTop: hp(1), color: "gray"}}>{habit.description}</Text>
              <View style={{flexDirection: "row", alignItems: "center",  gap: wp(1), padding: wp(0.5), backgroundColor: "#ffd4b2", width: wp(30), marginTop: hp(1), borderRadius: wp(2)}}>
                <MaterialCommunityIcons 
                  name="fire"
                  size={20}
                  color={"#ff9800"}
                />
                <Text style={{fontSize: RFValue(12), marginTop: hp(1), color: "gray"}}>{habit.streak_count} day streak</Text>
              </View>
              <View>
                <Text style={{fontSize: RFValue(15), marginTop: hp(1), color: '#6b21a8'}}>{habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}</Text>
              </View>
            </View>
          ))
        )
      }
      </View>
      <Button 
        style={styles.button} 
        onPress={signOut} 
        mode="text" 
        icon={"logout"}>Sign out</Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(3),
  },
  headline: {
    fontSize: RFValue(25)
  },
  habittext: {
    fontSize: RFValue(15),
    marginTop: hp(2),
  },
  button: {
    backgroundColor: '#6b21a8',
    marginTop: hp(3),
    width: wp(40)
  },
  content: {
    gap: wp(2),
  },
 wrapper: {
  border: '#e0e0e0', 
  borderRadius: wp(3), 
  padding: wp(3), 
  backgroundColor: '#fae8ffff',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
  marginTop: hp(2), 
  transition: 'all 0.3s ease',
  ':hover': {
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)', 
    transform: 'translateY(-2px)', 
  },
}
})
