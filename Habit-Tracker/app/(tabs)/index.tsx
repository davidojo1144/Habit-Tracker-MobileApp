import { client, COMPLETIONS_ID, DATABASE_ID, databases, HABIT_COLLECTION_ID, RealTimeResponse } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { Habit, HabitCompletion } from "@/types/database.type";
import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View, Animated, TouchableOpacity } from "react-native";
import { ID, Query } from "react-native-appwrite";
import { Button, useTheme } from "react-native-paper";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";
import { useRouter } from "expo-router";

export default function Index() {
  const { signOut, user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completed, setCompleted] = useState<string[]>([]);

  const swipableRefs = useRef<{ [key: string]: Swipeable | null }>({});
  const theme = useTheme();
  const router = useRouter();

  
  const fadeAnims = useRef(habits?.map(() => new Animated.Value(0)) || []).current;

  useEffect(() => {
    if (user) {
      const habitChannel = `databases.${DATABASE_ID}.collections.${HABIT_COLLECTION_ID}.documents`;
      const HabitsSubscription = client.subscribe(
        habitChannel,
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


      const completedChannel = `databases.${DATABASE_ID}.collections.${COMPLETIONS_ID}.documents`;
      const completionSubscription = client.subscribe(
        completedChannel,
        (response: RealTimeResponse) => {
          if (
            response.events.includes("databases.*.collections.*.documents.*.create")
          ) {
            fetchHabits();
          }
        }

      fetchHabits(),
      fetchTodayCompletions()

      return () => {
        HabitsSubscription();
      };
    }
  }, [user]);


  

  useEffect(() => {
    fadeAnims.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    });
  }, [habits]);

  const fetchHabits = async () => {
    try {
      const response = await databases.listDocuments(DATABASE_ID, HABIT_COLLECTION_ID, [
        Query.equal("user_id", user?.$id ?? ""),
      ]);
      setHabits(response.documents as Habit[]);
      fadeAnims.length = 0;
      response.documents.forEach(() => fadeAnims.push(new Animated.Value(0)));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTodayCompletions = async () => {
    try {
      const today = new Date()
      today.setHours(0,0,0,0)
      const response = await databases.listDocuments(
        DATABASE_ID, 
        COMPLETIONS_ID, 
        [Query.equal("user_id", user?.$id ?? ""), Query.greaterThanEqual("completed_at", today.toISOString())]);

      const completions = response.documents as HabitCompletion[]
      setCompleted(completions.map((c) => c.habit_id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleRenderLeftActions = () => {
    return (
      <View style={[styles.swipeActionLeft, { backgroundColor: "red" }]}>
        <MaterialCommunityIcons name="trash-can-outline" size={RFValue(24)} color={"#fff"} />
        <Text style={styles.swipeActionText}>Delete</Text>
      </View>
    );
  };

  const handleRenderRightActions = () => {
    return (
      <View style={[styles.swipeActionRight, { backgroundColor: "green" }]}>
        <MaterialCommunityIcons name="check-circle-outline" size={RFValue(24)} color={"#fff"} />
        <Text style={styles.swipeActionText}>Complete</Text>
      </View>
    );
  };

  const handleDelete = async (habitId: string) => {
    try {
      await databases.deleteDocument(DATABASE_ID, HABIT_COLLECTION_ID, habitId);
      //fetchHabits();
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  const handleComplete = async (habitId: string) => {
    if (!user || completed?.includes(habitId)) return
    try {
      const currentDate = new Date().toISOString()
      await databases.createDocument(DATABASE_ID, 
        COMPLETIONS_ID, ID.unique(), 
        {
          habit_id: habitId,
          user_id: user?.$id,
          completed_at: currentDate
      });
      //fetchHabits();
      const habit = habits?.find((h) => h.$id === habitId)
      if(!habit) return

      await databases.updateDocument(DATABASE_ID, HABIT_COLLECTION_ID, habitId, {
        streak_count: habit.streak_count + 1,
        last_completed: currentDate
      })
    } catch (error) {
      console.error('Error completing habit:', error);
    }
  };

  return (
    <ScrollView style={[styles.container]}>
      <View style={styles.header}>
        <Text style={[styles.headline, { color: "purple" }]}>Today's Habits</Text>
        <TouchableOpacity
          onPress={() => router.push("/addhabit")}
          accessibilityLabel="Add new habit"
        >
          <MaterialCommunityIcons name="plus-circle" size={RFValue(28)} color="purple" />
        </TouchableOpacity>
      </View>

  
      <View style={styles.content}>
        {habits?.length === 0 ? (
          <View style={styles.noHabitsContainer}>
            <MaterialCommunityIcons name="emoticon-sad-outline" size={RFValue(48)} color="black" />
            <Text style={[styles.habittext, { color: "gray" }]}>
              No habits yet! Create your first habit.
            </Text>
            <Button
              mode="contained"
              onPress={() => router.push("/addhabit")}
              style={styles.createButton}
              labelStyle={{ fontSize: RFValue(14) }}
              accessibilityLabel="Create first habit"
            >
              Create Habit
            </Button>
          </View>
        ) : (
          habits?.map((habit, index) => (
            <Animated.View
              key={habit.$id}
              style={[
                styles.wrapper,
                {
                  opacity: fadeAnims[index],
                  transform: [{ translateY: fadeAnims[index].interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }],
                },
              ]}
            >
              <Swipeable
                ref={(ref) => {
                  swipableRefs.current[habit.$id] = ref;
                }}
                overshootLeft={false}
                overshootRight={false}
                renderLeftActions={handleRenderLeftActions}
                renderRightActions={handleRenderRightActions}
                onSwipeableLeftOpen={() => handleDelete(habit.$id)}
                onSwipeableRightOpen={() => handleComplete(habit.$id)}
              >
                <View style={[styles.habitCard, { backgroundColor: "gray" }]}>
                  <View style={styles.habitHeader}>
                    <Text style={[styles.habitTitle, { color: "white" }]}>
                      {habit.title}
                    </Text>
                    <MaterialCommunityIcons
                      name={habit.streak_count > 0 ? "check-circle" : "circle-outline"}
                      size={RFValue(20)}
                      color={habit.streak_count > 0 ? theme.colors.primary : theme.colors.onSurface}
                    />
                  </View>
                  <Text style={[styles.habitDescription, { color: "white"}]}>
                    {habit.description}
                  </Text>
                  <View style={styles.streakContainer}>
                    <MaterialCommunityIcons name="fire" size={RFValue(18)} color="#ff9800" />
                    <Text style={[styles.streakText, { color: "black" }]}>
                      {habit.streak_count} day streak
                    </Text>
                  </View>
                  <Text style={[styles.frequencyText, { color: "black" }]}>
                    {habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}
                  </Text>
                </View>
              </Swipeable>
            </Animated.View>
          ))
        )}
      </View>

      <Button
        style={[styles.button, { backgroundColor: "" }]}
        onPress={signOut}
        mode="contained"
        icon={"logout"}
        labelStyle={{ fontSize: RFValue(14) }}
        accessibilityLabel="Sign out"
      >
        Sign Out
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(4),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(3),
  },
  headline: {
    fontSize: RFValue(26),
    fontWeight: "700",
  },
  content: {
    gap: wp(3),
  },
  noHabitsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp(10),
  },
  habittext: {
    fontSize: RFValue(16),
    marginTop: hp(2),
    textAlign: "center",
  },
  createButton: {
    marginTop: hp(3),
    padding: wp(1.5),
    borderRadius: wp(2),
  },
  button: {
    marginTop: hp(3),
    marginBottom: hp(4),
    padding: wp(1.5),
    borderRadius: wp(2),
    alignSelf: "center",
    width: wp(40),
  },
  wrapper: {
    marginTop: hp(2),
  },
  habitCard: {
    borderRadius: wp(3),
    padding: wp(4),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  habitHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(1),
  },
  habitTitle: {
    fontSize: RFValue(20),
    fontWeight: "600",
  },
  habitDescription: {
    fontSize: RFValue(16),
    marginBottom: hp(1.5),
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1.5),
    padding: wp(1.5),
    backgroundColor: "#fff3e0",
    borderRadius: wp(2),
    marginBottom: hp(1),
  },
  streakText: {
    fontSize: RFValue(12),
  },
  frequencyText: {
    fontSize: RFValue(14),
    fontWeight: "500",
  },
  swipeActionLeft: {
    justifyContent: "center",
    alignItems: "center",
    width: wp(20),
    height: "100%",
    borderRadius: wp(3),
  },
  swipeActionRight: {
    justifyContent: "center",
    alignItems: "center",
    width: wp(20),
    height: "100%",
    borderRadius: wp(3),
  },
  swipeActionText: {
    color: "#fff",
    fontSize: RFValue(12),
    marginTop: hp(1),
    fontWeight: "500",
  },
});