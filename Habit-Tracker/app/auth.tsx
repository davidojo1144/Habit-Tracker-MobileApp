import { useState } from "react";
import { 
    KeyboardAvoidingView, 
    Platform, 
    View 
} from "react-native";

import {Text, TextInput, Button} from "react-native-paper"


export default function AuthScreen () {
    const [isSignUp, setIsSignUp] = useState<boolean>(false)

    return (
        <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View>
                <Text>Create account</Text>

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

                <Button mode="contained">Sign Up</Button>

                <Button mode="text">Already have an account ? Sign In</Button>
            </View>
        </KeyboardAvoidingView>
    )
}