import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Registro() {
  // Estados
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState(""); // Nuevo: Azure pide Apellidos
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState(""); // Cambiado: Azure pide DATE
  const [genero, setGenero] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");

  // Formateador de teléfono (Mantiene tu lógica original)
  const manejarCambioTelefono = (texto: string) => {
    const soloNumeros = texto.replace(/\D/g, "");
    let formateado = "";
    if (soloNumeros.length > 0) {
      formateado = soloNumeros.slice(0, 3);
      if (soloNumeros.length > 3) formateado += " " + soloNumeros.slice(3, 6);
      if (soloNumeros.length > 6) formateado += " " + soloNumeros.slice(6, 10);
    }
    setTelefono(formateado);
  };

  // Función para crear usuario conectando al Backend
  const crearUsuario = async () => {
    // 1. Validaciones básicas
    if (!nombre || !apellidos || !correo || !password || !telefono || !fechaNacimiento || !genero) {
      Alert.alert("Error", "Completa todos los campos obligatorios");
      return;
    }

    if (password !== confirmar) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    try {
      /**
       * IMPORTANTE: 
       * Reemplaza '192.168.X.X' con la IP que obtuviste en el comando 'ipconfig'.
       */
      const URL_BACKEND = "https://effective-rotary-phone-q7455xw6q74xc6w5w-3000.app.github.dev/usuarios";
      
      const res = await fetch(URL_BACKEND, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: nombre,
          apellidos: apellidos,
          fechaNacimiento: fechaNacimiento, // Debe ser formato YYYY-MM-DD
          telefono: telefono,
          correo: correo,
          genero: genero === "Hombre" ? "M" : "F", // Azure espera un solo caracter (CHAR(1))
          password: password,
        }),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (res.ok) {
        Alert.alert("Éxito", "¡Paciente registrado en CuidaPlus!");
        router.replace({
          pathname: "/interfaces/inicioPaciente",
          params: { nombre: nombre },
        });

        // Limpiar campos
        setNombre("");
        setApellidos("");
        setCorreo("");
        setTelefono("");
        setFechaNacimiento("");
        setGenero("");
        setPassword("");
        setConfirmar("");
      } else {
        Alert.alert("Error de Registro", data.error || "No se pudo guardar el usuario");
      }
    } catch (error) {
      console.log("Error de conexión:", error);
      Alert.alert("Error", "No se pudo conectar al servidor. Verifica que el backend esté corriendo y la IP sea correcta.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.logo}>Cuida+</Text>
        <Text style={styles.title}>Crear cuenta</Text>
        <Text style={styles.subtitle}>
          Completa tus datos para acceder a citas y seguimiento médico.
        </Text>

        <Text style={styles.label}>Nombres</Text>
        <TextInput
          style={styles.input}
          placeholder="Ejem. Edgar"
          value={nombre}
          onChangeText={setNombre}
        />

        <Text style={styles.label}>Apellidos</Text>
        <TextInput
          style={styles.input}
          placeholder="Ejem. López"
          value={apellidos}
          onChangeText={setApellidos}
        />

        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="correo@email.com"
          keyboardType="email-address"
          value={correo}
          onChangeText={setCorreo}
        />

        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          style={styles.input}
          placeholder="667 123 4567"
          value={telefono}
          onChangeText={manejarCambioTelefono}
          keyboardType="numeric"
          maxLength={12}
        />

        <Text style={styles.label}>Fecha de Nacimiento (YYYY-MM-DD)</Text>
        <TextInput
          style={styles.input}
          placeholder="1995-05-20"
          value={fechaNacimiento}
          onChangeText={setFechaNacimiento}
        />

        <Text style={styles.label}>Género</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={genero}
            onValueChange={(itemValue) => setGenero(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Selecciona un género" value="" enabled={false} />
            <Picker.Item label="Hombre" value="Hombre" />
            <Picker.Item label="Mujer" value="Mujer" />
          </Picker>
        </View>

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="********"
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.label}>Confirmar Contraseña</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="********"
          value={confirmar}
          onChangeText={setConfirmar}
        />

        <TouchableOpacity style={styles.button} onPress={crearUsuario}>
          <Text style={styles.buttonText}>Crear cuenta en Cuida+</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6F8" },
  content: { padding: 20 },
  logo: { fontSize: 18, fontWeight: "600", color: "#3A5BA0", marginBottom: 10 },
  title: { fontSize: 26, fontWeight: "bold" },
  subtitle: { color: "#6b7280", marginBottom: 20 },
  label: { marginTop: 10, marginBottom: 5, color: "#4a5568", fontWeight: "600" },
  input: { backgroundColor: "#fff", padding: 14, borderRadius: 10, borderWidth: 1, borderColor: "#cbd5e0" },
  pickerContainer: { backgroundColor: "#fff", borderRadius: 10, borderWidth: 1, borderColor: "#cbd5e0", overflow: "hidden" },
  picker: { height: 55, width: "100%" },
  button: { marginTop: 25, backgroundColor: "#3A5BA0", padding: 15, borderRadius: 12, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold" },
});