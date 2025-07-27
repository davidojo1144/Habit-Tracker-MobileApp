import { useState } from "react";
import { 
    KeyboardAvoidingView, 
    Platform, 
    View,
    StyleSheet
} from "react-native";

import {Text, TextInput, Button, useTheme} from "react-native-paper"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";


export default function AuthScreen () {
    const [isSignUp, setIsSignUp] = useState<boolean>(false)
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [error, setError] = useState<string | null>("")

    const theme = useTheme()

    const handleAuth = async () => {
        if(!email || !password){
            setError("Please fill in all field")
            return
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.")
            return
        }

        setError(null)
    }


    const handleSwitchMode = () => {
        setIsSignUp((prev) => (!prev))
    }

    return (
        <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={styles.content}>
                <Text style={styles.title}>{ isSignUp ? "Create account" : "Welcome back"}</Text>

                <TextInput 
                label="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="Enter email"
                mode="outlined"
                onChangeText={setEmail}
                />

                <TextInput 
                label="Password"
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="Enter pasword"
                mode="outlined"
                onChangeText={setPassword}
                />

                { error && <Text style={{color: theme.colors.error, paddingTop : hp(2), fontSize: RFValue(12)}}>{error}</Text>}

                <Button onPress={handleAuth} style={styles.button} mode="contained">{ isSignUp ? "Sign Up" : "Sign In"}</Button>

                <Button style={styles.button2} mode="text" onPress={handleSwitchMode}>{isSignUp ? "Already have an account ? Sign In" : "Dont't have an account ? Sign up"}</Button>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5"
    },
    content: {
        flex: 1,
        padding: wp(5),
        justifyContent: "center"
    },
    title: {
        textAlign: "center",
        paddingBottom: hp(2),
        fontSize: RFValue(30)
    },
    button: {
        marginTop: hp(2),
        padding: wp(1.5)
    },
    button2: {
        marginTop: hp(1),
    },
})
