import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import API_URL from "../../../config/api";

export default function AgendarCitaVista() {
  // Estados mínimos requeridos para poder escribir en los campos de la vista
  const [idPaciente, setIdPaciente] = useState("");
  //para que los campos se llenen
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [genero, setGenero] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");

  const [busquedaEspecialidad, setBusquedaEspecialidad] = useState("");
  const [especialidades, setEspecialidades] = useState<any[]>([]);
  const [showEspecialidades, setShowEspecialidades] = useState(false);

  const [doctores, setDoctores] = useState<any[]>([]);
  const [doctorSeleccionado, setDoctorSeleccionado] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [fechaCita, setFechaCita] = useState("");

  const [horariosDisponibles, setHorariosDisponibles] = useState<string[]>([]);
  const [horaSeleccionada, setHoraSeleccionada] = useState("");
  const [consultorio, setConsultorio] = useState<string>("");
  const [doctorId, setDoctorId] = useState<number | null>(null);

  // Estados para controlar qué menús desplegables están abiertos visualmente
  const [showDocDropdown, setShowDocDropdown] = useState(false);
  const [showHoraDropdown, setShowHoraDropdown] = useState(false);

  // Manejador básico para el calendario nativo
  const onFechaChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const año = selectedDate.getFullYear();
      const mes = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const dia = String(selectedDate.getDate()).padStart(2, '0');
      const fechaSeleccionada = `${año}-${mes}-${dia}`;
      setFechaCita(fechaSeleccionada);

      if (doctorId) {
        cargarHorarios(doctorId, fechaSeleccionada);
      }
    }
  };

  //para rellenar campos
    const buscarPaciente = async (id: string) => {
    if (!id) return;

    try {

      const response = await fetch(`${API_URL}/paciente/${id}`);

      const data = await response.json();

      if (response.ok) {

        setNombreCompleto(
          `${data.Nombres} ${data.Apellidos}`
        );

        setGenero(data.Genero || "");

        const fecha = data.FechaNacimiento?.split("T")[0];

        setFechaNacimiento(fecha || "");

        setTelefono(data.Telefono || "");

        setCorreo(data.Correo || "");

      } else {

        setNombreCompleto("");
        setGenero("");
        setFechaNacimiento("");
        setTelefono("");
        setCorreo("");

        alert(data.error);

      }

    } catch (error) {

      console.log(error);

      alert("Error conectando con el servidor");

    }
  };

  const buscarEspecialidades = async (texto: string) => {
    setBusquedaEspecialidad(texto);

    if (texto.length === 0) {

      setEspecialidades([]);
      setShowEspecialidades(false);

      return;
    }

    try {

      const response = await fetch(
        `${API_URL}/especialidades?texto=${texto}`
      );

      const data = await response.json();

      setEspecialidades(data);

      setShowEspecialidades(true);

    } catch (error) {

      console.log(error);

    }
  };

  const cargarDoctores = async (especialidad: string) => {
    try {

      const response = await fetch(
        `${API_URL}/doctores/${especialidad}`
      );

      const data = await response.json();

      setDoctores(data);

    } catch (error) {

      console.log(error);

    }
  };

  const cargarHorarios = async (
    idDoctor: number,
    fecha: string
  ) => {

    try {

      const response = await fetch(
        `${API_URL}/horarios-disponibles/${idDoctor}/${fecha}`
      );

      const data = await response.json();

      if (Array.isArray(data)) {
        setHorariosDisponibles(data);
      } else {
        setHorariosDisponibles([]);
      }

    } catch (error) {

      console.log(error);

    }
  };

  const cargarConsultorio = async (
    idDoctor: number
  ) => {

    try {

      const response = await fetch(
        `${API_URL}/consultorio/${idDoctor}`
      );

      const data = await response.json();

      setConsultorio(
      data.NumeroConsultorio?.toString() || ""
);

    } catch (error) {

      console.log(error);

    }
  };

  const guardarCita = async () => {

  if (
    !idPaciente ||
    !doctorId ||
    !fechaCita ||
    !horaSeleccionada
  ) {
    alert("Completa todos los campos");
    return;
  }

  try {

    const response = await fetch(
      `${API_URL}/agendar-cita`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          idPaciente,
          doctorId,
          fecha: fechaCita,
          hora: horaSeleccionada
        })
      }
    );

    const data = await response.json();

    if (response.ok) {

      alert(
`Cita agendada correctamente

Paciente: ${nombreCompleto}
Doctor: ${doctorSeleccionado}
Fecha: ${fechaCita}
Hora: ${horaSeleccionada}
Consultorio: ${consultorio}`
      );

      // RECARGAR HORARIOS
      cargarHorarios(doctorId, fechaCita);

    } else {

      alert(data.error);

    }

  } catch (error) {

    console.log(error);

    alert("Error guardando la cita");

  }

};


  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          
          <Text style={styles.logo}>Cuida+</Text>
          <Text style={styles.title}>Agendar Nueva Cita</Text>
          <Text style={styles.subtitle}>Formulario de asignación de citas médicas por medio de recepción</Text>

          {/* ================= SECCIÓN 1: DATOS PERSONALES DEL PACIENTE ================= */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>1. Información del Paciente</Text>
            
            <Text style={styles.label}>ID Paciente</Text>
            <TextInput 
              style={[styles.input, styles.idInput]} 
              placeholder="Ingrese el ID del paciente" 
              keyboardType="numeric"
              value={idPaciente}
              onChangeText={setIdPaciente}
              onBlur={() => buscarPaciente(idPaciente)}
            />

            <Text style={styles.label}>Nombre Completo</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={nombreCompleto}
              placeholder="Se rellenará automáticamente"
              editable={false}
            />

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.label}>Género</Text>
                <TextInput
                  style={[styles.input, styles.disabledInput]}
                  value={genero}
                  placeholder="Automático"
                  editable={false}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>F. Nacimiento</Text>
                <TextInput
                style={[styles.input, styles.disabledInput]}
                value={fechaNacimiento}
                placeholder="Automático"
                editable={false}
              />
                </View>
            </View>

            <Text style={styles.label}>Teléfono</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={telefono}
              placeholder="Automático"
              editable={false}
            />
            <Text style={styles.label}>Correo Electrónico</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={correo}
              placeholder="Automático"
              editable={false}
            />
            </View>

          {/* ================= SECCIÓN 2: BÚSQUEDA Y SELECCIÓN MÉDICA ================= */}
          <View style={[styles.sectionCard, { zIndex: 5 }]}>
            <Text style={styles.sectionTitle}>2. Selección de Especialidad y Médico</Text>

            {/* BUSCADOR DE ESPECIALIDAD */}
            <Text style={styles.label}>Buscar Especialidad</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Ejem. Odontología, Pediatría..."
              value={busquedaEspecialidad}
              onChangeText={buscarEspecialidades}
            />

            {showEspecialidades && (
            <View style={styles.floatingList}>

              {especialidades.map((item, index) => (

                <TouchableOpacity
                  key={index}
                  style={styles.floatingItem}
                  onPress={() => {

                    setBusquedaEspecialidad(item.Especialidad);

                    setShowEspecialidades(false);

                    cargarDoctores(item.Especialidad);

                  }}
                >

                  <Text style={styles.itemTexto}>
                    {item.Especialidad}
                  </Text>

                </TouchableOpacity>

              ))}

            </View>
          )}

            {/* MENÚ DESPLEGABLE PARA DOCTORES (Mismo estilo que el sexo) */}
            <Text style={styles.label}>Doctor Asignado</Text>
            <View style={styles.relativeContainer}>
              <TouchableOpacity 
                style={styles.dropdownHeader} 
                onPress={() => setShowDocDropdown(!showDocDropdown)}
              >
                <Text style={styles.placeholderText}>
                  {doctorSeleccionado || "Selecciona un doctor..."}
                </Text>
                <Ionicons name={showDocDropdown ? "chevron-up" : "chevron-down"} size={20} color="#a0aec0" />
              </TouchableOpacity>

              {showDocDropdown && (
                <View style={styles.floatingList}>

                  {doctores.map((doctor, index) => (

                    <TouchableOpacity
                      key={index}
                      style={styles.floatingItem}
                      onPress={() => {

                        setDoctorSeleccionado(
                          `${doctor.Nombres} ${doctor.Apellidos}`
                        );
                        setDoctorId(doctor.IdDoctor);
                        setShowDocDropdown(false);

                        if (fechaCita) {
                          cargarHorarios(
                            doctor.IdDoctor,
                            fechaCita
                          );
                        }
                      }}
                    >

                      <Text style={styles.itemTexto}>
                        Dr. {doctor.Nombres} {doctor.Apellidos}
                      </Text>

                    </TouchableOpacity>

                  ))}

                </View>
              )}
            </View>
          </View>

          {/* ================= SECCIÓN 3: FECHA, HORA Y UBICACIÓN ================= */}
          <View style={[styles.sectionCard, { zIndex: 1 }]}>
            <Text style={styles.sectionTitle}>3. Horario y Ubicación</Text>

            {/* CALENDARIO NATIVO */}
            <Text style={styles.label}>Fecha de la Consulta</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <View pointerEvents="none">
                <TextInput style={styles.input} placeholder="Selecciona el día de atención" value={fechaCita} editable={false} />
              </View>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker value={new Date()} mode="date" display="default" onChange={onFechaChange} minimumDate={new Date()} />
            )}

            {/* MENÚ DESPLEGABLE PARA HORAS DISPONIBLES */}
            <Text style={styles.label}>Hora de la Cita</Text>
            <View style={styles.relativeContainer}>
              <TouchableOpacity 
                style={styles.dropdownHeader} 
                onPress={() => {

                  if (!doctorId) {
                    alert("Selecciona un doctor primero");
                    return;
                  }

                  if (!fechaCita) {
                    alert("Selecciona una fecha primero");
                    return;
                  }

                  setShowHoraDropdown(!showHoraDropdown);

                }}
              >
                <Text style={styles.placeholderText}>
                  {horaSeleccionada || "Selecciona un horario disponible..."}
                </Text>
                <Ionicons name={showHoraDropdown ? "chevron-up" : "chevron-down"} size={20} color="#a0aec0" />
              </TouchableOpacity>

              {showHoraDropdown && (
              <View style={styles.floatingList}>

                {horariosDisponibles.length === 0 ? (

                  <View style={styles.floatingItem}>
                    <Text
                      style={[
                        styles.itemTexto,
                        {
                          color: "#e53e3e",
                          textAlign: "center",
                          fontWeight: "600"
                        }
                      ]}
                    >
                      No hay horarios disponibles para esta fecha
                    </Text>
                  </View>

                ) : (

                  horariosDisponibles.map((hora, index) => (

                    <TouchableOpacity
                      key={index}
                      style={styles.floatingItem}
                      onPress={() => {

                        setHoraSeleccionada(hora);

                        setShowHoraDropdown(false);

                        if (doctorId) {
                          cargarConsultorio(doctorId);
                        }

                      }}
                    >

                      <Text style={styles.itemTexto}>
                        {hora}
                      </Text>

                    </TouchableOpacity>

                  ))

                )}

              </View>
            )}
            </View>

            {/* NÚMERO DE CONSULTORIO AUTOMÁTICO */}
            <Text style={styles.label}>Número de Consultorio Asignado</Text>
            <View style={styles.consultorioContainer}>
              <Ionicons name="business-outline" size={22} color="#3A5BA0" style={{ marginRight: 10 }} />
              <TextInput 
                style={[styles.input, styles.disabledInput, { flex: 1, borderWidth: 0, backgroundColor: 'transparent', padding: 0 }]} 
                value={consultorio?.toString()}
                placeholder="Se asignará automáticamente según el doctor"
                editable={false} 
              />
            </View>
          </View>

          {/* BOTÓN REGISTRAR CITA */}
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={guardarCita}
          >
          <Text style={styles.buttonText}>Confirmar y Agendar Cita</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6F8" },
  content: { padding: 15, paddingBottom: 50 },
  logo: { fontSize: 18, fontWeight: "600", color: "#3A5BA0", marginBottom: 5 },
  title: { fontSize: 24, fontWeight: "bold", color: "#1A202C" },
  subtitle: { color: "#6b7280", marginBottom: 20, fontSize: 14 },
  
  // Tarjetas para separar visualmente los grupos de datos
  sectionCard: { backgroundColor: "#fff", padding: 15, borderRadius: 12, marginBottom: 15, elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#3A5BA0", marginBottom: 10, borderBottomWidth: 1, borderBottomColor: "#EDF2F7", paddingBottom: 5 },
  
  label: { marginTop: 10, marginBottom: 5, color: "#4a5568", fontWeight: "600", fontSize: 14 },
  input: { backgroundColor: "#fff", padding: 12, borderRadius: 8, borderWidth: 1, borderColor: "#cbd5e0", fontSize: 16, color: "#2D3748" },
  
  // Input destacado para buscar el ID
  idInput: { borderColor: "#3A5BA0", borderWidth: 1.5, backgroundColor: "#F7FAFC" },
  
  // Estilo grisáceo para los campos que serán autorellenables (Bloqueados por ahora)
  disabledInput: { backgroundColor: "#EDF2F7", color: "#718096", borderColor: "#E2E8F0" },
  
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  relativeContainer: { position: 'relative' },
  placeholderText: { color: "#a0aec0", fontSize: 16 },
  
  // Cabecera idéntica al selector de Sexo/Género
  dropdownHeader: { backgroundColor: "#fff", padding: 12, borderRadius: 8, borderWidth: 1, borderColor: "#cbd5e0", flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 48 },
  
  // Listas flotantes posicionadas de manera absoluta
  floatingList: { position: 'absolute', top: 52, left: 0, right: 0, backgroundColor: "#fff", borderRadius: 8, borderWidth: 1, borderColor: "#cbd5e0", elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 4, zIndex: 999 },
  floatingItem: { padding: 12, borderBottomWidth: 1, borderColor: "#e2e8f0" },
  itemTexto: { fontSize: 15, color: '#2D3748' },
  
  // Contenedor especial con icono para el consultorio bloqueado
  consultorioContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: "#EDF2F7", borderRadius: 8, borderWidth: 1, borderColor: "#E2E8F0", paddingHorizontal: 12, height: 48 },
  
  button: { marginTop: 15, backgroundColor: "#3A5BA0", padding: 15, borderRadius: 10, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});