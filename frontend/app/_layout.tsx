import { Stack } from 'expo-router';
import { UserProvider } from './context/userContext';

export default function RootLayout() {
  return (
    <UserProvider>
      <Stack screenOptions={{ headerShown: false }}>
        
        {/* Estas pantallas NO tendrán la barra inferior */}
        <Stack.Screen name="inicioSesion" />
        <Stack.Screen name="registro" />
        
        {/* Este grupo SÍ tendrá la barra inferior */}
        <Stack.Screen name="(tabs)" />

      </Stack>
    </UserProvider>
  );
}