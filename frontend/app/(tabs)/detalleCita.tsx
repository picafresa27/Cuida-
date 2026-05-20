import { useLocalSearchParams, useRouter } from "expo-router";
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
  const { idCita, doctor, especialidad, fecha, estado } = useLocalSearchParams();
  console.log("DETALLE CITA ID:", idCita);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Botón Volver */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Volver a mis citas</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Detalles de la cita</Text>
          <View style={[
            styles.statusBadge, 
            estado === "Confirmada" ? styles.statusConfirmada : styles.statusPendiente
          ]}>
            <Text style={styles.statusText}>{estado || "Pendiente"}</Text>
          </View>
        </View>

        {/* Tarjeta Informativa */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Médico Especialista</Text>
            <Text style={styles.value}>{doctor}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Especialidad</Text>
            <Text style={styles.value}>{especialidad}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.label}>Fecha y Hora</Text>
            <Text style={styles.value}>{fecha}</Text>
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

        {/* 1. Botón Grande: Descargar PDF */}
        <TouchableOpacity style={styles.buttonPrimary}>
          <Text style={styles.buttonPrimaryText}>Descargar Resumen (PDF)</Text>
        </TouchableOpacity>

        {/* 2. Fila Dividida: Reagendar y Listo */}
        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={styles.btnHalfPrimary}
            onPress={() => {
              router.push({
                pathname: "/(tabs)/reagendarCita", 
                params: { doctor, especialidad, fecha }
              });
            }}
          >
            <Text style={styles.btnHalfPrimaryText}>Reagendar</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.btnHalfSecondary}
            onPress={() => router.push("/(tabs)/misCitas")}
          >
            <Text style={styles.btnHalfSecondaryText}>Listo</Text>
          </TouchableOpacity>
        </View>

        {/* 3. Botón Cancelar - AHORA CONECTADO A CANCELARCITA */}
        <TouchableOpacity 
          style={styles.buttonDanger}
          onPress={() => {
            router.push({
              pathname: "/(tabs)/cancelarCita", 
              params: { idCita, doctor, fecha }
            });
          }}
        >
          <Text style={styles.buttonDangerText}>Cancelar Cita</Text>
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
  statusText: { color: "#2D3748", fontWeight: "bold", fontSize: 12 },
  infoCard: { backgroundColor: "#FFFFFF", borderRadius: 20, padding: 20, borderWidth: 1, borderColor: "#E2E8F0", elevation: 2 },
  infoRow: { marginBottom: 15 },
  label: { fontSize: 12, color: "#A0AEC0", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
  value: { fontSize: 16, fontWeight: "bold", color: "#2D3748" },
  divider: { height: 1, backgroundColor: "#E2E8F0", marginVertical: 10 },
  
  instructionSection: { marginTop: 25 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#1A202C", marginBottom: 10 },
  instructionText: { color: "#718096", lineHeight: 22 },
  
  buttonPrimary: { backgroundColor: "#345195", padding: 14, borderRadius: 12, alignItems: "center", marginTop: 20 },
  buttonPrimaryText: { color: "#FFF", fontWeight: "bold", fontSize: 14 },
  
  actionRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  btnHalfPrimary: { backgroundColor: "#345195", flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: "center", marginRight: 10 },
  btnHalfPrimaryText: { color: "#FFF", fontWeight: "bold", fontSize: 14 },
  btnHalfSecondary: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#CBD5E0", flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  btnHalfSecondaryText: { color: "#4A5568", fontWeight: "bold", fontSize: 14 },
  
  buttonDanger: { borderWidth: 1, borderColor: "#FEB2B2", padding: 14, borderRadius: 12, alignItems: "center", marginTop: 10, marginBottom: 20 },
  buttonDangerText: { color: "#C53030", fontWeight: "bold", fontSize: 14 },
});