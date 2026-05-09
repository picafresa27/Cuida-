import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const CITAS = [
  {
    id: 1,
    fecha: "18 Mar · 10:30 AM",
    doctor: "Dra. Ana Beltrán",
    especialidad: "Cardiología",
    estado: "Confirmada",
  },
  {
    id: 2,
    fecha: "25 Mar · 4:00 PM",
    doctor: "Dr. Daniel Ruiz",
    especialidad: "Dermatología",
    estado: "Pendiente",
  },
  {
    id: 3,
    fecha: "31 Mar · 12:00 PM",
    doctor: "Dra. Sofía Ibarra",
    especialidad: "Pediatría",
    estado: "Confirmada",
  },
];

export default function misCitas() {
  const [filtro, setFiltro] = useState("Próximas");
  const router = useRouter();
  const params = useLocalSearchParams();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.brand}>Cuida+</Text>

          <Text style={styles.title}>Mis citas</Text>

          <Text style={styles.subtitle}>
            Consulta citas próximas, historial y estado de tu anticipo.
          </Text>
        </View>

        {/* Filtros */}
        <View style={styles.filtersContainer}>
          {["Próximas", "Pasadas", "Canceladas"].map((nombreFiltro) => {
          // Comprobamos si este botón es el que está seleccionado
          const esActivo = filtro === nombreFiltro;

          return (
            <TouchableOpacity
              key={nombreFiltro}
              style={[
                styles.filterButton,
                esActivo && styles.filterActive, // Aplica azul si es activo
              ]}
              onPress={() => setFiltro(nombreFiltro)} // Cambia el estado al hacer clic
            >
              <Text
                style={[
                  styles.filterText,
                  esActivo && styles.filterTextActive, // Texto blanco si es activo
                ]}
              >
                {nombreFiltro}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

        {/* Cards */}
        {CITAS.map((cita) => (
          <View key={cita.id} style={styles.card}>
            <View>
              <Text style={styles.fecha}>{cita.fecha}</Text>

              <Text style={styles.doctor}>{cita.doctor}</Text>

              <Text style={styles.detalle}>
                {cita.especialidad} · {cita.estado}
              </Text>
            </View>

            <TouchableOpacity 
              style={styles.verButton}
              onPress={() => {
                router.push({
                  pathname: "/(tabs)/detalleCita", 
                  params: { 
                    doctor: cita.doctor, 
                    especialidad: cita.especialidad,
                    fecha: cita.fecha,
                    estado: cita.estado
                  }
                });
              }}
            >
              <Text style={styles.verButtonText}>Ver</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FA",
  },

  content: {
    padding: 20,
  },

  header: {
    marginBottom: 20,
  },

  brand: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#345195",
    marginBottom: 5,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1A202C",
  },

  subtitle: {
    fontSize: 13,
    color: "#718096",
    marginTop: 5,
  },

  filtersContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },

  filterButton: {
    backgroundColor: "#E6FFFA",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },

  filterActive: {
    backgroundColor: "#345195",
  },

  filterText: {
    color: "#319795",
    fontWeight: "600",
    fontSize: 12,
  },

  filterTextActive: {
    color: "#FFFFFF",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  fecha: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2D3748",
    marginBottom: 5,
  },

  doctor: {
    fontSize: 14,
    color: "#2D3748",
    marginBottom: 3,
  },

  detalle: {
    fontSize: 12,
    color: "#A0AEC0",
  },

  verButton: {
    borderWidth: 1,
    borderColor: "#CBD5E0",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },

  verButtonText: {
    fontWeight: "bold",
    color: "#2D3748",
  },
});