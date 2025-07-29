import { StyleSheet, Text, View } from "react-native"
import { RFValue } from "react-native-responsive-fontsize";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Button, SegmentedButtons, TextInput } from "react-native-paper"
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { DATABASE_ID, databases, HABIT_COLLECTION_ID } from "@/lib/appwrite";
import { ID } from "react-native-appwrite";

const FREQUENCIES = ["daily", "weekly", "monthly"]
type frequency = (typeof FREQUENCIES)[number]

export default function AddHabitScreen(){
    const [title, setTitle] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [frequency, setFrequency] = useState<frequency>("daily")
    const {user} = useAuth()

    const handleSubmit = async () => {
        if (!user) return

        await databases.createDocument(
            DATABASE_ID,
            HABIT_COLLECTION_ID,
            ID.unique(),
            {
                user_id: user.$id,
                title,
                description,
                frequency,
                steak_count: 0,
                last_completed: new Date().toISOString(),
                created_at: new Date().toISOString(),
            }
        )
    }

    return (
        <View style={styles.container}>
            <TextInput 
            style={styles.input} 
            label="Title" 
            mode="outlined"
            onChangeText={setTitle}
            />
            <TextInput 
            style={styles.input} 
            label="Description" 
            mode="outlined"
            onChangeText={setDescription}
            />
            <View>
                <SegmentedButtons
                value={frequency}
                onValueChange={(value) => setFrequency(value as frequency)}
                buttons={
                    FREQUENCIES.map((freq) => ({
                        value: freq,
                        label: freq.charAt(0).toUpperCase() + freq.slice(1)
                }))}
                />
            </View>
            <Button onPress={handleSubmit} disabled={!title || !description} style={styles.button} mode="contained">Add Habits</Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: wp(3),
        backgroundColor: "#f5f5f5"
    },
    input: {
        backgroundColor: "white",
        marginBottom: hp(1)
    },
    button:{
        marginTop: hp(3),
        color: "#fff",
        padding: wp(1.5)
    }
})