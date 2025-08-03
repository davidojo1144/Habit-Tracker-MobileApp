import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { Text, TextInput, Button, useTheme } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>('');

  const theme = useTheme();
  const router = useRouter();
  const { signIn, signUp } = useAuth();

  const handleAuth = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setError(null);

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
      router.replace('/');
    }
  };

  const handleSwitchMode = () => {
    setIsSignUp((prev) => !prev);
    setError(null); // Clear error when switching modes
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#e8e0ff', '#f5f5f5']}
        style={styles.container}
      >
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <Animatable.View animation="fadeInUp" duration={800} style={styles.content}>
            <Text style={[styles.title, { color: theme.colors.primary }]}>
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </Text>
            <Text style={styles.subtitle}>
              {isSignUp ? 'Join us to start tracking your habits!' : 'Sign in to continue your journey.'}
            </Text>

            <TextInput
              label="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="Enter your email"
              mode="outlined"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              left={<TextInput.Icon icon={() => <MaterialCommunityIcons name="email-outline" size={24} color={theme.colors.primary} />} />}
              theme={{ roundness: 12 }}
              accessible
              accessibilityLabel="Email input"
            />

            <TextInput
              label="Password"
              autoCapitalize="none"
              secureTextEntry
              placeholder="Enter your password"
              mode="outlined"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              left={<TextInput.Icon icon={() => <MaterialCommunityIcons name="lock-outline" size={24} color={theme.colors.primary} />} />}
              theme={{ roundness: 12 }}
              accessible
              accessibilityLabel="Password input"
            />

            {error && (
              <Animatable.Text
                animation="shake"
                duration={500}
                style={[styles.errorText, { color: theme.colors.error }]}
              >
                {error}
              </Animatable.Text>
            )}

            <Animatable.View animation="pulse" delay={200} style={styles.buttonContainer}>
              <LinearGradient
                colors={[theme.colors.primary, '#7c3aed']}
                style={styles.gradientButton}
              >
                <Button
                  mode="contained"
                  onPress={handleAuth}
                  style={styles.button}
                  labelStyle={styles.buttonLabel}
                  accessible
                  accessibilityLabel={isSignUp ? 'Sign Up button' : 'Sign In button'}
                >
                  {isSignUp ? 'Sign Up' : 'Sign In'}
                </Button>
              </LinearGradient>
            </Animatable.View>

            <Button
              mode="text"
              onPress={handleSwitchMode}
              style={styles.switchButton}
              labelStyle={styles.switchButtonLabel}
              accessible
              accessibilityLabel={isSignUp ? 'Switch to Sign In' : 'Switch to Sign Up'}
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </Button>
          </Animatable.View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: wp(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: RFValue(28),
    fontWeight: 'bold',
    paddingBottom: hp(1),
  },
  subtitle: {
    textAlign: 'center',
    fontSize: RFValue(16),
    color: '#666666',
    paddingBottom: hp(3),
  },
  input: {
    marginVertical: hp(1.5),
    width: wp(85),
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  errorText: {
    fontSize: RFValue(14),
    textAlign: 'center',
    paddingVertical: hp(1),
    backgroundColor: '#ffe6e6',
    borderRadius: 8,
    width: wp(85),
  },
  buttonContainer: {
    width: wp(85),
    marginVertical: hp(2),
  },
  gradientButton: {
    borderRadius: 12,
    padding: wp(0.5),
  },
  button: {
    paddingVertical: hp(1),
    borderRadius: 12,
  },
  buttonLabel: {
    fontSize: RFValue(16),
    fontWeight: '600',
  },
  switchButton: {
    marginTop: hp(1),
  },
  switchButtonLabel: {
    fontSize: RFValue(14),
    textDecorationLine: 'underline',
    color: '#6200ee',
  },
});