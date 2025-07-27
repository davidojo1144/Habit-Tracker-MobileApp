import { useState } from "react";
import { 
    KeyboardAvoidingView, 
    Platform, 
    View 
} from "react-native";

import {Text, TextInput, Button} from "react-native-paper"


export default function AuthScreen () {
    const [isSignUp, setIsSignUp] = useState<boolean>(false)
    const handleSwitchMode = () => {
        setIsSignUp((prev) => (!prev))
    }

    return (
        <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View>
                <Text>{ isSignUp ? "Create account" : "Welcome back"}</Text>

                <TextInput 
                label="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="Enter email"
                mode="outlined"
                />

                <TextInput 
                label="Password"
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="Enter pasword"
                mode="outlined"
                />

                <Button mode="contained">{ isSignUp ? "Sign Up" : "Sign In"}</Button>

                <Button mode="text" onPress={handleSwitchMode}>{isSignUp ? "Already have an account ? Sign In" : "Dont't have an account ? Sign up"}</Button>
            </View>
        </KeyboardAvoidingView>
    )
}