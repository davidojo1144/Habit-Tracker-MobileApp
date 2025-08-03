import { StyleSheet, View, Text, ScrollView, Animated, TouchableOpacity } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useTheme, Text as PaperText, SegmentedButtons } from "react-native-paper";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { DATABASE_ID, databases, HABIT_COLLECTION_ID } from "@/lib/appwrite";
import { Query } from "react-native-appwrite";
import { Habit } from "@/types/database.type";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function StreaksScreen() {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [filteredHabits, setFilteredHabits] = useState<Habit[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [error, setError] = useState<string>("");
  const theme = useTheme();
  const router = useRouter();
  const fadeAnims = useRef<Animated.Value[]>([]).current;
  const scaleAnims = useRef<{ [key: string]: Animated.Value }>({}).current;

  useEffect(() => {
    if (user) {
      fetchHabits();
    }
  }, [user]);

  useEffect(() => {
    // Filter habits based on selected filter
    if (filter === "all") {
      setFilteredHabits(habits);
    } else {
      setFilteredHabits(
        habits.filter((habit) => {
          const status = getStreakStatus(habit).status.toLowerCase();
          return filter === status || (filter === "not started" && status === "not started");
        })
      );
    }
  }, [habits, filter]);

  useEffect(() => {
    filteredHabits.forEach((habit, index) => {
      if (!fadeAnims[index]) {
        fadeAnims[index] = new Animated.Value(0);
      }
      if (!scaleAnims[habit.$id]) {
        scaleAnims[habit.$id] = new Animated.Value(1);
      }
      Animated.parallel([
        Animated.timing(fadeAnims[index], {
          toValue: 1,
          duration: 600,
          delay: index * 150,
          useNativeDriver: true,
        }),
        Animated.spring(fadeAnims[index], {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [filteredHabits]);

  const fetchHabits = async () => {
    try {
      const response = await databases.listDocuments(DATABASE_ID, HABIT_COLLECTION_ID, [
        Query.equal("user_id", user?.$id ?? ""),
        Query.orderDesc("streak_count"),
      ]);
      setHabits(response.documents as Habit[]);
      setError("");
    } catch (error) {
      console.error("Error fetching habits:", error);
      setError("Failed to load habits. Please try again.");
    }
  };

  const getStreakStatus = (habit: Habit) => {
    const lastCompleted = new Date(habit.last_completed);
    const today = new Date();
    const diffInDays = Math.floor((today.getTime() - lastCompleted.getTime()) / (1000 * 3600 * 24));

    if (habit.frequency === "daily" && diffInDays > 1) {
      return { status: "Broken", color: theme.colors.error || "#f44336" };
    } else if (habit.frequency === "weekly" && diffInDays > 7) {
      return { status: "Broken", color: theme.colors.error || "#f44336" };
    } else if (habit.frequency === "monthly" && diffInDays > 30) {
      return { status: "Broken", color: theme.colors.error || "#f44336" };
    } else if (habit.streak_count > 0) {
      return { status: "Active", color: theme.colors.success || "#4caf50" };
    } else {
      return { status: "Not Started", color: theme.colors.onSurface };
    }
  };

  const getProgress = (habit: Habit) => {
    // Calculate progress as a percentage (e.g., towards a 30-day goal for daily habits)
    const maxStreak = habit.frequency === "daily" ? 30 : habit.frequency === "weekly" ? 8 : 3;
    return Math.min((habit.streak_count / maxStreak) * 100, 100);
  };

  const handleCardPress = (habitId: string) => {
    // Scale animation on press
    Animated.sequence([
      Animated.timing(scaleAnims[habitId], {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnims[habitId], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    // Navigate to a habit detail screen (placeholder route)
    router.push(`/habit/${habitId}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Go back">
          <MaterialCommunityIcons name="arrow-left" size={RFValue(24)} color="purple" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: "purple" }]}>Your Streaks</Text>
      </View>

      <View style={styles.filterContainer}>
        <SegmentedButtons
          value={filter}
          onValueChange={setFilter}
          buttons={[
            { value: "all", label: "All" },
            { value: "active", label: "Active" },
            { value: "broken", label: "Broken" },
            { value: "not started", label: "Not Started" },
          ]}
          theme={{ roundness: 2 }}
          style={styles.filterButtons}
        />
      </View>

      {error ? (
        <PaperText style={[styles.errorText, { color: theme.colors.error }]}>
          {error}
        </PaperText>
      ) : null}

      <ScrollView contentContainerStyle={styles.content}>
        {filteredHabits.length === 0 ? (
          <View style={styles.noHabitsContainer}>
            <MaterialCommunityIcons name="emoticon-sad-outline" size={RFValue(48)} color="black" />
            <PaperText style={[styles.noHabitsText, { color: "gray" }]}>
              {filter === "all"
                ? "No habits found! Create a habit to start tracking streaks."
                : `No ${filter} habits found.`}
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
          filteredHabits.map((habit, index) => {
            const streakStatus = getStreakStatus(habit);
            const progress = getProgress(habit);
            return (
              <Animated.View
                key={habit.$id}
                style={[
                  styles.habitCardWrapper,
                  {
                    opacity: fadeAnims[index],
                    transform: [
                      { translateY: fadeAnims[index].interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) },
                      { scale: scaleAnims[habit.$id] || 1 },
                    ],
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={() => handleCardPress(habit.$id)}
                  activeOpacity={0.8}
                  accessibilityLabel={`View details for ${habit.title}`}
                >
                  <LinearGradient
                    colors={["#4b0082", "#6a0dad"]} // Purple gradient
                    style={[styles.habitCard, { borderColor: streakStatus.color }]}
                  >
                    <View style={styles.habitHeader}>
                      <Text style={[styles.habitTitle, { color: "#fff" }]}>{habit.title}</Text>
                      <MaterialCommunityIcons
                        name={habit.streak_count > 0 ? "fire" : "circle-outline"}
                        size={RFValue(20)}
                        color={habit.streak_count > 0 ? "#ff9800" : "#fff"}
                      />
                    </View>
                    <PaperText style={[styles.habitDescription, { color: "#e0e0e0" }]}>
                      {habit.description}
                    </PaperText>
                    <View style={styles.streakContainer}>
                      <MaterialCommunityIcons name="fire" size={RFValue(18)} color="#ff9800" />
                      <PaperText style={[styles.streakText, { color: "#fff" }]}>
                        {habit.streak_count} day streak
                      </PaperText>
                    </View>
                    <PaperText style={[styles.frequencyText, { color: "#e0e0e0" }]}>
                      {habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}
                    </PaperText>
                    <View style={styles.statusContainer}>
                      <PaperText style={[styles.statusText, { color: streakStatus.color }]}>
                        Status: {streakStatus.status}
                      </PaperText>
                    </View>
                    <View style={styles.progressContainer}>
                      <View style={[styles.progressRing, { borderColor: streakStatus.color }]}>
                        <PaperText style={styles.progressText}>{Math.round(progress)}%</PaperText>
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
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
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(2),
  },
  headerTitle: {
    fontSize: RFValue(26),
    fontWeight: "700",
    marginLeft: wp(3),
  },
  filterContainer: {
    marginBottom: hp(2),
  },
  filterButtons: {
    backgroundColor: "#fff",
    borderRadius: wp(2),
  },
  errorText: {
    fontSize: RFValue(14),
    textAlign: "center",
    marginBottom: hp(2),
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
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 6,
  },
  habitHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(1),
  },
  habitTitle: {
    fontSize: RFValue(22),
    fontWeight: "700",
  },
  habitDescription: {
    fontSize: RFValue(15),
    marginBottom: hp(1.5),
    opacity: 0.9,
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1.5),
    padding: wp(1.5),
    backgroundColor: "rgba(255, 152, 0, 0.1)",
    borderRadius: wp(2),
    marginBottom: hp(1),
  },
  streakText: {
    fontSize: RFValue(12),
    fontWeight: "600",
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
    fontWeight: "600",
  },
  progressContainer: {
    alignItems: "flex-end",
    marginTop: hp(1),
  },
  progressRing: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  progressText: {
    fontSize: RFValue(12),
    color: "#fff",
    fontWeight: "600",
  },
});