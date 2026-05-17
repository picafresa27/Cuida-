import { Stack, useRouter, useSegments } from 'expo-router';
import { useContext, useEffect } from 'react';
import { StyleSheet } from 'react-native';
// 1. Importamos SafeAreaView además de SafeAreaProvider
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { UserContext, UserProvider } from '../context/userContext';

function AuthGuard() {
  const { usuario } = useContext(UserContext);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const estaEnRutaProtegida = segments[0] === "(tabs)";
    if (!usuario && estaEnRutaProtegida) {
      router.replace("/inicioSesion");
    }
  }, [usuario, segments]);

  return (
    // 3. Este SafeAreaView global añade de forma automática los márgenes
    // inferiores y superiores requeridos por CUALQUIER dispositivo (iOS o Android).
    <SafeAreaView style={styles.safeArea}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="inicioSesion" />
        <Stack.Screen name="registro" />
        <Stack.Screen name="recuperarContra" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SafeAreaView>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <AuthGuard />
      </UserProvider>
    </SafeAreaProvider>
  );
}

// 2. Definimos el estilo para que ocupe todo el espacio de la pantalla
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Usa el color de fondo base de tu app
  },
});