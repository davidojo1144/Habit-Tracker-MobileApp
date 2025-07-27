import { Stack } from "expo-router";

function RouteGuard (){
  
}

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
    </Stack>
  )
}
