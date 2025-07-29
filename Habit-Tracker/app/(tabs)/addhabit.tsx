import { StyleSheet, Text, View } from "react-native"
import { RFValue } from "react-native-responsive-fontsize";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Button, SegmentedButtons, TextInput } from "react-native-paper"
import { useState } from "react";

const FREQUENCIES = ["daily", "weekly", "monthly"]

export default function AddHabitScreen(){
    const [title, setTitle] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [frequency, setFrequency] = useState<string>("")

    return (
        <View style={styles.container}>
            <TextInput style={styles.input} label="Title" mode="outlined"/>
            <TextInput style={styles.input} label="Description" mode="outlined"/>
            <View>
                <SegmentedButtons
                buttons={
                    FREQUENCIES.map((freq) => ({
                        value: freq,
                        label: freq.charAt(0).toUpperCase() + freq.slice(1)
                }))}
                />
            </View>
            <Button style={styles.button} mode="contained">Add Habits</Button>
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