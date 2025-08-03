import { client, DATABASE_ID, databases, HABIT_COLLECTION_ID, RealTimeResponse } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { Habit } from "@/types/database.type";
import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Query } from "react-native-appwrite";
import { Button } from "react-native-paper";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";

export default function Index() {
  const { signOut, user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>();
  const swipableRefs = useRef<{ [key: string]: Swipeable | null }>({});

  useEffect(() => {
    if (user) {
      const channel = `databases.${DATABASE_ID}.collections.${HABIT_COLLECTION_ID}.documents`;
      const HabitsSubscription = client.subscribe(
        channel,
        (response: RealTimeResponse) => {
          if (
            response.events.includes("databases.*.collections.*.documents.*.create") ||
            response.events.includes("databases.*.collections.*.documents.*.update") ||
            response.events.includes("databases.*.collections.*.documents.*.delete")
          ) {
            fetchHabits();
          }
        }
      );

      fetchHabits();

      return () => {
        HabitsSubscription();
      };
    }
  }, [user]);

  const fetchHabits = async () => {
    try {
      const response = await databases.listDocuments(DATABASE_ID, HABIT_COLLECTION_ID, [
        Query.equal("user_id", user?.$id ?? ""),
      ]);
      setHabits(response.documents as Habit[]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRenderLeftActions = () => {
    return (
      <View style={styles.swipeActionLeft}>
        <MaterialCommunityIcons name="trash-can-outline" size={32} color={"#fff"} />
      </View>
    );
  };

  const handleRenderRightActions = () => {
    return (
      <View style={styles.swipeActionRight}>
        <MaterialCommunityIcons name="check-circle-outline" size={32} color={"#fff"} />
      </View>
    );
  };

  const handleDelete = async (habitId: string) => {
    try {
      await databases.deleteDocument(DATABASE_ID, HABIT_COLLECTION_ID, habitId);
      fetchHabits();
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  const handleComplete = async (habitId: string) => {
    try {
      await databases.updateDocument(DATABASE_ID, HABIT_COLLECTION_ID, habitId, {
        streak_count: habits?.find((h) => h.$id === habitId)?.streak_count + 1,
      });
      fetchHabits();
    } catch (error) {
      console.error('Error completing habit:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View>
        <Text style={styles.headline}>Today's Habits</Text>
      </View>
      <View style={styles.content}>
        {habits?.length === 0 ? (
          <View>
            <Text style={styles.habittext}>There's no habit, Create your first habit</Text>
          </View>
        ) : (
          habits?.map((habit, key) => (
            <Swipeable
              ref={(ref) => {
                swipableRefs.current[habit.$id] = ref;
              }}
              key={key}
              overshootLeft={false}
              overshootRight={false}
              renderLeftActions={handleRenderLeftActions}
              renderRightActions={handleRenderRightActions}
              onSwipeableLeftOpen={() => handleDelete(habit.$id)}
              onSwipeableRightOpen={() => handleComplete(habit.$id)}
            >
              <View style={styles.wrapper}>
                <Text style={{ fontSize: RFValue(20), color: "black", fontWeight: "500" }}>
                  {habit.title}
                </Text>
                <Text style={{ fontSize: RFValue(17), marginTop: hp(1), color: "gray" }}>
                  {habit.description}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: wp(1),
                    padding: wp(0.5),
                    backgroundColor: "#ffd4b2",
                    width: wp(30),
                    marginTop: hp(1),
                    borderRadius: wp(2),
                  }}
                >
                  <MaterialCommunityIcons name="fire" size={20} color={"#ff9800"} />
                  <Text style={{ fontSize: RFValue(12), marginTop: hp(1), color: "gray" }}>
                    {habit.streak_count} day streak
                  </Text>
                </View>
                <View>
                  <Text style={{ fontSize: RFValue(15), marginTop: hp(1), color: "#6b21a8" }}>
                    {habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}
                  </Text>
                </View>
              </View>
            </Swipeable>
          ))
        )}
      </View>
      <Button style={styles.button} onPress={signOut} mode="text" icon={"logout"}>
        Sign out
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(3),
  },
  headline: {
    fontSize: RFValue(25),
  },
  habittext: {
    fontSize: RFValue(15),
    marginTop: hp(2),
  },
  button: {
    backgroundColor: "#6b21a8",
    marginTop: hp(3),
    width: wp(40),
    marginBottom: hp(4),
  },
  content: {
    gap: wp(2),
  },
  wrapper: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: wp(3),
    padding: wp(3),
    backgroundColor: "#fae8ff",
    marginTop: hp(2),
  },
  swipeActionLeft: {
    backgroundColor: "#ff4444",
    justifyContent: "center",
    alignItems: "center",
    width: wp(20),
    height: "100%",
    marginTop: hp(2),
    borderRadius: hp(1)
  },
  swipeActionRight: {
    backgroundColor: "#00cc00",
    justifyContent: "center",
    alignItems: "center",
    width: wp(20),
    height: "100%",
    marginTop: hp(2),
    borderRadius: hp(1)
  },
});