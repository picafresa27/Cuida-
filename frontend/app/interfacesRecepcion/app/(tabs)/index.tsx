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

        {/* Sección de Acciones de Botones */}
        <View style={styles.containerBotones}>
          {/* Fila Horizontal para los dos botones de arriba */}
          <View style={styles.filaArriba}>
            <TouchableOpacity 
              style={[styles.botonCuadrado, { backgroundColor: '#345195' }]}
              onPress={() => router.push("./registroPaciente")}
            >
              <Text style={styles.textoBoton}>Nuevo Paciente y cita</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.botonCuadrado, { backgroundColor: '#41A69A' }]}
              onPress={() => router.push("../interfacesRecepcion/agendaGeneral")}
            >
              <Text style={styles.textoBoton}>Agenda{"\n"}General</Text>
            </TouchableOpacity>
          </View>

          {/* Botón Largo Completo Abajo */}
          <TouchableOpacity 
            style={[styles.botonLargoAbajo, { backgroundColor: '#b9bbbb' }]}
            onPress={() => router.push("../app/cita")}
          >
            <Text style={styles.textoBotonLargo}>Cita General</Text>
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
  container: { flex: 1, backgroundColor: "#f7fafcb0" },
  content: { padding: 25 },
  header: { marginBottom: 30 },
  brand: { fontSize: 14, fontWeight: "bold", color: "#41A69A", letterSpacing: 1 },
  title: { fontSize: 32, fontWeight: "bold", color: "#1A202C" },
  
  // Estilos de la nueva estructura de botones
  containerBotones: {
    marginBottom: 30,
  },
  filaArriba: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    gap: 15,
    marginBottom: 15 
  },
  botonCuadrado: { 
    flex: 1, 
    padding: 20, 
    height: 120,
    borderRadius: 20, 
    alignItems: 'center', 
    justifyContent: 'center',
    elevation: 4 
  },
  botonLargoAbajo: {
    width: '100%',
    height: 85,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 15,
    elevation: 4
  },
  textoBoton: { color: '#FFF', fontWeight: 'bold', textAlign: 'center', fontSize: 18, marginTop: 6 },
  textoBotonLargo: { color: '#FFF', fontWeight: 'bold', fontSize: 20 },

  // Estatus de la Clínica
  statusSection: { backgroundColor: '#FFF', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A202C', marginBottom: 15 },
  statRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statNum: { fontSize: 24, fontWeight: 'bold', color: '#345195' },
  statLabel: { fontSize: 12, color: '#718096' },
});