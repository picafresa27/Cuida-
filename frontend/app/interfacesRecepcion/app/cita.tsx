import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

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
      setFechaCita(`${año}-${mes}-${dia}`);
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

                        setShowDocDropdown(false);

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
                onPress={() => setShowHoraDropdown(!showHoraDropdown)}
              >
                <Text style={styles.placeholderText}>Selecciona un horario disponible...</Text>
                <Ionicons name={showHoraDropdown ? "chevron-up" : "chevron-down"} size={20} color="#a0aec0" />
              </TouchableOpacity>

              {showHoraDropdown && (
                <View style={styles.floatingList}>
                  <TouchableOpacity style={styles.floatingItem} onPress={() => setShowHoraDropdown(false)}>
                    <Text style={styles.itemTexto}>09:00 AM</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.floatingItem} onPress={() => setShowHoraDropdown(false)}>
                    <Text style={styles.itemTexto}>11:30 AM</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.floatingItem, { borderBottomWidth: 0 }]} onPress={() => setShowHoraDropdown(false)}>
                    <Text style={styles.itemTexto}>04:00 PM</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* NÚMERO DE CONSULTORIO AUTOMÁTICO */}
            <Text style={styles.label}>Número de Consultorio Asignado</Text>
            <View style={styles.consultorioContainer}>
              <Ionicons name="business-outline" size={22} color="#3A5BA0" style={{ marginRight: 10 }} />
              <TextInput 
                style={[styles.input, styles.disabledInput, { flex: 1, borderWidth: 0, backgroundColor: 'transparent', padding: 0 }]} 
                placeholder="Se asignará automáticamente según el doctor" 
                editable={false} 
              />
            </View>
          </View>

          {/* BOTÓN REGISTRAR CITA */}
          <TouchableOpacity style={styles.button} activeOpacity={0.8}>
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