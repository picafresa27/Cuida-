import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

export default function ConsultoriosStatus() {
  // Simulación de los consultorios de la clínica Cuida+
  const [consultorios, setConsultorios] = useState([
    {
      id: 1,
      numero: "Consultorio 101",
      especialidad: "Pediatría",
      doctor: "Dr. Armando Casas",
      estado: "Ocupado", // Ocupado, Disponible, Mantenimiento
      paciente: "Mateo López (Niño)",
    },
    {
      id: 2,
      numero: "Consultorio 102",
      especialidad: "General",
      doctor: "Dra. Elba Lazo",
      estado: "Disponible",
      paciente: null,
    },
    {
      id: 3,
      numero: "Consultorio 103",
      especialidad: "Odontología",
      doctor: "Dr. Alan Brito",
      estado: "Ocupado",
      paciente: "Alejandra Serrano",
    },
    {
      id: 4,
      numero: "Consultorio 104",
      especialidad: "Ginecología",
      doctor: "Dra. Aquiles Pico",
      estado: "Mantenimiento",
      paciente: null,
    },
  ]);

  // Función para obtener el color del badge según el estado
  const getEstadoEstilo = (estado: string) => {
    switch (estado) {
      case "Disponible":
        return { bg: "#E6FFFA", texto: "#319795", border: "#B2F5EA" };
      case "Ocupado":
        return { bg: "#FED7D7", texto: "#E53E3E", border: "#FEB2B2" };
      default: // Mantenimiento
        return { bg: "#FEFCBF", texto: "#B7791F", border: "#FEEBC8" };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Encabezado */}
        <View style={styles.header}>
          <Text style={styles.title}>Monitoreo</Text>
          <Text style={styles.subtitle}>Estatus de Consultorios</Text>
        </View>

        {/* Tarjetas de Consultorios */}
        <View style={styles.grid}>
          {consultorios.map((cons) => {
            const estilo = getEstadoEstilo(cons.estado);
            return (
              <View key={cons.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.roomNumber}>{cons.numero}</Text>
                  <View
                    style={[
                      styles.badge,
                      {
                        backgroundColor: estilo.bg,
                        borderColor: estilo.border,
                      },
                    ]}
                  >
                    <Text style={[styles.badgeText, { color: estilo.texto }]}>
                      {cons.estado}
                    </Text>
                  </View>
                </View>

                <Text style={styles.specialty}>{cons.especialidad}</Text>
                <Text style={styles.doctorName}>👨‍⚕️ {cons.doctor}</Text>

                {/* Separador físico si está ocupado */}
                {cons.estado === "Ocupado" && (
                  <View style={styles.patientBox}>
                    <Text style={styles.patientLabel}>En consulta con:</Text>
                    <Text style={styles.patientName}>{cons.paciente}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FAFC" },
  content: { padding: 25 },
  header: { marginBottom: 25 },
  title: { fontSize: 14, fontWeight: "bold", color: "#41A69A", textTransform: "uppercase", letterSpacing: 1 },
  subtitle: { fontSize: 28, fontWeight: "bold", color: "#1A202C" },
  grid: { gap: 15 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  roomNumber: { fontSize: 18, fontWeight: "bold", color: "#2D3748" },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  badgeText: { fontSize: 12, fontWeight: "bold" },
  specialty: { fontSize: 14, fontWeight: "600", color: "#718096", marginBottom: 4 },
  doctorName: { fontSize: 15, color: "#4A5568", marginBottom: 5 },
  
  // Caja de detalles del paciente si está ocupado
  patientBox: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#EDF2F7",
  },
  patientLabel: { fontSize: 11, color: "#A0AEC0", textTransform: "uppercase", fontWeight: "bold" },
  patientName: { fontSize: 14, fontWeight: "bold", color: "#345195", marginTop: 2 },
});