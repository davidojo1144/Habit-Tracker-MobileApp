import { AuthProvider, useAuth } from "@/lib/auth-context";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const {user} = useAuth()
  const segments = useSegments()

  useEffect(() => {
    const timer = setTimeout(() => {
      const inAuthGroup = segments[0] === "auth"
      if (!user && !inAuthGroup) {
        router.replace("/auth");
      } else if (user && inAuthGroup) {
        
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [user, router]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RouteGuard>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ headerShown: true }} />
        </Stack>
      </RouteGuard>
    </AuthProvider>
  );
}