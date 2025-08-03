import { useState } from "react";
import { 
    KeyboardAvoidingView, 
    Platform, 
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
    Image
} from "react-native";
import { Text, TextInput, Button, useTheme } from "react-native-paper"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";

export default function AuthScreen () {
    const [isSignUp, setIsSignUp] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);

    const theme = useTheme();
    const { signIn, signUp } = useAuth();
    const router = useRouter();

    const handleAuth = async () => {
        if(!email || !password){
            setError("Please fill in all fields");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setError(null);
        setIsLoading(true);

        try {
            if (isSignUp) {
                const error = await signUp(email, password);
                if (error) {
                    setError(error);
                    return;
                }
            } else {
                const error = await signIn(email, password);
                if (error) {
                    setError(error);
                    return;
                }
                router.replace("/");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSwitchMode = () => {
        setIsSignUp((prev) => (!prev));
        setError(null);
    };

    const toggleSecureEntry = () => {
        setSecureTextEntry(!secureTextEntry);
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                style={[styles.container, {backgroundColor: "white"}]}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? hp(2) : 0}
            >
                <View style={styles.content}>
                    <Image 
                        //source={require('@/assets/images/auth-icon.png')} 
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    
                    <Text 
                        variant="headlineMedium" 
                        style={[
                            styles.title, 
                            {color: "purple", marginBottom: hp(2), fontSize: RFValue(30)}
                        ]}
                    >
                        {isSignUp ? "Create Account" : "Welcome Back"}
                    </Text>

                    <Text 
                        variant="bodyMedium" 
                        style={[styles.subtitle, {color: "gray"}]}
                    >
                        {isSignUp ? "Get started with your account" : "Sign in to continue"}
                    </Text>

                    <View style={styles.inputContainer}>
                        <TextInput 
                            label="Email"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            placeholder="Enter your email"
                            mode="outlined"
                            onChangeText={setEmail}
                            value={email}
                            left={<TextInput.Icon icon="email" />}
                            style={styles.input}
                            theme={{ roundness: 10 }}
                            error={!!error}
                        />

                        <TextInput 
                            label="Password"
                            autoCapitalize="none"
                            secureTextEntry={secureTextEntry}
                            placeholder="Enter your password"
                            mode="outlined"
                            onChangeText={setPassword}
                            value={password}
                            left={<TextInput.Icon icon="lock" />}
                            right={<TextInput.Icon icon={secureTextEntry ? "eye-off" : "eye"} onPress={toggleSecureEntry} />}
                            style={styles.input}
                            theme={{ roundness: 10 }}
                            error={!!error}
                        />

                        {error && (
                            <Text 
                                variant="bodySmall" 
                                style={[
                                    styles.errorText, 
                                    {color: "red", fontSize: RFValue(15)}
                                ]}
                            >
                                {error}
                            </Text>
                        )}
                    </View>

                    <Button 
                        onPress={handleAuth} 
                        style={styles.button} 
                        mode="contained"
                        loading={isLoading}
                        disabled={isLoading}
                        contentStyle={{height: hp(6)}}
                        labelStyle={{fontSize: RFValue(14)}}
                    >
                        {isSignUp ? "Sign Up" : "Sign In"}
                    </Button>

                    <View style={styles.footer}>
                        <Text 
                            variant="bodyMedium" 
                            style={{color: theme.colors.onSurfaceVariant}}
                        >
                            {isSignUp ? "Already have an account?" : "Don't have an account?"}
                        </Text>
                        <Button 
                            mode="text" 
                            onPress={handleSwitchMode}
                            compact
                            labelStyle={{fontSize: RFValue(12)}}
                        >
                            {isSignUp ? "Sign In" : "Sign Up"}
                        </Button>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: wp(8),
        justifyContent: "center",
    },
    logo: {
        width: wp(30),
        height: wp(30),
        alignSelf: 'center',
        marginBottom: hp(3),
    },
    title: {
        textAlign: "center",
        fontWeight: 'bold',
    },
    subtitle: {
        textAlign: "center",
        marginBottom: hp(4),
        fontSize: RFValue(14),
    },
    inputContainer: {
        marginBottom: hp(2),
    },
    input: {
        marginBottom: hp(2),
        backgroundColor: 'transparent',
    },
    errorText: {
        textAlign: 'center',
        marginTop: hp(1),
    },
    button: {
        marginTop: hp(2),
        borderRadius: 10,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: hp(3),
    },
});