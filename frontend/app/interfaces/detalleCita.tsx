import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function DetalleCita() {
  const router = useRouter();
  // Recibimos los datos de la cita (puedes pasarlos por params)
  const { doctor, especialidad, fecha, estado } = useLocalSearchParams();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Botón Volver */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Volver a mis citas</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Detalles de la cita</Text>
          <View style={[styles.statusBadge, estado === "Confirmada" ? styles.statusConfirmada : styles.statusPendiente]}>
            <Text style={styles.statusText}>{estado || "Confirmada"}</Text>
          </View>
        </View>

        {/* Tarjeta Informativa */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Médico Especialista</Text>
            <Text style={styles.value}>{doctor || "Dra. Ana Beltrán"}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Especialidad</Text>
            <Text style={styles.value}>{especialidad || "Cardiología"}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.label}>Fecha y Hora</Text>
            <Text style={styles.value}>{fecha || "18 Mar · 10:30 AM"}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Ubicación</Text>
            <Text style={styles.value}>Hospital Central · Torre A, Piso 4</Text>
          </View>
        </View>

        {/* Sección de Instrucciones */}
        <View style={styles.instructionSection}>
          <Text style={styles.sectionTitle}>Instrucciones</Text>
          <Text style={styles.instructionText}>
            • Favor de llegar 15 minutos antes de su cita.{"\n"}
            • Presentar identificación oficial en recepción.{"\n"}
            • Si requiere cancelar, hágalo con 24 horas de anticipación.
          </Text>
        </View>

        {/* Botones de Acción */}
        <TouchableOpacity style={styles.buttonPrimary}>
          <Text style={styles.buttonPrimaryText}>Descargar Resumen (PDF)</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.buttonSecondary}
          onPress={() => {
            router.push({
              pathname: "/interfaces/reagendarCita", 
              params: { 
                doctor: doctor || "Dra. Ana Beltrán", 
                especialidad: especialidad || "Cardiología",
                fecha: fecha 
              }
            });
          }}
        >
          <Text style={styles.buttonSecondaryText}>Reagendar Cita</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FAFC" },
  content: { padding: 25 },
  backButton: { marginBottom: 20 },
  backText: { color: "#345195", fontWeight: "600" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 25 },
  title: { fontSize: 24, fontWeight: "bold", color: "#1A202C" },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  statusConfirmada: { backgroundColor: "#C6F6D5" },
  statusPendiente: { backgroundColor: "#FEEBC8" },
  statusText: { color: "#2F855A", fontWeight: "bold", fontSize: 12 },
  infoCard: { backgroundColor: "#FFFFFF", borderRadius: 20, padding: 20, borderWidth: 1, borderColor: "#E2E8F0", elevation: 2 },
  infoRow: { marginBottom: 15 },
  label: { fontSize: 12, color: "#A0AEC0", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
  value: { fontSize: 16, fontWeight: "bold", color: "#2D3748" },
  divider: { height: 1, backgroundColor: "#E2E8F0", marginVertical: 10 },
  instructionSection: { marginTop: 25 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#1A202C", marginBottom: 10 },
  instructionText: { color: "#718096", lineHeight: 22 },
  buttonPrimary: { backgroundColor: "#345195", padding: 16, borderRadius: 15, alignItems: "center", marginTop: 30 },
  buttonPrimaryText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
  buttonSecondary: { borderWidth: 1, borderColor: "#E2E8F0", padding: 16, borderRadius: 15, alignItems: "center", marginTop: 12 },
  buttonSecondaryText: { color: "#4A5568", fontWeight: "bold" },
});