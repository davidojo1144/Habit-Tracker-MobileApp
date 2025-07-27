import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";

function RouteGuard ({children}: {children : React.ReactNode}){

  const router = useRouter()
  const isAuth = false

  useEffect(() => {
    if(!isAuth){

    }
  })
}

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
    </Stack>
  )
}
