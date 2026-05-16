import { useRouter } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function InicioRecepcion() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.brand}>Módulo de Recepción</Text>
          <Text style={styles.title}>Panel de Control</Text>
        </View>

        {/* Acciones Rápidas */}
        <View style={styles.actionGrid}>
          <TouchableOpacity 
            style={[styles.bigButton, { backgroundColor: '#345195' }]}
            onPress={() => router.push("./registroPaciente")}
          >
            <Text style={styles.bigButtonIcon}>👤</Text>
            <Text style={styles.bigButtonText}>Nuevo Paciente y cita</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.bigButton, { backgroundColor: '#41A69A' }]}
            onPress={() => router.push("../interfacesRecepcion/agendaGeneral")}
          >
            <Text style={styles.bigButtonIcon}>📅</Text>
            <Text style={styles.bigButtonText}>Agenda{"\n"}General</Text>
          </TouchableOpacity>
        </View>

        {/* Estatus de la Clínica */}
        <View style={styles.statusSection}>
          <Text style={styles.sectionTitle}>Resumen del día</Text>
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>12</Text>
              <Text style={styles.statLabel}>Pendientes</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>05</Text>
              <Text style={styles.statLabel}>En Consulta</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>08</Text>
              <Text style={styles.statLabel}>Completadas</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FAFC" },
  content: { padding: 25 },
  header: { marginBottom: 30 },
  brand: { fontSize: 14, fontWeight: "bold", color: "#41A69A", letterSpacing: 1 },
  title: { fontSize: 32, fontWeight: "bold", color: "#1A202C" },
  actionGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  bigButton: { width: '48%', padding: 20, borderRadius: 20, alignItems: 'center', elevation: 4 },
  bigButtonIcon: { fontSize: 30, marginBottom: 10 },
  bigButtonText: { color: '#FFF', fontWeight: 'bold', textAlign: 'center', fontSize: 16 },
  statusSection: { backgroundColor: '#FFF', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A202C', marginBottom: 15 },
  statRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statNum: { fontSize: 24, fontWeight: 'bold', color: '#345195' },
  statLabel: { fontSize: 12, color: '#718096' },
});