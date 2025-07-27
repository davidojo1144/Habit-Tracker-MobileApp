import { KeyboardAvoidingView, Platform, View } from "react-native";


export default function AuthScreen () {
    return (
        <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View>
                
            </View>
        </KeyboardAvoidingView>
    )
}