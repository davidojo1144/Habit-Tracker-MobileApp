import { StyleSheet, View, Animated, TouchableOpacity } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Button, SegmentedButtons, TextInput, useTheme, Text } from "react-native-paper";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { DATABASE_ID, databases, HABIT_COLLECTION_ID } from "@/lib/appwrite";
import { ID } from "react-native-appwrite";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const FREQUENCIES = ["daily", "weekly", "monthly"];
type frequency = (typeof FREQUENCIES)[number];

export default function AddHabitScreen() {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [frequency, setFrequency] = useState<frequency>("daily");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useAuth();
  const router = useRouter();
  const theme = useTheme();

  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSubmit = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      await databases.createDocument(DATABASE_ID, HABIT_COLLECTION_ID, ID.unique(), {
        user_id: user.$id,
        title,
        description,
        frequency,
        streak_count: 0,
        last_completed: new Date().toISOString(),
        created_at: new Date().toISOString(),
      });
      router.back();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("There was an error creating the habit");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Go back">
          <MaterialCommunityIcons name="arrow-left" size={RFValue(24)} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle]}>Add New Habit</Text>
      </View>

      <Animated.View
        style={[
          styles.formContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <TextInput
          style={styles.input}
          label="Habit Title"
          mode="outlined"
          value={title}
          onChangeText={setTitle}
          left={<TextInput.Icon icon="pencil" />}
          placeholder="e.g., Drink Water"
          accessibilityLabel="Habit title input"
        />
        <TextInput
          style={styles.input}
          label="Description"
          mode="outlined"
          value={description}
          onChangeText={setDescription}
          left={<TextInput.Icon icon="text" />}
          placeholder="e.g., Drink 8 glasses of water daily"
          multiline
          numberOfLines={3}
          accessibilityLabel="Habit description input"
        />
        <View style={styles.frequencyContainer}>
          <Text style={[styles.label, { color: theme.colors.onBackground }]}>Frequency</Text>
          <SegmentedButtons
            value={frequency}
            onValueChange={(value) => setFrequency(value as frequency)}
            buttons={FREQUENCIES.map((freq) => ({
              value: freq,
              label: freq.charAt(0).toUpperCase() + freq.slice(1),
              style: { backgroundColor: frequency === freq ? theme.colors.primaryContainer : theme.colors.surface },
            }))}
            theme={{ roundness: 2 }}
          />
        </View>
        {error && (
          <Text
            style={[styles.errorText, { color: theme.colors.error }]}
            accessibilityLabel="Error message"
          >
            {error}
          </Text>
        )}
        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={() => router.back()}
            style={styles.cancelButton}
            labelStyle={{ color: theme.colors.onSurface }}
            accessibilityLabel="Cancel adding habit"
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleSubmit}
            disabled={!title || !description || isLoading}
            style={styles.submitButton}
            loading={isLoading}
            accessibilityLabel="Add habit button"
          >
            Add Habit
          </Button>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(4),
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
    color: "purple"
  },
  formContainer: {
    backgroundColor: "#ffffff",
    borderRadius: wp(3),
    padding: wp(4),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  input: {
    marginBottom: hp(2),
    backgroundColor: "#fff",
  },
  frequencyContainer: {
    marginBottom: hp(2),
  },
  label: {
    fontSize: RFValue(16),
    fontWeight: "600",
    marginBottom: hp(1),
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp(3),
  },
  submitButton: {
    flex: 1,
    marginLeft: wp(2),
    padding: wp(1.5),
    borderRadius: wp(2),
  },
  cancelButton: {
    flex: 1,
    marginRight: wp(2),
    padding: wp(1.5),
    borderRadius: wp(2),
  },
  errorText: {
    fontSize: RFValue(12),
    marginBottom: hp(2),
    textAlign: "center",
  },
});