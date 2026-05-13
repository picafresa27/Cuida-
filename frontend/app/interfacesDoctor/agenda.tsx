import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AgendaDoctor() {
  const router = useRouter();
  const [diaSeleccionado, setDiaSeleccionado] = useState("Hoy");

  // Simulación de datos de la agenda del doctor
  const citasAgenda = [
    { id: 1, hora: "09:00 AM", paciente: "Juan Pérez", motivo: "Consulta General", estado: "Completada" },
    { id: 2, hora: "10:30 AM", paciente: "María García", motivo: "Revisión de Análisis", estado: "En espera" },
    { id: 3, hora: "11:00 AM", paciente: "Yamileth Cota", motivo: "Seguimiento", estado: "Pendiente" },
    { id: 4, hora: "01:00 PM", paciente: "Carlos Ruiz", motivo: "Urgencia", estado: "Pendiente" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.brand}>Cuida+ Gestión</Text>
          <Text style={styles.title}>Mi Agenda</Text>
        </View>

        {/* Selector de Día (Tabs simples) */}
        <View style={styles.dateSelector}>
          {["Ayer", "Hoy", "Mañana"].map((dia) => (
            <TouchableOpacity 
              key={dia}
              style={[styles.dateTab, diaSeleccionado === dia && styles.dateTabActive]}
              onPress={() => setDiaSeleccionado(dia)}
            >
              <Text style={[styles.dateTabText, diaSeleccionado === dia && styles.dateTabTextActive]}>
                {dia}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Lista de Citas Cronológica */}
        <View style={styles.timeline}>
          {citasAgenda.map((cita) => (
            <View key={cita.id} style={styles.timelineItem}>
              {/* Hora a la izquierda */}
              <View style={styles.hourContainer}>
                <Text style={styles.hourText}>{cita.hora}</Text>
                <View style={styles.verticalLine} />
              </View>

              {/* Tarjeta de la cita */}
              <TouchableOpacity 
                style={[
                  styles.appointmentCard, 
                  cita.estado === "En espera" && styles.borderHighlight
                ]}
                onPress={() => console.log("Detalle de cita con:", cita.paciente)}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.patientName}>{cita.paciente}</Text>
                  <View style={[
                    styles.statusDot, 
                    { backgroundColor: cita.estado === "Completada" ? "#48BB78" : "#ED8936" }
                  ]} />
                </View>
                <Text style={styles.reasonText}>{cita.motivo}</Text>
                <Text style={styles.statusLabel}>{cita.estado}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

      </ScrollView>

      {/* Botón flotante para bloquear horario o cita extra */}
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FAFC" },
  scrollContent: { padding: 20 },
  header: { marginBottom: 20 },
  brand: { fontSize: 14, fontWeight: "bold", color: "#41A69A", marginBottom: 5 },
  title: { fontSize: 28, fontWeight: "bold", color: "#1A202C" },
  
  dateSelector: { flexDirection: "row", gap: 10, marginBottom: 25 },
  dateTab: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, backgroundColor: "#E2E8F0" },
  dateTabActive: { backgroundColor: "#345195" },
  dateTabText: { color: "#4A5568", fontWeight: "600" },
  dateTabTextActive: { color: "#FFFFFF" },

  timeline: { marginTop: 10 },
  timelineItem: { flexDirection: "row", marginBottom: 20 },
  hourContainer: { width: 70, alignItems: "center" },
  hourText: { fontSize: 12, fontWeight: "bold", color: "#718096", marginBottom: 5 },
  verticalLine: { flex: 1, width: 2, backgroundColor: "#E2E8F0", borderRadius: 1 },
  
  appointmentCard: { 
    flex: 1, 
    backgroundColor: "#FFFFFF", 
    borderRadius: 15, 
    padding: 15, 
    borderWidth: 1, 
    borderColor: "#E2E8F0",
    marginLeft: 10
  },
  borderHighlight: { borderColor: "#345195", borderWidth: 2 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 5 },
  patientName: { fontSize: 16, fontWeight: "bold", color: "#2D3748" },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  reasonText: { fontSize: 13, color: "#718096", marginBottom: 8 },
  statusLabel: { fontSize: 11, fontWeight: "bold", color: "#345195", textTransform: "uppercase" },

  fab: { 
    position: "absolute", 
    right: 20, 
    bottom: 20, 
    backgroundColor: "#345195", 
    width: 56, 
    height: 56, 
    borderRadius: 28, 
    justifyContent: "center", 
    alignItems: "center",
    elevation: 5
  },
  fabText: { color: "#FFFFFF", fontSize: 30, fontWeight: "bold" }
});