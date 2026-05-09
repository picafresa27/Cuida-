import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, View } from 'react-native';
import { io } from "socket.io-client";
import { Ionicons } from '@expo/vector-icons';

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

// 1. CONFIGURACIÓN DEL SOCKET
const URL_BACKEND = "https://reimagined-disco-g4rvwgw9jprrfqvx-3000.app.github.dev/inicioPaciente";
const socket = io(URL_BACKEND);

export default function HomePaciente() {
  const { nombre } = useLocalSearchParams();
  const router = useRouter();

  const [especialidadActiva, setEspecialidadActiva] = useState("Medicina general");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("🟢 Conectado al servidor de Cuida+. ID:", socket.id);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Titulos */}
        <View style={styles.header}>
          <Text style={styles.brand}>Cuida+</Text>
          <Text style={styles.welcome}>Hola, {nombre || "Usuario"}</Text>
          <Text style={styles.subtitle}>
            Encuentra especialidades, agenda tu próxima cita y revisa tus
            consultas activas.
          </Text>
        </View>

        {/* Buscador - Estilo Original con Lupa */}
<View style={styles.searchWrapper}>
  <Pressable
    onPress={() => router.push("/(tabs)/buscarMedico")}
    style={({ pressed }) => [
      styles.fakeSearchInput,
      { 
        opacity: pressed ? 0.8 : 1,
      }
    ]}
  >
    <View pointerEvents="none" style={styles.innerSearch}>
      {/* Icono de Lupa */}
      <Ionicons 
        name="search-outline" 
        size={20} 
        color="#718096" 
        style={{ marginRight: 10 }} 
      />
      <Text style={styles.fakeSearchPlaceholder}>Buscar médicos</Text>
    </View>
  </Pressable>
</View>

        {/* Menú de Opciones */}
        <View style={styles.menuGrid}>
          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => router.push("/(tabs)/buscarMedico")}
          >
            <Text style={styles.menuTitle}>Buscar médico</Text>
            <Text style={styles.menuSubtitle}>Especialidades y perfiles</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => router.push("/(tabs)/misCitas")}
          >
            <Text style={styles.menuTitle}>Mis citas</Text>
            <Text style={styles.menuSubtitle}>Próximas y pasadas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuCard}>
            <Text style={styles.menuTitle}>Pagos</Text>
            <Text style={styles.menuSubtitle}>Anticipos y recibos</Text>
          </TouchableOpacity>
        </View>

        {/* Cita proxima */}
        <TouchableOpacity
          style={styles.appointmentCard}
          activeOpacity={0.7}
          onPress={() => {
            router.push({
              pathname: "/(tabs)/detalleCita",
              params: {
                doctor: "Dra. Ana Beltrán",
                especialidad: "Cardiología",
                fecha: "Miércoles 18 de marzo · 10:30 AM",
                sucursal: "Zona Norte · Consultorio 4",
                estado: "Confirmada"
              }
            });
          }}
        >
          <Text style={styles.sectionLabel}>Próxima cita</Text>
          <Text style={styles.doctorName}>Cardiología - Dra. Ana Beltrán</Text>
          <Text style={styles.appointmentDetail}>
            Miércoles 18 de marzo · 10:30 AM
          </Text>
          <Text style={styles.appointmentDetail}>
            Sucursal Zona Norte · Consultorio 4
          </Text>

          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Confirmada</Text>
          </View>
        </TouchableOpacity>

        {/* Botón nueva cita */}
        <TouchableOpacity
          style={styles.mainButton}
          onPress={() => router.push("/(tabs)/buscarMedico")}
        >
          <Text style={styles.mainButtonText}>Agendar nueva cita</Text>
        </TouchableOpacity>

        {/* Especialidades Destacadas (RECUPERADO) */}
        {/* Especialidades Destacadas (CON EFECTO DE FOCO) */}
        <View style={styles.specialtiesSection}>
          <Text style={styles.sectionLabelBold}>Especialidades destacadas</Text>
          <View style={styles.tagsContainer}>
            {[
              "Medicina general",
              "Dermatología",
              "Pediatría",
              "Cardiología",
              "Ginecología",
              "Traumatología",
            ].map((item) => {
              // Verificamos si esta es la etiqueta activa
              const esActiva = especialidadActiva === item;

              return (
                <TouchableOpacity
                  key={item}
                  onPress={() => setEspecialidadActiva(item)} // Cambia el foco al tocar
                  style={[
                    styles.tag,
                    esActiva && styles.tagActiva // Si es activa, aplica estilo extra
                  ]}
                >
                  <Text style={[
                    styles.tagText,
                    esActiva && styles.tagTextActiva // Si es activa, cambia el color de letra
                  ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    marginBottom: 25,
  },
  brand: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#345195",
    marginBottom: 5,
  },
  welcome: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1A202C",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#718096",
    lineHeight: 20,
  },
  searchContainer: {
    marginBottom: 25,
  },
  searchInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    fontSize: 14,
  },
  menuGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  menuCard: {
    backgroundColor: "#FFFFFF",
    width: "31%",
    padding: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    minHeight: 100,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1A202C",
    marginBottom: 5,
  },
  menuSubtitle: {
    fontSize: 10,
    color: "#A0AEC0",
  },
  appointmentCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A5568",
    marginBottom: 8,
  },
  sectionLabelBold: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A202C",
    marginBottom: 15,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A202C",
    marginBottom: 5,
  },
  appointmentDetail: {
    fontSize: 13,
    color: "#718096",
    marginBottom: 3,
  },
  statusBadge: {
    backgroundColor: "#E6FFFA",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginTop: 15,
  },
  statusText: {
    color: "#319795",
    fontSize: 12,
    fontWeight: "bold",
  },
  mainButton: {
    backgroundColor: "#345195",
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 25,
  },
  mainButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  specialtiesSection: {
    backgroundColor: "#F1F5F9",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 30,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  tag: {
    backgroundColor: "#E6FFFA", // Color gris clarito por defecto
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ffffff",
  },
  tagActiva: {
    backgroundColor: "#345195", // El azul de Cuida+ cuando está seleccionada
    borderColor: "#345195",
  },
  tagText: {
    color: "#319795",
    fontSize: 12,
    fontWeight: "600",
  },
  tagTextActiva: {
    color: "#FFFFFF", // Blanco cuando está seleccionada
  },
  searchPressable: {
    marginHorizontal: 20,
    marginVertical: 15,
  },
  searchWrapper: {
    marginBottom: 25,
    width: '100%', // Asegura que use todo el ancho disponible dentro del padding del padre
  },
  fakeSearchInput: {
    backgroundColor: '#Ffff',
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    paddingHorizontal: 20,
    // Sombra para que haga juego con las tarjetas de abajo
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E2E8F0", // Usamos el mismo color de borde que tus tarjetas
  },
  fakeSearchPlaceholder: {
    color: '#9CA3AF',
    fontSize: 16,
    fontFamily: 'Montserrat', // Tu fuente de marca
  },
  innerSearch: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});