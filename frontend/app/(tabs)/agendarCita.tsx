import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import API_URL from "../../config/api";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AgendarCita() {
  const router = useRouter();
  const { idDoctor, nombre, apellidos, especialidad } = useLocalSearchParams();

  // --- OBTENEMOS EL "AHORA" REAL ---
  const ahora = new Date();
  const diaActual = ahora.getDate();
  const mesActualIndex = ahora.getMonth();
  const anioActual = ahora.getFullYear();

  const nombresMeses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const diasEnElMes = new Date(anioActual, mesActualIndex + 1, 0).getDate();

  // --- ESTADOS ---
  const [selectedDay, setSelectedDay] = useState(diaActual);
  const [selectedTime, setSelectedTime] = useState("");

  const horarios = ["09:00", "10:30", "12:00", "16:00", "17:30", "19:00"];

  // --- LÓGICA DE BLOQUEO BLINDADA ---
  const verificarSiYaPaso = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    // Creamos la fecha completa del slot que estamos dibujando
    const fechaSlot = new Date(anioActual, mesActualIndex, selectedDay, h, m);
    
    // Si la fecha del slot es menor a la fecha de este preciso segundo, está bloqueada
    return fechaSlot < ahora;
  };

  // Selecciona automáticamente la primera hora disponible al cambiar de día
  useEffect(() => {
    const primeraDisponible = horarios.find(h => !verificarSiYaPaso(h));
    setSelectedTime(primeraDisponible || "");
  }, [selectedDay]);

  const handleAgendar = async () => {
    if (!selectedTime) {
      Alert.alert("Atención", "Selecciona un horario disponible.");
      return;
    }

    try {
      const mesF = (mesActualIndex + 1).toString().padStart(2, '0');
      const diaF = selectedDay.toString().padStart(2, '0');
      const fechaDB = `${anioActual}-${mesF}-${diaF}`;

      const response = await fetch(`${API_URL}/agendarCita`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fecha: fechaDB,
          hora: `${selectedTime}:00`,
          idPaciente: 1, 
          idDoctor: Number(idDoctor),
          numeroConsultorio: "4", 
          anticipo: true,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push({
          pathname: "/metodoPago",
          params: { 
            idCita: data.idCita || 1, 
            montoAnticipo: 400, 
            montoTotal: 800 
          }
        });
      } else {
        Alert.alert("Error", "Este horario ya fue ocupado.");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar con el servidor.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* CABECERA (Cuida+) */}
        <View style={styles.header}>
          <Text style={styles.brand}>Cuida+</Text>
          <Text style={styles.title}>Agendar cita</Text>
          <Text style={styles.subtitle}>
            Elige la fecha en el calendario y selecciona un horario disponible.
          </Text>
        </View>

        {/* INFO DOCTOR (Especialidad, Zona Norte, Consultorio 4) */}
        <View style={styles.doctorCard}>
          <Text style={styles.doctorName}>Dr. {nombre} {apellidos}</Text>
          <Text style={styles.doctorInfo}>
            {especialidad} · Zona Norte · Consultorio 4
          </Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Anticipo 50%</Text>
          </View>
        </View>

        {/* CALENDARIO */}
        <View style={styles.sectionCard}>
          <View style={styles.calendarHeader}>
            <Text style={styles.monthTitle}>{nombresMeses[mesActualIndex]} {anioActual}</Text>
          </View>
          <View style={styles.daysGrid}>
            {[...Array(diasEnElMes)].map((_, i) => {
              const day = i + 1;
              const esPasado = day < diaActual;
              return (
                <TouchableOpacity
                  key={day}
                  disabled={esPasado}
                  style={[
                    styles.dayButton,
                    selectedDay === day && styles.daySelected,
                    esPasado && { opacity: 0.15 }
                  ]}
                  onPress={() => setSelectedDay(day)}
                >
                  <Text style={[styles.dayText, selectedDay === day && styles.dayTextSelected]}>
                    {day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* HORARIOS (Aquí se aplica el bloqueo real) */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Horarios disponibles</Text>
          <View style={styles.timeGrid}>
            {horarios.map((time) => {
              const inhabilitado = verificarSiYaPaso(time);
              return (
                <TouchableOpacity
                  key={time}
                  disabled={inhabilitado}
                  style={[
                    styles.timeButton,
                    selectedTime === time && styles.timeSelected,
                    inhabilitado && { backgroundColor: "#F7FAFC", borderColor: "#EDF2F7" }
                  ]}
                  onPress={() => setSelectedTime(time)}
                >
                  <Text style={[
                    styles.timeText,
                    selectedTime === time && styles.timeTextSelected,
                    inhabilitado && { color: "#CBD5E0", textDecorationLine: 'line-through' }
                  ]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* RESUMEN (Costo $800 / Anticipo $400) */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Resumen</Text>
          <Text style={styles.resumenMain}>
            Día {selectedDay} de {nombresMeses[mesActualIndex]} · {selectedTime || "---"}
          </Text>
          <Text style={styles.resumenDetail}>
            Consulta: $800 · Anticipo requerido: $400
          </Text>
        </View>

        <TouchableOpacity style={styles.mainButton} onPress={handleAgendar}>
          <Text style={styles.mainButtonText}>Continuar con anticipo</Text>
        </TouchableOpacity>
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FAFC" },
  scrollContent: { padding: 20 },
  header: { marginBottom: 20 },
  brand: { fontSize: 18, fontWeight: "bold", color: "#345195" },
  title: { fontSize: 26, fontWeight: "bold", color: "#1A202C", marginVertical: 5 },
  subtitle: { fontSize: 13, color: "#718096" },
  doctorCard: { backgroundColor: "#FFF", padding: 20, borderRadius: 20, borderWidth: 1, borderColor: "#E2E8F0", marginBottom: 20 },
  doctorName: { fontSize: 18, fontWeight: "bold", color: "#2D3748" },
  doctorInfo: { fontSize: 12, color: "#A0AEC0", marginVertical: 5 },
  badge: { backgroundColor: "#E6FFFA", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, alignSelf: "flex-start" },
  badgeText: { color: "#319795", fontSize: 12, fontWeight: "bold" },
  sectionCard: { backgroundColor: "#FFF", padding: 15, borderRadius: 20, borderWidth: 1, borderColor: "#E2E8F0", marginBottom: 15 },
  monthTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 15 },
  daysGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  dayButton: { width: 40, height: 40, justifyContent: "center", alignItems: "center", marginBottom: 5 },
  daySelected: { backgroundColor: "#345195", borderRadius: 10 },
  dayText: { fontSize: 14, fontWeight: "600", color: "#2D3748" },
  dayTextSelected: { color: "#FFF" },
  sectionTitle: { fontSize: 15, fontWeight: "bold", marginBottom: 15, color: "#2D3748" },
  timeGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  timeButton: { width: "31%", paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: "#E2E8F0", alignItems: "center", marginBottom: 10 },
  timeSelected: { backgroundColor: "#345195", borderColor: "#345195" },
  timeText: { fontWeight: "bold", color: "#2D3748" },
  timeTextSelected: { color: "#FFF" },
  resumenMain: { fontSize: 15, fontWeight: "bold", color: "#2D3748" },
  resumenDetail: { fontSize: 12, color: "#A0AEC0", marginTop: 4 },
  mainButton: { backgroundColor: "#345195", paddingVertical: 18, borderRadius: 15, alignItems: "center", marginTop: 10 },
  mainButtonText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
});