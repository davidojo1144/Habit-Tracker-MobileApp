import { AuthProvider, useAuth } from "@/lib/auth-context";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const {user, isLoadingUser} = useAuth()
  const segments = useSegments()

  useEffect(() => {
    const timer = setTimeout(() => {
      const inAuthGroup = segments[0] === "auth"
      if (!user && !inAuthGroup && !isLoadingUser) {
        router.replace("/auth");
      } else if (user && inAuthGroup && !isLoadingUser) {
        router.replace("/")
      }
    }, 0);

  }, [user, segments]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <PaperProvider>
          <RouteGuard>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="auth" options={{ headerShown: true }} />
            </Stack>
          </RouteGuard>
        </PaperProvider>
      </SafeAreaProvider>
    </AuthProvider>
  );
}