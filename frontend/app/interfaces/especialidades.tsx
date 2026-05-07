import { useRouter } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Especialidades() {
  const router = useRouter();

  const especialidades = [
    { id: 1, nombre: "Medicina general", descripcion: "Chequeo y seguimiento" },
    { id: 2, nombre: "Cardiología", descripcion: "Corazón y presión" },
    { id: 3, nombre: "Dermatología", descripcion: "Piel y tratamientos" },
    { id: 4, nombre: "Pediatría", descripcion: "Atención infantil" },
    { id: 5, nombre: "Ginecología", descripcion: "Salud femenina" },
    { id: 6, nombre: "Traumatología", descripcion: "Huesos y lesiones" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Cabecera */}
        <View style={styles.header}>
          <Text style={styles.brand}>Cuida+</Text>
          <Text style={styles.title}>Especialidades</Text>
          <Text style={styles.subtitle}>
            Selecciona el servicio que necesitas para ver médicos disponibles.
          </Text>
        </View>

        {/* Grid de Especialidades */}
        <View style={styles.grid}>
          {especialidades.map((item) => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.cardTitle}>{item.nombre}</Text>
              <Text style={styles.cardSubtitle}>{item.descripcion}</Text>

              <TouchableOpacity
                style={styles.badgeButton}
                onPress={() => {
                  /* Navegación aquí */
                }}
              >
                <Text style={styles.badgeText}>Ver médicos</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Barra de navegación inferior (Simulada) */}
      <View style={styles.tabBar}>
        <View style={styles.tabItem}>
          <View style={[styles.dot, styles.dotActive]} />
          <Text style={[styles.tabLabel, styles.labelActive]}>Inicio</Text>
        </View>
        <View style={styles.tabItem}>
          <View style={styles.dot} />
          <Text style={styles.tabLabel}>Agenda</Text>
        </View>
        <View style={styles.tabItem}>
          <View style={styles.dot} />
          <Text style={styles.tabLabel}>Perfil</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100, // Espacio para la TabBar
  },
  header: {
    marginBottom: 25,
  },
  brand: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#345195",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1A202C",
    marginVertical: 5,
  },
  subtitle: {
    fontSize: 13,
    color: "#718096",
    lineHeight: 18,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#FFF",
    width: "48%",
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 15,
    justifyContent: "space-between",
    minHeight: 120,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#2D3748",
  },
  cardSubtitle: {
    fontSize: 11,
    color: "#A0AEC0",
    marginVertical: 5,
  },
  badgeButton: {
    backgroundColor: "#E6FFFA",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginTop: 10,
  },
  badgeText: {
    color: "#319795",
    fontSize: 11,
    fontWeight: "bold",
  },
  // Estilos de la TabBar inferior
  tabBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: "#F7FAFC",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 10,
  },
  tabItem: {
    alignItems: "center",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#A0AEC0",
    marginBottom: 5,
  },
  dotActive: {
    backgroundColor: "#345195",
  },
  tabLabel: {
    fontSize: 10,
    color: "#A0AEC0",
  },
  labelActive: {
    color: "#345195",
    fontWeight: "bold",
  },
});
