import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";

function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuth = false;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAuth) {
        router.replace("/auth");
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [isAuth, router]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <RouteGuard>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: true }} />
      </Stack>
    </RouteGuard>
  );
}