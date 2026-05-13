import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { UserProvider } from '../context/userContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="registro" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </UserProvider>
    </SafeAreaProvider>
  );
}