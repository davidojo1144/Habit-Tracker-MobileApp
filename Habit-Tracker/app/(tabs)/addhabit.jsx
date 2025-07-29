import { Text, View } from "react-native"
import { SegmentedButtons, TextInput } from "react-native-paper"


export default function AddHabitScreen(){
    return (
        <View>
            <TextInput label="Title" mode="outlined"/>
            <TextInput label="Description" mode="outlined"/>
            <SegmentedButtons
            buttons={[
                {value: "daily", label: "daily"},
                {value: "daily", label: "daily"}
            ]}
            />
        </View>
    )
}