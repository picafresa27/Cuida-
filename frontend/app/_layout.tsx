import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Estas pantallas NO tendrán la barra inferior */}
      <Stack.Screen name="inicioSesion" />
      <Stack.Screen name="registro" />
      
      {/* Este grupo SÍ tendrá la barra inferior */}
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}