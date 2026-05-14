import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";

export default function PacientesDoctor() {
  const [busqueda, setBusqueda] = useState("");
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<any>(null);

  // Datos de ejemplo basados en tu solicitud
  const listaPacientes = [
    { 
      id: 1, 
      nombre: "Alejandra Serrano", 
      edad: 34, 
      ultimaConsulta: "2026-05-10",
      historial: [
        { fecha: "2026-05-10", motivo: "Control de presión", diagnostico: "Estable" },
        { fecha: "2026-02-15", motivo: "Gripe estacional", diagnostico: "Tratamiento con antivirales" },
        { fecha: "2025-11-20", motivo: "Chequeo anual", diagnostico: "Sana" }
      ]
    },
    { id: 2, nombre: "Roberto Valdez", edad: 45, ultimaConsulta: "2026-04-12", historial: [] },
  ];

  const filtrarPacientes = listaPacientes.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Mis Pacientes</Text>
        
        <TextInput
          style={styles.searchBar}
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChangeText={setBusqueda}
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          {filtrarPacientes.map((paciente) => (
            <TouchableOpacity 
              key={paciente.id} 
              style={styles.patientCard}
              onPress={() => setPacienteSeleccionado(paciente)}
            >
              <View>
                <Text style={styles.patientName}>{paciente.nombre}</Text>
                <Text style={styles.patientSub}>{paciente.edad} años · Última: {paciente.ultimaConsulta}</Text>
              </View>
              <Text style={styles.arrow}>→</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* MODAL DE DETALLE (EXPEDIENTE) */}
      <Modal visible={!!pacienteSeleccionado} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {pacienteSeleccionado && (
              <>
                <Text style={styles.modalTitle}>{pacienteSeleccionado.nombre}</Text>
                <Text style={styles.modalSubtitle}>{pacienteSeleccionado.edad} años</Text>
                
                <View style={styles.statsBox}>
                  <Text style={styles.statLabel}>Consultas totales</Text>
                  <Text style={styles.statValue}>{pacienteSeleccionado.historial.length}</Text>
                </View>

                <Text style={styles.historyTitle}>Historial de Consultas</Text>
                <ScrollView>
                  {pacienteSeleccionado.historial.map((h: any, i: number) => (
                    <View key={i} style={styles.historyItem}>
                      <Text style={styles.historyDate}>{h.fecha}</Text>
                      <Text style={styles.historyMotivo}>{h.motivo}</Text>
                      <Text style={styles.historyDiag}>{h.diagnostico}</Text>
                    </View>
                  ))}
                </ScrollView>

                <TouchableOpacity 
                  style={styles.closeBtn} 
                  onPress={() => setPacienteSeleccionado(null)}
                >
                  <Text style={styles.closeBtnText}>Cerrar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FAFC" },
  content: { padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", color: "#1A202C", marginBottom: 20 },
  searchBar: { backgroundColor: "#FFF", padding: 15, borderRadius: 12, borderWidth: 1, borderColor: "#E2E8F0", marginBottom: 20 },
  patientCard: { 
    backgroundColor: "#FFF", 
    padding: 20, 
    borderRadius: 15, 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0"
  },
  patientName: { fontSize: 18, fontWeight: "bold", color: "#2D3748" },
  patientSub: { fontSize: 14, color: "#718096", marginTop: 4 },
  arrow: { fontSize: 20, color: "#345195", fontWeight: "bold" },
  
  // Estilos del Modal
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "#FFF", borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 30, height: "80%" },
  modalTitle: { fontSize: 24, fontWeight: "bold", color: "#1A202C" },
  modalSubtitle: { fontSize: 16, color: "#718096", marginBottom: 20 },
  statsBox: { backgroundColor: "#F0F9FF", padding: 15, borderRadius: 12, alignItems: "center", marginBottom: 20 },
  statLabel: { fontSize: 12, color: "#345195", fontWeight: "bold" },
  statValue: { fontSize: 24, fontWeight: "bold", color: "#345195" },
  historyTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  historyItem: { borderLeftWidth: 3, borderLeftColor: "#41A69A", paddingLeft: 15, marginBottom: 20 },
  historyDate: { fontSize: 12, fontWeight: "bold", color: "#41A69A" },
  historyMotivo: { fontSize: 15, fontWeight: "bold", color: "#2D3748" },
  historyDiag: { fontSize: 13, color: "#718096" },
  closeBtn: { backgroundColor: "#345195", padding: 15, borderRadius: 12, alignItems: "center", marginTop: 10 },
  closeBtnText: { color: "#FFF", fontWeight: "bold" }
});