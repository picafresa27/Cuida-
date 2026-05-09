import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image, // <-- Importamos Image
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const router = useRouter();

  // Estados para guardar lo que el usuario escribe
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    try {
      // Hacemos petición POST a la nueva ruta /login
      const res = await fetch(
        "https://reimagined-disco-g4rvwgw9jprrfqvx-3000.app.github.dev/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            correo: email.trim(),
            password: password.trim(),
          }),
        }
      );
      
      const data = await res.json();

      if (res.ok) {
        console.log("Login exitoso:", data.usuario);
        
        // SI EXISTE → entra y manda el nombre a la siguiente pantalla
        router.replace({
          pathname: "/(tabs)",
          params: { nombre: data.usuario.nombres }, 
        });
      } else {
        Alert.alert("Error", data.error || "Usuario o contraseña incorrectos");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "No se pudo conectar al servidor de Cuida+");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          {/* LOGO RESTAURADO */}
          <Image
            source={require("./img/logo_cuida+.jpg")} // <-- Ruta para cuando img está dentro de app
            style={styles.logo}
            resizeMode="contain"
          />

          {/* Encabezado */}
          <Text style={styles.titulo}>Iniciar sesión</Text>
          <Text style={styles.subtitulo}>
            Accede a tu cuenta para gestionar citas, consultas y seguimiento médico.
          </Text>

          {/* Formulario */}
          <View style={styles.form}>
            {/* Input Correo */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Correo electrónico</Text>
              <TextInput
                style={styles.input}
                placeholder="correo@gmail.com"
                placeholderTextColor="#A0AEC0"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Input Contraseña */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contraseña</Text>
              <TextInput
                style={styles.input}
                placeholder=".........."
                placeholderTextColor="#A0AEC0"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
              />
            </View>

            {/* Botones */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.botonPrimario}
                onPress={handleLogin}
              >
                <Text style={styles.textoBlanco}>Entrar</Text>
              </TouchableOpacity>

              {/*@ts-ignore*/}
              <Link href="/registro" asChild>
                <TouchableOpacity style={styles.botonSecundario}>
                  <Text style={styles.textoAzul}>Crear cuenta</Text>
                </TouchableOpacity>
              </Link>
            </View>

            {/* Link de Olvidé contraseña */}
            <TouchableOpacity style={styles.forgotPass}>
              <Text style={styles.textoForgot}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  logo: { // <-- Agregamos el estilo del logo
    width: 180,
    height: 180,
    marginBottom: 10,
  },
  titulo: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1A202C",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 14,
    color: "#718096",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 35,
    paddingHorizontal: 10,
  },
  form: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4a5568",
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#2D3748",
  },
  buttonContainer: {
    marginTop: 10,
    gap: 15,
  },
  botonPrimario: {
    backgroundColor: "#345195",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
  },
  botonSecundario: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  textoBlanco: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  textoAzul: {
    color: "#2D3748",
    fontSize: 18,
    fontWeight: "700",
  },
  forgotPass: {
    marginTop: 30,
    alignItems: "center",
  },
  textoForgot: {
    color: "#41A69A",
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});