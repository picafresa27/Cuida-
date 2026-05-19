import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import API_URL from "../../../../config/api";

export default function RegistroPaciente() {
  const router = useRouter();
  const [paso, setPaso] = useState(1);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false); // Estado para la lista desplegable de género
  const [date, setDate] = useState(new Date());

  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    correo: "",
    telefono: "",
    fechaNacimiento: "",
    genero: "", // Cambiado a vacío para mostrar placeholder correctamente
    contrasenaAuto: "",
    especialidad: "",
    doctor: "",
    hora: "10:00 AM",
  });

  const onChangeFecha = (event: any, selectedDate?: Date) => {
    if (event.type === "dismissed") {
      setShowCalendar(false);
      return;
    }

    const currentDate = selectedDate || date;
    setShowCalendar(Platform.OS === 'ios');
    setDate(currentDate);

    const dia = String(currentDate.getDate()).padStart(2, '0');
    const mes = String(currentDate.getMonth() + 1).padStart(2, '0');
    const anio = String(currentDate.getFullYear());

    const fechaFormateada = `${dia}/${mes}/${anio}`;
    const passwordGenerada = `${dia}${mes}${anio}`;

    setForm({
      ...form,
      fechaNacimiento: fechaFormateada,
      contrasenaAuto: passwordGenerada,
    });
  };

  const handleSiguiente = () => {
    if (!form.nombres || !form.apellidos || !form.fechaNacimiento || !form.genero) {
      Alert.alert("Campos obligatorios", "Por favor llenar todos los campos solicitados.");
      return;
    }

    if (!form.telefono) {
      Alert.alert("Contacto necesario", "Debes ingresar al menos el teléfono para el acceso.");
      return;
    }

    if (form.contrasenaAuto.length < 8) {
      Alert.alert("Fecha incompleta", "Por favor ingresa la fecha de nacimiento completa.");
      return;
    }

    setPaso(2);
  };

  const finalizarRegistro = async () => {
    if (!form.especialidad || !form.doctor) {
      Alert.alert("Cita incompleta", "Debes asignar una especialidad y un doctor.");
      return;
    }

    try {
      const responseRegistro = await fetch(`${API_URL}/registro`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: form.nombres,
          apellidos: form.apellidos,
          fechaNacimiento: date.toISOString().split('T')[0],
          genero: form.genero === "Hombre" ? "M" : (form.genero === "Mujer" ? "F" : "O"),
          telefono: form.telefono,
          correo: form.correo || `${form.nombres.toLowerCase().replace(/\s/g, '')}@cuidaplus.com`,
          password: form.contrasenaAuto,
        }),
      });

      const dataRegistro = await responseRegistro.json();

      if (!responseRegistro.ok) {
        Alert.alert("Error al registrar paciente", dataRegistro.error || "Verifica los datos.");
        return;
      }

      Alert.alert(
        "¡Guardado en Azure SQL! 🚀",
        `El paciente se registró con éxito en CuidaPlus.\n\n` +
        `ENTREGAR CREDENCIALES AL PACIENTE:\n` +
        `👤 Correo: ${dataRegistro.usuario.correo}\n` +
        `🔑 Contraseña: ${form.contrasenaAuto}\n\n` +
        `Nota: Falta vincular la cita porque necesitamos el ID del nuevo paciente.`,
        [
          {
            text: "Entendido",
            onPress: () => router.replace("./index")
          }
        ]
      );

    } catch (error) {
      console.error("Error de red en el frontend:", error);
      Alert.alert("Error de Conexión", "No se pudo establecer comunicación con el backend.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >

            <View style={styles.header}>
              <Text style={styles.title}>Nuevo Paciente</Text>
              <Text style={styles.stepText}>
                {paso === 1 ? "Paso 1: Datos de la Cuenta" : "Paso 2: Detalles de la Cita"}
              </Text>
            </View>

            {paso === 1 ? (
              <View style={styles.form}>
                <Text style={styles.label}>Nombre(s)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ejem. Edgar"
                  value={form.nombres}
                  onChangeText={(v) => setForm({ ...form, nombres: v })}
                />

                <Text style={styles.label}>Apellidos</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ejem. Lopez"
                  value={form.apellidos}
                  onChangeText={(v) => setForm({ ...form, apellidos: v })}
                />

                <Text style={styles.label}>Correo Electrónico (Opcional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="correo@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={form.correo}
                  onChangeText={(v) => setForm({ ...form, correo: v })}
                />

                <Text style={styles.label}>Teléfono</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej. 6621234567"
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={form.telefono}
                  onChangeText={(v) => setForm({ ...form, telefono: v })}
                />

                <Text style={styles.label}>Fecha de Nacimiento</Text>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => setShowCalendar(true)}
                >
                  <Text style={form.fechaNacimiento === "" ? styles.dropdownPlaceholder : styles.dropdownText}>
                    {form.fechaNacimiento === "" ? "Seleccionar fecha" : form.fechaNacimiento}
                  </Text>
                </TouchableOpacity>

                {showCalendar && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    maximumDate={new Date()}
                    onChange={onChangeFecha}
                  />
                )}

                <Text style={styles.label}>Contraseña asignada</Text>
                <TextInput
                  style={[styles.input, styles.inputDeshabilitado]}
                  placeholder="Se generará sola"
                  value={form.contrasenaAuto}
                  editable={false}
                />

                {/* MENÚ DESPLEGABLE DE GÉNERO */}
                <Text style={styles.label}>Género</Text>
                <View style={styles.pickerContainer}>
                  <TouchableOpacity
                    style={styles.dropdownHeader}
                    onPress={() => setShowDropdown(!showDropdown)}
                  >
                    <Text style={form.genero ? styles.dropdownText : styles.dropdownPlaceholder}>
                      {form.genero || "Seleccionar género"}
                    </Text>
                    <Ionicons name={showDropdown ? "chevron-up" : "chevron-down"} size={20} color="#a0aec0" />
                  </TouchableOpacity>

                  {showDropdown && (
                    <View style={styles.dropdownList}>
                      <TouchableOpacity
                        style={styles.dropdownItem}
                        onPress={() => { setForm({ ...form, genero: "Hombre" }); setShowDropdown(false); }}
                      >
                        <Text style={styles.dropdownText}>Hombre</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.dropdownItem}
                        onPress={() => { setForm({ ...form, genero: "Mujer" }); setShowDropdown(false); }}
                      >
                        <Text style={styles.dropdownText}>Mujer</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                <TouchableOpacity style={styles.btnPrimario} onPress={handleSiguiente}>
                  <Text style={styles.btnText}>Continuar a la Cita →</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.form}>
                <Text style={styles.label}>Especialidad</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ejem. Odontología"
                  value={form.especialidad}
                  onChangeText={(v) => setForm({ ...form, especialidad: v })}
                />

                <Text style={styles.label}>Doctor Asignado</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ejem. Dr. Armando Casas"
                  value={form.doctor}
                  onChangeText={(v) => setForm({ ...form, doctor: v })}
                />

                <View style={styles.infoCita}>
                  <Text style={styles.infoCitaText}>📅 Fecha de la Cita: Hoy</Text>
                  <Text style={styles.infoCitaText}>⏰ Hora Asignada: {form.hora}</Text>
                </View>

                <TouchableOpacity style={styles.btnPrimario} onPress={finalizarRegistro}>
                  <Text style={styles.btnText}>Confirmar Registro y Cita</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setPaso(1)}>
                  <Text style={styles.btnRegresar}>← Regresar a datos personales</Text>
                </TouchableOpacity>
              </View>
            )}

          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  scrollContainer: { padding: 30 },
  header: { alignItems: "center", marginBottom: 25 },
  title: { fontSize: 26, fontWeight: "bold", color: "#1A202C", marginBottom: 5 },
  stepText: { fontSize: 14, color: "#345195", fontWeight: "bold" },
  form: { width: "100%" },
  label: { fontSize: 14, fontWeight: "bold", color: "#4A5568", marginBottom: 8 },
  input: {
    backgroundColor: "#F7FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 18,
    color: "#2D3748"
  },
  inputDeshabilitado: {
    backgroundColor: "#EDF2F7",
    color: "#4A5568",
    fontWeight: "bold",
  },
  dropdown: {
    backgroundColor: "#F7FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  dropdownPlaceholder: { color: "#A0AEC0", fontSize: 16 },
  dropdownText: { color: "#2D3748", fontSize: 16, fontWeight: "500" },

  // Estilos de la lista de género
  pickerContainer: {
    backgroundColor: "#F7FAFC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 25,
    overflow: "hidden"
  },
  dropdownHeader: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  dropdownList: {
    borderTopWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF"
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#E2E8F0"
  },

  btnPrimario: {
    backgroundColor: "#345195",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    elevation: 2,
  },
  btnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
  btnRegresar: { textAlign: "center", marginTop: 20, color: "#718096", textDecorationLine: "underline" },
  infoCita: {
    backgroundColor: "#E6FFFA",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#B2F5EA",
  },
  infoCitaText: { color: "#2C7A7B", fontWeight: "bold", marginBottom: 5 },
});