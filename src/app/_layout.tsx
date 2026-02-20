import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useDailyReset } from '../hooks/useDailyReset'
import { useScreenTime } from '../hooks/useScreenTime'

export default function RootLayout() {
  useDailyReset()
  useScreenTime()

  return (
    <>
      <StatusBar style="light" />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  )
}
