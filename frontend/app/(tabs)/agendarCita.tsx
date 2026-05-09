import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
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
  const [selectedDay, setSelectedDay] = useState(18);
  const [selectedTime, setSelectedTime] = useState("10:30");

  const horarios = ["09:00", "10:30", "12:00", "16:00", "17:30", "19:00"];

  // --- LÓGICA PARA AGENDAR ---
  const handleAgendar = async () => {
    router.push("/(tabs)/metodoPago");
    try {
      // Formateamos los datos para que SQL los entienda
      // La fecha debe ser YYYY-MM-DD
      const fechaFormateada = `2026-03-${selectedDay < 10 ? `0${selectedDay}` : selectedDay}`;
      // La hora debe ser HH:MM:SS
      const horaFormateada = `${selectedTime}:00`;

      const response = await fetch("https://reimagined-disco-g4rvwgw9jprrfqvx-3000.app.github.dev/agendarCita", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fecha: fechaFormateada,
          hora: horaFormateada,
          idPaciente: 1, // Por ahora fijo, después lo traeremos del login
          idDoctor: Number(idDoctor),   // Basado en tu tabla de Doctores
          numeroConsultorio: "4", // El que dice tu diseño
          anticipo: true, // Porque el botón dice "con anticipo"
        }),
      });

      if (response.ok) {
        Alert.alert("¡Cita Agendada!", `Te esperamos el ${selectedDay} de marzo a las ${selectedTime} AM.`, [
          { text: "OK", onPress: () => router.replace("/(tabs)/agenda") }
        ]);
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.error || "No se pudo agendar.");
      }
    } catch (error) {
      Alert.alert("Error de conexión", "Asegúrate de que el servidor esté encendido.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Titulo */}
        <View style={styles.header}>
          <Text style={styles.brand}>Cuida+</Text>
          <Text style={styles.title}>Agendar cita</Text>
          <Text style={styles.subtitle}>
            Elige la fecha en el calendario y selecciona un horario disponible.
          </Text>
        </View>

        {/* Info del doctor */}
        <View style={styles.doctorCard}>
          <Text style={styles.doctorName}> Dr. {nombre} {apellidos} </Text>
          <Text style={styles.doctorInfo}>
            {especialidad} · Zona Norte · Consultorio 4
          </Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Anticipo 50%</Text>
          </View>
        </View>

        {/* Calendario */}
        <View style={styles.sectionCard}>
          <View style={styles.calendarHeader}>
            <Text style={styles.monthTitle}>Marzo 2026</Text>
            <Text style={styles.monthNav}>Mes</Text>
          </View>
          <View style={styles.weekDays}>
            {["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"].map((d) => (
              <Text key={d} style={styles.weekDayText}>{d}</Text>
            ))}
          </View>
          <View style={styles.daysGrid}>
            {[...Array(29)].map((_, i) => {
              const day = i + 1;
              return (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayButton,
                    selectedDay === day && styles.daySelected,
                  ]}
                  onPress={() => setSelectedDay(day)}
                >
                  <Text style={[
                    styles.dayText,
                    selectedDay === day && styles.dayTextSelected,
                  ]}>
                    {day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Horarios disponibles */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Horarios disponibles</Text>
          <View style={styles.timeGrid}>
            {horarios.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeButton,
                  selectedTime === time && styles.timeSelected,
                ]}
                onPress={() => setSelectedTime(time)}
              >
                <Text style={[
                  styles.timeText,
                  selectedTime === time && styles.timeTextSelected,
                ]}>
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Resumen */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Resumen</Text>
          <Text style={styles.resumenMain}>
            Día {selectedDay} de marzo · {selectedTime} AM
          </Text>
          <Text style={styles.resumenDetail}>
            Consulta: $800 · Anticipo requerido: $400
          </Text>
        </View>

        {/* Botón con la acción */}
        <TouchableOpacity style={styles.mainButton} onPress={handleAgendar} >
          <Text style={styles.mainButtonText}>Continuar con anticipo</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F7FAFC"
  },
  scrollContent: { 
    padding: 20 
  },
  header: { 
    marginBottom: 20 
  },
  brand: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: "#345195" 
  },
  title: { 
    fontSize: 26, 
    fontWeight: "bold", 
    color: "#1A202C", 
    marginVertical: 5 
  },
  subtitle: { 
    fontSize: 13, 
    color: "#718096" 
  },
  doctorCard: { 
    backgroundColor: "#FFF", 
    padding: 20, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: "#E2E8F0", 
    marginBottom: 20 
  },
  doctorName: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: "#2D3748" 
  },
  doctorInfo: { 
    fontSize: 12, 
    color: "#A0AEC0", 
    marginVertical: 5 
  },
  badge: { 
    backgroundColor: "#E6FFFA", 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 10, 
    alignSelf: "flex-start" 
  },
  badgeText: { 
    color: "#319795", 
    fontSize: 12, 
    fontWeight: "bold" 
  },
  sectionCard: { 
    backgroundColor: "#FFF", 
    padding: 15, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: "#E2E8F0", 
    marginBottom: 15 
  },
  calendarHeader: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginBottom: 10 
  },
  monthTitle: { 
    fontWeight: "bold", 
    fontSize: 16 
  },
  monthNav: { 
    color: "#A0AEC0", 
    fontSize: 12 
  },
  weekDays: { 
    flexDirection: "row", 
    justifyContent: "flex-start", 
    marginBottom: 10 
  },
  weekDayText: { 
    fontSize: 12, 
    color: "#718096", 
    width: "14.28%", 
    textAlign: "center" 
  },
  daysGrid: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    justifyContent: "space-around" 
  },
  dayButton: { 
    width: 35, 
    height: 35, 
    justifyContent: "center", 
    alignItems: "center", 
    marginBottom: 5 
  },
  daySelected: { 
    backgroundColor: "#345195", 
    borderRadius: 10 
  },
  dayText: { 
    fontSize: 14, 
    fontWeight: "600" 
  },
  dayTextSelected: { 
    color: "#FFF"
  },
  sectionTitle: { 
    fontSize: 15, 
    fontWeight: "bold", 
    marginBottom: 15, 
    color: "#2D3748" 
  },
  timeGrid: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    justifyContent: "space-between" 
  },
  timeButton: { 
    width: "31%", 
    paddingVertical: 12, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: "#E2E8F0", 
    alignItems: "center", 
    marginBottom: 10 
  },
  timeSelected: { 
    backgroundColor: "#345195", 
    borderColor: "#345195" 
  },
  timeText: { 
    fontWeight: "bold", 
    color: "#2D3748" 
  },
  timeTextSelected: { 
    color: "#FFF" 
  },
  resumenMain: { 
    fontSize: 15, 
    fontWeight: "bold", 
    color: "#2D3748" },
  resumenDetail: { 
    fontSize: 12, 
    color: "#A0AEC0", 
    marginTop: 4 
  },
  mainButton: { 
    backgroundColor: "#345195", 
    paddingVertical: 18, 
    borderRadius: 15, 
    alignItems: "center", 
    marginTop: 10 
  },
  mainButtonText: { 
    color: "#FFF", 
    fontWeight: "bold", 
    fontSize: 16 
  },
});