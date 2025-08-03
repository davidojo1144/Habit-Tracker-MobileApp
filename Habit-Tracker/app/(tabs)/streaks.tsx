import { StyleSheet, View, Text, ScrollView, Animated, TouchableOpacity } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useTheme, Text as PaperText } from "react-native-paper";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { DATABASE_ID, databases, HABIT_COLLECTION_ID } from "@/lib/appwrite";
import { Query } from "react-native-appwrite";
import { Habit } from "@/types/database.type";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function StreaksScreen() {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const theme = useTheme();
  const router = useRouter();
  const fadeAnims = useRef<Animated.Value[]>([]).current;

  useEffect(() => {
    if (user) {
      fetchHabits();
    }
  }, [user]);

  useEffect(() => {
    habits.forEach((_, index) => {
      if (!fadeAnims[index]) {
        fadeAnims[index] = new Animated.Value(0);
      }
      Animated.timing(fadeAnims[index], {
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
        Query.orderDesc("streak_count"),
      ]);
      setHabits(response.documents as Habit[]);
      fadeAnims.length = 0;
      response.documents.forEach(() => fadeAnims.push(new Animated.Value(0)));
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  };

  const getStreakStatus = (habit: Habit) => {
    const lastCompleted = new Date(habit.last_completed);
    const today = new Date();
    const diffInDays = Math.floor((today.getTime() - lastCompleted.getTime()) / (1000 * 3600 * 24));

    if (habit.frequency === "daily" && diffInDays > 1) {
      return { status: "Broken", color: theme.colors.error };
    } else if (habit.frequency === "weekly" && diffInDays > 7) {
      return { status: "Broken", color: theme.colors.error };
    } else if (habit.frequency === "monthly" && diffInDays > 30) {
      return { status: "Broken", color: theme.colors.error };
    } else if (habit.streak_count > 0) {
      return { status: "Active", color: theme.colors.success || "#4caf50" };
    } else {
      return { status: "Not Started", color: theme.colors.onSurface };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Go back">
          <MaterialCommunityIcons name="arrow-left" size={RFValue(24)} color="purple" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: "purple" }]}>Your Streaks</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {habits.length === 0 ? (
          <View style={styles.noHabitsContainer}>
            <MaterialCommunityIcons name="emoticon-sad-outline" size={RFValue(48)} color="black" />
            <PaperText style={[styles.noHabitsText, { color: "gray" }]}>
              No habits found! Create a habit to start tracking streaks.
            </PaperText>
            <TouchableOpacity
              onPress={() => router.push("/addhabit")}
              style={styles.createButton}
              accessibilityLabel="Create new habit"
            >
              <PaperText style={styles.createButtonText}>Create Habit</PaperText>
            </TouchableOpacity>
          </View>
        ) : (
          habits.map((habit, index) => {
            const streakStatus = getStreakStatus(habit);
            return (
              <Animated.View
                key={habit.$id}
                style={[
                  styles.habitCardWrapper,
                  {
                    opacity: fadeAnims[index],
                    transform: [
                      { translateY: fadeAnims[index].interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) },
                    ],
                  },
                ]}
              >
                <View style={[styles.habitCard, { backgroundColor: "gray" }]}>
                  <View style={styles.habitHeader}>
                    <Text style={[styles.habitTitle, { color: "white" }]}>{habit.title}</Text>
                    <MaterialCommunityIcons
                      name={habit.streak_count > 0 ? "fire" : "circle-outline"}
                      size={RFValue(20)}
                      color={habit.streak_count > 0 ? "#ff9800" : theme.colors.onSurface}
                    />
                  </View>
                  <PaperText style={[styles.habitDescription, { color: "white" }]}>
                    {habit.description}
                  </PaperText>
                  <View style={styles.streakContainer}>
                    <MaterialCommunityIcons name="fire" size={RFValue(18)} color="#ff9800" />
                    <PaperText style={[styles.streakText, { color: "black" }]}>
                      {habit.streak_count} day streak
                    </PaperText>
                  </View>
                  <PaperText style={[styles.frequencyText, { color: "black" }]}>
                    {habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}
                  </PaperText>
                  <View style={styles.statusContainer}>
                    <PaperText style={[styles.statusText, { color: streakStatus.color }]}>
                      Status: {streakStatus.status}
                    </PaperText>
                  </View>
                </View>
              </Animated.View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(4),
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(3),
  },
  headerTitle: {
    fontSize: RFValue(24),
    fontWeight: "bold",
    marginLeft: wp(3),
  },
  content: {
    paddingBottom: hp(4),
    gap: wp(3),
  },
  noHabitsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp(10),
  },
  noHabitsText: {
    fontSize: RFValue(16),
    marginTop: hp(2),
    textAlign: "center",
  },
  createButton: {
    marginTop: hp(3),
    padding: wp(3),
    backgroundColor: "purple",
    borderRadius: wp(2),
    alignItems: "center",
  },
  createButtonText: {
    fontSize: RFValue(14),
    color: "#fff",
    fontWeight: "600",
  },
  habitCardWrapper: {
    marginBottom: hp(2),
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
  statusContainer: {
    marginTop: hp(1),
    alignItems: "flex-start",
  },
  statusText: {
    fontSize: RFValue(14),
    fontWeight: "500",
  },
});