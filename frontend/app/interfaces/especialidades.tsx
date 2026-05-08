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

export default function Especialidades() {
  const router = useRouter();
  const [especialidadActiva, setEspecialidadActiva] = useState<any>(null); 

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
        <View style={styles.header}>
          <Text style={styles.brand}>Cuida+</Text>
          <Text style={styles.title}>Especialidades</Text>
          <Text style={styles.subtitle}>
            Selecciona el servicio que necesitas para ver médicos disponibles.
          </Text>
        </View>

        <View style={styles.grid}>
          {especialidades.map((item) => {
            // 2. Verificamos si esta tarjeta es la activa
            const esActiva = especialidadActiva === item.id;

            return (
              <TouchableOpacity 
                key={item.id} 
                activeOpacity={0.7}
                onPress={() => setEspecialidadActiva(item.id)} // Cambia el foco al tocar la tarjeta
                style={[
                  styles.card, 
                  esActiva && styles.cardActiva // Borde azul si está seleccionada
                ]}
              >
                <View>
                  <Text style={styles.cardTitle}>{item.nombre}</Text>
                  <Text style={styles.cardSubtitle}>{item.descripcion}</Text>
                </View>

                {/* Botón con el color de tu imagen */}
                <View
                  style={[
                    styles.badgeButton,
                    esActiva && styles.badgeButtonActivo // Se vuelve azul si la tarjeta está activa
                  ]}
                >
                  <Text style={[
                    styles.badgeText,
                    esActiva && styles.badgeTextActivo // Texto blanco si está activo
                  ]}>
                    Ver médicos
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Barra de navegación inferior */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/interfaces/inicioPaciente")}>
          <View style={[styles.dot, styles.dotActive]} />
          <Text style={[styles.tabLabel, styles.labelActive]}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <View style={styles.dot} />
          <Text style={styles.tabLabel}>Agenda</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <View style={styles.dot} />
          <Text style={styles.tabLabel}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FAFC" },
  scrollContent: { padding: 20, paddingBottom: 100 },
  header: { marginBottom: 25 },
  brand: { fontSize: 18, fontWeight: "bold", color: "#345195" },
  title: { fontSize: 28, fontWeight: "bold", color: "#1A202C", marginVertical: 5 },
  subtitle: { fontSize: 13, color: "#718096", lineHeight: 18 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  card: {
    backgroundColor: "#FFF",
    width: "48%",
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 15,
    justifyContent: "space-between",
    minHeight: 140,
    elevation: 2,
  },
  cardActiva: {
    borderColor: "#345195", // Borde del azul de Cuida+
    borderWidth: 2,
  },
  cardTitle: { fontSize: 15, fontWeight: "bold", color: "#2D3748" },
  cardSubtitle: { fontSize: 11, color: "#A0AEC0", marginVertical: 5 },
  
  // Estilo del botón "Ver médicos" basado en tu imagen
  badgeButton: {
    backgroundColor: "#E6FFFA", // Verde agua suave
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    alignSelf: "flex-start",
    marginTop: 10,
  },
  badgeButtonActivo: {
    backgroundColor: "#345195", // Azul cuando se selecciona
  },
  badgeText: {
    color: "#319795", // Verde oscuro del texto de tu imagen
    fontSize: 11,
    fontWeight: "bold",
  },
  badgeTextActivo: {
    color: "#FFFFFF", // Blanco al estar seleccionado
  },
  
  tabBar: { position: "absolute", bottom: 0, left: 0, right: 0, height: 80, backgroundColor: "#FFF", borderTopWidth: 1, borderTopColor: "#E2E8F0", flexDirection: "row", justifyContent: "space-around", paddingTop: 10 },
  tabItem: { alignItems: "center" },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#A0AEC0", marginBottom: 5 },
  dotActive: { backgroundColor: "#345195" },
  tabLabel: { fontSize: 10, color: "#A0AEC0" },
  labelActive: { color: "#345195", fontWeight: "bold" },
});