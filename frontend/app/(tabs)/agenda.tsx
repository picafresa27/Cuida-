import { useFocusEffect } from "expo-router"; // Para actualizar al entrar a la pestaña
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AgendaScreen() {
  const [citas, setCitas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);

  // --- LÓGICA PARA TRAER LAS CITAS ---
  const obtenerCitas = async () => {
    try {
      // Por ahora usamos el ID 1, luego lo traerás del login
      const idPaciente = 1; 
      const response = await fetch(
        `https://effective-rotary-phone-q7455xw6q74xc6w5w-3000.app.github.dev/mis-citas/${idPaciente}`
      );
      const data = await response.json();
      setCitas(data);
    } catch (error) {
      console.error("Error al obtener citas:", error);
    } finally {
      setCargando(false);
      setRefrescando(false);
    }
  };

  // Se ejecuta cada vez que el usuario hace clic en la pestaña "Agenda"
  useFocusEffect(
    useCallback(() => {
      obtenerCitas();
    }, [])
  );

  const alRefrescar = () => {
    setRefrescando(true);
    obtenerCitas();
  };

  // --- DISEÑO DE CADA TARJETA DE CITA ---
  const renderCita = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.doctorName}>Dr. {item.nombreDoctor} {item.apellidosDoctor}</Text>
        <View style={[styles.statusBadge, { backgroundColor: item.Estado === 'Pendiente' ? '#FFFBEB' : '#F0FDF4' }]}>
          <Text style={[styles.statusText, { color: item.Estado === 'Pendiente' ? '#B45309' : '#166534' }]}>
            {item.Estado}
          </Text>
        </View>
      </View>
      
      <Text style={styles.especialidad}>{item.Especialidad}</Text>
      
      <View style={styles.divider} />
      
      <View style={styles.footer}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Fecha: </Text>
          <Text style={styles.infoValue}>{item.fecha}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Hora: </Text>
          <Text style={styles.infoValue}>{item.hora} hrs</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Mi Agenda</Text>
      <Text style={styles.subtitulo}>Gestiona tus próximas consultas médicas.</Text>

      {cargando ? (
        <ActivityIndicator size="large" color="#345195" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={citas}
          keyExtractor={(item) => item.IdCita.toString()}
          renderItem={renderCita}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refrescando}
             onRefresh={alRefrescar}
              colors={["#345195"]} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No tienes citas agendadas todavía.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FAFC", paddingHorizontal: 20 },
  titulo: { fontSize: 28, fontWeight: "bold", color: "#1A202C", marginTop: 10 },
  subtitulo: { fontSize: 14, color: "#718096", marginBottom: 20 },
  listContent: { paddingBottom: 20 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  doctorName: { fontSize: 16, fontWeight: "bold", color: "#2D3748", flex: 1 },
  especialidad: { fontSize: 13, color: "#718096", marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: "bold" },
  divider: { height: 1, backgroundColor: "#EDF2F7", marginVertical: 12 },
  footer: { flexDirection: "row", justifyContent: "space-between" },
  infoRow: { flexDirection: "row" },
  infoLabel: { fontSize: 13, color: "#A0AEC0" },
  infoValue: { fontSize: 13, fontWeight: "600", color: "#4A5568" },
  emptyContainer: { marginTop: 100, alignItems: "center" },
  emptyText: { color: "#A0AEC0", fontSize: 16 },
});