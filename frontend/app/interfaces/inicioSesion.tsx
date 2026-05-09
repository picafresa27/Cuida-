import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();

  // Estados para guardar lo que el usuario escribe
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /*const handleLogin = async () => {
    // Navega a la interfaz de inicio de paciente
    // Asegúrate de que el archivo se llame homePaciente.tsx o ajusta el nombre aquí
    if (!email || !password) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    try {
      const res = await fetch(
        "https://special-xylophone-695xxpjwwp45hrw74-3000.app.github.dev/login"
      );
      
      const usuarios = await res.json();

     // Buscar usuario a prueba de balas
      const usuario = usuarios.find((u: any) => {
        if (!u.correo || !u.password) return false;

        // .trim() elimina espacios accidentales al inicio y al final
        return (
          u.correo.trim().toLowerCase() === email.trim().toLowerCase() &&
          u.password.trim() === password.trim()
        );
      });

      console.log("1. Yo escribí -> Correo:", email, "| Pass:", password);
      console.log("2. SQL me mandó (Primer usuario) ->", usuarios[0]);

      if (!usuario) {
        Alert.alert("Error", "Usuario o contraseña incorrectos");
        return;
      }

      // SI EXISTE → entra y manda el nombre
      router.replace({
        pathname: "/interfaces/inicioPaciente",
        params: { nombre: usuario.nombre },
      });
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "No se pudo conectar al servidor");
    }
  };*/

  const handleLogin = async () => {
  if (!email || !password) {
    Alert.alert("Error", "Completa todos los campos");
    return;
  }

  try {
    const res = await fetch(
  "https://reimagined-disco-g4rvwgw9jprrfqvx-3000.app.github.dev/inicioSesion",
  {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      correo: email,
      password: password,
    }),
  }
);
    const text = await res.text();
    const data = text ? JSON.parse(text) : {};

    if (!res.ok) {
      Alert.alert("Error", data.error || "No se pudo iniciar sesión");
      return;
    }

    Alert.alert("Éxito", "Inicio de sesión exitoso");

    router.replace({
      pathname: "/interfaces/inicioPaciente",
      params: {
        nombre: data.usuario.nombres,
      },
    });

  } catch (error) {
    console.log("Error login:", error);

    Alert.alert(
      "Error",
      "No se pudo conectar al servidor"
    );
  }
};

  return (
    <SafeAreaView style={styles.container}>
      {/* KeyboardAvoidingView evita que el teclado tape los inputs al escribir */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Logo */}
          <Image
            source={require("../img/logo_cuida+.jpg")}
            style={styles.logo}
            resizeMode="contain"
          />

          {/* Encabezado */}
          <Text style={styles.titulo}>Iniciar sesión</Text>
          <Text style={styles.subtitulo}>
            Accede a tu cuenta para gestionar citas, consultas y seguimiento
            médico.
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
                secureTextEntry={true} // Oculta el texto con bolitas
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

              {/* Enlace a la otra pantalla si ya tienes el archivo registro.tsx */}
              {/*@ts-ignore*/}
              <Link href="/interfaces/registro" asChild>
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
    backgroundColor: "#FFFFFF", // Blanco puro
  },
  scrollContent: {
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  logo: {
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
    color: "#2D3748"
  },
  buttonContainer: {
    marginTop: 10,
    gap: 15,
  },
  botonPrimario: {
    backgroundColor: "#345195", // Azul Cuida+
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
    color: "#41A69A", // El verde turquesa dellogo para el link
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
