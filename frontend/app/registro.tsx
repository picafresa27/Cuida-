import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import { useState } from "react";
import API_URL from "../config/api";
// 1. Quitamos SafeAreaView de aquí
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// 2. Lo importamos de la librería especializada
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Registro() {
  // ... (Tus estados y funciones se mantienen exactamente igual)
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [genero, setGenero] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [verPassword, setVerPassword] = useState(true);

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

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      const año = selectedDate.getFullYear();
      const mes = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const dia = String(selectedDate.getDate()).padStart(2, '0');
      setFechaNacimiento(`${año}-${mes}-${dia}`);
    }
  };

  const crearUsuario = async () => {
    // ... (Toda tu lógica de validación y fetch se queda igual)
    if (!nombre || !apellidos || !correo || !password || !telefono || !fechaNacimiento || !genero) {
      Alert.alert("Error", "Completa todos los campos obligatorios");
      return;
    }

    const regexLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!regexLetras.test(nombre) || !regexLetras.test(apellidos)) {
      Alert.alert("Error", "Nombre o apellidos no válidos");
      return;
    }

    const regexCorreo = /^[^\s@]+@[^\s@]+\.com$/;
    if (!regexCorreo.test(correo.toLowerCase().trim())) {
      Alert.alert("Correo no válido", "Por favor, usa un correo válido");
      return;
    }

    const digitosTelefono = telefono.replace(/\D/g, "");
    if (digitosTelefono.length !== 10) {
      Alert.alert("Error", "El teléfono debe tener 10 dígitos");
      return;
    }

    if (password !== confirmar || password.length < 8) {
      Alert.alert("Error", "Revisa la contraseña (mínimo 8 caracteres y que coincidan)");
      return;
    }

    try {
      const URL_BACKEND = `${API_URL}/registro`;
      const res = await fetch(URL_BACKEND, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          apellidos,
          fechaNacimiento,
          telefono: telefono.replace(/\D/g, ""),
          correo: correo.trim(),
          genero: genero === "Hombre" ? "M" : "F",
          password,
        }),
      });

      if (res.ok) {
        Alert.alert("Éxito", "¡Paciente registrado!");
        router.replace({ pathname: "/", params: { nombre } });
      } else {
        const data = await res.json();
        Alert.alert("Error", data.error || "No se pudo guardar");
      }
    } catch (error) {
      Alert.alert("Error", "Error de conexión con el servidor");
    }
  };

  return (
    // 3. El contenedor principal con flex: 1
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.logo}>Cuida+</Text>
          <Text style={styles.title}>Crear cuenta</Text>
          <Text style={styles.subtitle}>
            Completa tus datos para acceder a citas y seguimiento médico.
          </Text>

          {/* --- Campos del formulario --- */}
          <Text style={styles.label}>Nombres</Text>
          <TextInput style={styles.input} placeholder="Ejem. Edgar" value={nombre} onChangeText={setNombre} />

          <Text style={styles.label}>Apellidos</Text>
          <TextInput style={styles.input} placeholder="Ejem. López" value={apellidos} onChangeText={setApellidos} />

          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput style={styles.input} placeholder="correo@email.com" keyboardType="email-address" value={correo} onChangeText={setCorreo} />

          <Text style={styles.label}>Teléfono</Text>
          <TextInput style={styles.input} placeholder="667 123 4567" value={telefono} onChangeText={manejarCambioTelefono} keyboardType="numeric" maxLength={12} />

          <Text style={styles.label}>Fecha de Nacimiento</Text>
          <TouchableOpacity onPress={() => setShowPicker(true)}>
            <View pointerEvents="none">
              <TextInput style={styles.input} placeholder="Selecciona tu fecha" value={fechaNacimiento} editable={false} />
            </View>
          </TouchableOpacity>

          {showPicker && (
            <DateTimePicker value={date} mode="date" display="default" onChange={onChange} maximumDate={new Date()} />
          )}

          <Text style={styles.label}>Género</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={genero} onValueChange={setGenero} style={styles.picker}>
              <Picker.Item label="Selecciona un género" value="" enabled={false} />
              <Picker.Item label="Hombre" value="Hombre" />
              <Picker.Item label="Mujer" value="Mujer" />
            </Picker>
          </View>

          {/* ... después del campo de Género */}

          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.inputPassword}
              secureTextEntry={verPassword}
              placeholder="********"
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setVerPassword(!verPassword)} style={styles.eyeIcon}>
              <Ionicons
                name={verPassword ? 'eye-off-outline' : 'eye-outline'}
                size={22}
                color="#3A5BA0"
              />
            </TouchableOpacity>
          </View>

          {/* AQUÍ VA EL CAMPO DE CONFIRMAR CONTRASEÑA */}
          <Text style={styles.label}>Confirmar Contraseña</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.inputPassword}
              secureTextEntry={verPassword}
              placeholder="********"
              value={confirmar}
              onChangeText={setConfirmar}
            />
            <TouchableOpacity onPress={() => setVerPassword(!verPassword)} style={styles.eyeIcon}>
              <Ionicons
                name={verPassword ? 'eye-off-outline' : 'eye-outline'}
                size={22}
                color="#3A5BA0"
              />
            </TouchableOpacity>
          </View>

          {/* El botón siempre queda al final */}
          <TouchableOpacity style={styles.button} onPress={crearUsuario}>
            <Text style={styles.buttonText}>Crear cuenta en Cuida+</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Asegúrate de que el contenedor tenga flex: 1 y el mismo fondo de tu app
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8"
  },
  content: {
    padding: 20,
    paddingBottom: 40 // Espacio extra al final para que el botón no quede pegado
  },
  logo: { fontSize: 18, fontWeight: "600", color: "#3A5BA0", marginBottom: 10 },
  title: { fontSize: 26, fontWeight: "bold" },
  subtitle: { color: "#6b7280", marginBottom: 20 },
  label: { marginTop: 10, marginBottom: 5, color: "#4a5568", fontWeight: "600" },
  input: { backgroundColor: "#fff", padding: 14, borderRadius: 10, borderWidth: 1, borderColor: "#cbd5e0" },
  pickerContainer: { backgroundColor: "#fff", borderRadius: 10, borderWidth: 1, borderColor: "#cbd5e0", overflow: "hidden" },
  picker: { height: 55, width: "100%" },
  button: { marginTop: 25, backgroundColor: "#3A5BA0", padding: 15, borderRadius: 12, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold" },
  // Dentro de styles = StyleSheet.create({ ... })

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#cbd5e0",
  },
  inputPassword: {
    flex: 1,
    padding: 14,
    // Ya no necesita borde aquí porque lo tiene el contenedor
  },
  eyeIcon: {
    paddingHorizontal: 15,
  },
});