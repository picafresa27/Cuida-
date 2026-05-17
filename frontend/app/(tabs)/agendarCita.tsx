import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { io } from "socket.io-client";
import API_URL from "../../config/api";
import { UserContext } from "../../context/userContext";

// 1. Conexión del Socket (Asegúrate de que el puerto sea el correcto)
const socket = io(`${API_URL}/inicioPaciente`);

export default function AgendarCita() {
  const { usuario } = useContext(UserContext);
  const router = useRouter();
  const { idDoctor, nombre, apellidos, especialidad } = useLocalSearchParams();

  const consultorioSeleccionado = Number(idDoctor) === 2 ? "201-S" : "101-N";
  
  // --- CONFIGURACIÓN DE FECHA ---
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
  const [horasOcupadas, setHorasOcupadas] = useState<string[]>([]);

  const horarios = ["09:00", "10:30", "12:00", "16:00", "17:30", "19:00"];

  const consultarDisponibilidad = useCallback(async () => {
    if (!idDoctor) return;

    try {
      const mesF = (mesActualIndex + 1).toString().padStart(2, '0');
      const diaF = selectedDay.toString().padStart(2, '0');
      const fechaDB = `${anioActual}-${mesF}-${diaF}`;
      const doctorIdLimpio = Array.isArray(idDoctor) ? idDoctor[0] : idDoctor;

      const res = await fetch(`${API_URL}/horarios-ocupados/${doctorIdLimpio}/${fechaDB}`);
      if (!res.ok) throw new Error("Error en la respuesta");
      
      const data = await res.json();
      setHorasOcupadas(data); 
    } catch (error) {
      console.error("Error cargando disponibilidad:", error);
    }
  }, [selectedDay, idDoctor, anioActual, mesActualIndex]);

  useEffect(() => {
    consultarDisponibilidad();
  }, [consultarDisponibilidad]);

  useEffect(() => {
    socket.on('cita-actualizada', () => {
      console.log("Actualizando disponibilidad por cambio en otro dispositivo...");
      consultarDisponibilidad();
    });

    return () => {
      socket.off('cita-actualizada');
    };
  }, [consultarDisponibilidad]);

  const verificarSiYaPaso = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    const fechaSlot = new Date(anioActual, mesActualIndex, selectedDay, h, m);
    return fechaSlot < ahora;
  };

  // Seleccionar automáticamente la primera hora libre
  useEffect(() => {
    const primeraDisponible = horarios.find(h => !verificarSiYaPaso(h) && !horasOcupadas.includes(h));
    setSelectedTime(primeraDisponible || "");
  }, [selectedDay, horasOcupadas]);

  const handleAgendar = async () => {
    if (!usuario?.id) {
      Alert.alert("Error", "No pudimos identificar tu sesión.");
      return;
    }

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
        idPaciente: usuario?.id, 
        idDoctor: Number(idDoctor),
        numeroConsultorio: consultorioSeleccionado, // 👈 Usa tu variable dinámica aquí (sin comillas)
        anticipo: true,
      }),
      });

      // Si el servidor detecta que alguien más ganó el lugar
      if (response.status === 409) {
        Alert.alert("Ocupado", "Este horario se acaba de ocupar. Por favor elige otro.");
        consultarDisponibilidad(); // Refrescar visualmente
        return;
      }

      if (response.ok) {
        // Emitir evento para que otros sepan que agendamos
        socket.emit('nueva-cita'); 
        
        const data = await response.json();
        router.push({
          pathname: "/metodoPago",
          params: { 
            idCita: data.idCita || 1, 
            montoAnticipo: 400, 
            montoTotal: 800 
          }
        });
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar con el servidor.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* CABECERA */}
        <View style={styles.header}>
          <Text style={styles.brand}>Cuida+</Text>
          <Text style={styles.title}>Agendar cita</Text>
          <Text style={styles.subtitle}>
            Elige la fecha y selecciona un horario disponible.
          </Text>
        </View>

        {/* INFO DOCTOR */}
        <View style={styles.doctorCard}>
          <Text style={styles.doctorName}>Dr. {nombre} {apellidos}</Text>
          <Text style={styles.doctorInfo}>{especialidad} · Zona Norte · Consultorio 4</Text>
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
                  <Text style={[styles.dayText, selectedDay === day && styles.dayTextSelected]}>{day}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* HORARIOS */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Horarios disponibles</Text>
          <View style={styles.timeGrid}>
            {horarios.map((time) => {
              const yaOcupado = horasOcupadas.includes(time);
              const pasoDeHora = verificarSiYaPaso(time);
              const inhabilitado = yaOcupado || pasoDeHora;

              return (
                <TouchableOpacity
                  key={time}
                  disabled={inhabilitado}
                  style={[
                    styles.timeButton,
                    selectedTime === time && styles.timeSelected,
                    inhabilitado && { backgroundColor: "#F1F5F9", borderColor: "#E2E8F0" }
                  ]}
                  onPress={() => setSelectedTime(time)}
                >
                  <View style={{ alignItems: 'center' }}>
                    <Text style={[
                      styles.timeText,
                      selectedTime === time && styles.timeTextSelected,
                      inhabilitado && { color: "#CBD5E0", textDecorationLine: pasoDeHora ? 'line-through' : 'none' }
                    ]}>
                      {time}
                    </Text>
                    {yaOcupado && <Text style={{ fontSize: 9, color: '#A0AEC0', fontWeight: 'bold' }}>Ocupado</Text>}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* RESUMEN */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Resumen</Text>
          <Text style={styles.resumenMain}>
            Día {selectedDay} de {nombresMeses[mesActualIndex]} · {selectedTime || "---"}
          </Text>
          <Text style={styles.resumenDetail}>Consulta: $800 · Anticipo requerido: $400</Text>
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