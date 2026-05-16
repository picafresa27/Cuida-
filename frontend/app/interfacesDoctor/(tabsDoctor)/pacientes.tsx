import React, { useContext, useEffect, useState } from "react";
import {
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import API_URL from "../../../config/api";
import { UserContext } from "../../../context/userContext";

export default function PacientesDoctor() {
  const [busqueda, setBusqueda] = useState("");
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<any>(null);
  const [expediente, setExpediente] = useState<any>(null);
  const { usuario } = useContext(UserContext);
  const [listaPacientes, setListaPacientes] = useState<any[]>([]);

  useEffect(() => {

  obtenerPacientes();

}, []);

const obtenerPacientes = async () => {

  try {

    const response = await fetch(
      `${API_URL}/pacientes-doctor/${usuario?.id}`
    );

    const data = await response.json();

    console.log(data);

    setListaPacientes(data);

  } catch (error) {

    console.log(error);

  }
};

const abrirPaciente = async (paciente: any) => {

  try {

   const response = await fetch(
      `${API_URL}/historial-paciente/${paciente.IdPaciente || paciente.id}/${usuario?.id}`
    );

    const historial = await response.json();

    setPacienteSeleccionado({
      ...paciente,
      historial
    });

  } catch (error) {

    console.log("ERROR HISTORIAL:", error);

  }
};

const obtenerExpediente = async (idPaciente: number) => {

  try {

    const response = await fetch(
      `${API_URL}/expediente/${idPaciente}`
    );

    const data = await response.json();

    console.log(data);

    if (data.length > 0) {

      setExpediente(data[0]);

    } else {

      setExpediente(null);

    }

  } catch (error) {

    console.log(error);

  }
};

  const filtrarPacientes = listaPacientes.filter((p: any) =>
  `${p.Nombres} ${p.Apellidos}`
    .toLowerCase()
    .includes(busqueda.toLowerCase())
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
              key={paciente.IdPaciente} 
              style={styles.patientCard}
              onPress={() => {abrirPaciente(paciente);obtenerExpediente(paciente.IdPaciente);}}
            >
              <View>
                <Text style={styles.patientName}>{paciente.Nombres} {paciente.Apellidos}</Text>
                <Text style={styles.patientSub}>{paciente.Edad} años · Última consulta: {paciente.UltimaConsulta || "Sin consultas"}</Text>
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
                <Text style={styles.modalTitle}>{pacienteSeleccionado.Nombres} {pacienteSeleccionado.Apellidos}</Text>
                <Text style={styles.modalSubtitle}>{pacienteSeleccionado.Edad} años</Text>
                
                {/* CONSULTAS TOTALES */}
<View style={styles.statsBox}>
  <Text style={styles.statLabel}>Consultas totales</Text>
  <Text style={styles.statValue}>
    {pacienteSeleccionado.historial?.length || 0}
  </Text>
</View>

{/* HISTORIAL DE CONSULTAS */}
<Text style={styles.historyTitle}>Historial de Consultas</Text>

{pacienteSeleccionado.historial?.length > 0 ? (

  <ScrollView style={{ maxHeight: 200 }}>

    {pacienteSeleccionado.historial.map((h: any, i: number) => (

      <View key={i} style={styles.historyItem}>

        <Text style={styles.historyDate}>
          {h.Fecha}
        </Text>

        <Text style={styles.historyMotivo}>
          Consulta médica
        </Text>

        <Text style={styles.historyDiag}>
          Hora: {h.Hora} | Estado: {h.Estado}
        </Text>

      </View>

    ))}

  </ScrollView>

) : (

  <Text style={styles.emptyText}>
    Este paciente aún no tiene consultas registradas.
  </Text>

)}

{/* EXPEDIENTE MÉDICO */}
<Text style={styles.historyTitle}>Expediente Médico</Text>

{expediente ? (

  <View style={styles.expedienteBox}>

    <Text style={styles.historyDate}>
      Apertura: {expediente.FechaApertura}
    </Text>

    <Text style={styles.historyMotivo}>
      Tipo de sangre: {expediente.TipoSangre || "No registrado"}
    </Text>

    <Text style={styles.historyDiag}>
      Antecedentes:
    </Text>

    <Text style={styles.historyDiag}>
      {expediente.Antecedentes || "Sin antecedentes registrados"}
    </Text>

  </View>

) : (

  <Text style={styles.emptyText}>
    Este paciente aún no tiene expediente médico.
  </Text>

)}

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
  closeBtnText: { color: "#FFF", fontWeight: "bold" },
  expedienteBox: {
  backgroundColor: "#F7FAFC",
  padding: 15,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: "#E2E8F0",
  marginBottom: 20,
},

emptyText: {
  color: "#718096",
  marginBottom: 20,
},
});