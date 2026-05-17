import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  BackHandler,
  Modal, SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { io } from "socket.io-client";
import API_URL from "../../../config/api";
import { UserContext } from "../../../context/userContext";
const socket = io(API_URL);
export default function AgendaDoctor() {
  const router = useRouter();
  //const [diaSeleccionado, setDiaSeleccionado] = useState("Hoy");
  const { usuario } = useContext(UserContext);
  const [citasAgenda, setCitasAgenda] = useState<any[]>([]);
  

  const hoy = new Date();

const [fechaSeleccionada, setFechaSeleccionada] = useState(
  hoy.toISOString().split("T")[0]
);

const [mostrarCalendario, setMostrarCalendario] = useState(false);
const [vistaCalendario, setVistaCalendario] = useState<
  "dias" | "meses" | "años"
>("dias");
const [selectedDay, setSelectedDay] = useState(hoy.getDate());
const [mesSeleccionado, setMesSeleccionado] = useState(hoy.getMonth());
const [anioSeleccionado, setAnioSeleccionado] = useState(hoy.getFullYear());
const [citaSeleccionada, setCitaSeleccionada] = useState<any>(null);
const [detalleCita, setDetalleCita] = useState<any>(null);

const nombresMeses = [
  "Enero", "Febrero", "Marzo", "Abril",
  "Mayo", "Junio", "Julio", "Agosto",
  "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const aniosDisponibles = Array.from(
  { length: hoy.getFullYear() - 2020 + 1 },
  (_, i) => 2020 + i
);

const mesActualIndex = hoy.getMonth();
const anioActual = hoy.getFullYear();

const diasEnElMes = new Date(
  anioSeleccionado,
  mesSeleccionado + 1,
  0
).getDate();
  // Simulación de datos de la agenda del doctor

  useEffect(() => {

  obtenerCitas();

}, [fechaSeleccionada]);

useEffect(() => {

  socket.on("cita-actualizada", () => {
    obtenerCitas();
  });

  socket.on("cita-cancelada", () => {
    obtenerCitas();
  });

  return () => {
    socket.off("cita-actualizada");
    socket.off("cita-cancelada");
  };

}, [fechaSeleccionada]);

useEffect(() => {

  const backAction = () => {

    if (mostrarCalendario) {

      if (vistaCalendario === "años") {

        setVistaCalendario("meses");

      } else if (vistaCalendario === "meses") {

        setVistaCalendario("dias");

      } else {

        setMostrarCalendario(false);

      }

      return true;
    }

    return false;
  };

  const backHandler = BackHandler.addEventListener(
    "hardwareBackPress",
    backAction
  );

  return () => backHandler.remove();

}, [mostrarCalendario, vistaCalendario]);

const obtenerCitas = async () => {

  try {

    const response = await fetch(
      `${API_URL}/citas-doctor/${usuario?.id}/${fechaSeleccionada}`
    );

    const data = await response.json();

    console.log(data);

    setCitasAgenda(data);

  } catch (error) {

    console.log("ERROR:", error);

  }
};
const confirmarCancelacion = (idCita: number) => {
  Alert.alert(
    "Cancelar cita",
    "¿Estás seguro de que deseas cancelar esta cita?",
    [
      {
        text: "No",
        style: "cancel",
      },
      {
        text: "Sí, cancelar",
        style: "destructive",
        onPress: () => cancelarCita(idCita),
      },
    ]
  );
};
const cancelarCita = async (idCita: number) => {
  try {
    const response = await fetch(
      `${API_URL}/cancelar-cita/${idCita}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      obtenerCitas();
      setCitaSeleccionada(null);
      setDetalleCita(null);
    }
  } catch (error) {
    console.log(error);
  }
};

const abrirDetalleCita = async (cita: any) => {

  setCitaSeleccionada(cita);

  try {

    const response = await fetch(
      `${API_URL}/detalle-cita/${cita.IdCita}`
    );

    const data = await response.json();

    setDetalleCita(data);

  } catch (error) {

    console.log(error);

  }

};

const fechaHoy = hoy.toISOString().split("T")[0];

const textoFecha =
  fechaSeleccionada === fechaHoy
    ? "Hoy"
    : fechaSeleccionada;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <Modal
  visible={mostrarCalendario}
  animationType="slide"
  transparent={true}
  onRequestClose={() => {

    if (vistaCalendario === "años") {

      setVistaCalendario("meses");

    } else if (vistaCalendario === "meses") {

      setVistaCalendario("dias");

    } else {

      setMostrarCalendario(false);

    }

  }}
>
  <View style={styles.modalOverlay}>

    <View style={styles.calendarModal}>

  {/* HEADER */}
  <View style={styles.calendarHeader}>

  <TouchableOpacity
    onPress={() => {

      if (mesSeleccionado === 0) {

        setMesSeleccionado(11);

        setAnioSeleccionado(
          anioSeleccionado - 1
        );

      } else {

        setMesSeleccionado(
          mesSeleccionado - 1
        );

      }

    }}
  >
    <Ionicons
      name="chevron-back"
      size={26}
      color="#345195"
    />
  </TouchableOpacity>

  {/* HEADER DINÁMICO */}
  {vistaCalendario === "dias" && (

    <TouchableOpacity
      onPress={() =>
        setVistaCalendario("meses")
      }
    >

      <Text style={styles.monthTitle}>
        {nombresMeses[mesSeleccionado]}{" "}
        {anioSeleccionado}
      </Text>

    </TouchableOpacity>

  )}

  {vistaCalendario === "meses" && (

    <TouchableOpacity
      onPress={() =>
        setVistaCalendario("años")
      }
    >

      <Text style={styles.monthTitle}>
        {anioSeleccionado}
      </Text>

    </TouchableOpacity>

  )}

  {vistaCalendario === "años" && (

    <Text style={styles.monthTitle}>
      Selecciona un año
    </Text>

  )}

  <TouchableOpacity
    onPress={() => {

      if (mesSeleccionado === 11) {

        setMesSeleccionado(0);

        setAnioSeleccionado(
          anioSeleccionado + 1
        );

      } else {

        setMesSeleccionado(
          mesSeleccionado + 1
        );

      }

    }}
  >
    <Ionicons
      name="chevron-forward"
      size={26}
      color="#345195"
    />
  </TouchableOpacity>

</View>

  {/* VISTA DÍAS */}
  {vistaCalendario === "dias" && (

    <View style={styles.daysGrid}>

      {[...Array(diasEnElMes)].map((_, i) => {

        const day = i + 1;

        return (

          <TouchableOpacity
            key={day}
            style={[
              styles.dayButton,
              selectedDay === day &&
                styles.daySelected
            ]}
            onPress={() => {

              setSelectedDay(day);

              const fecha =
                `${anioSeleccionado}-${
                  (mesSeleccionado + 1)
                    .toString()
                    .padStart(2, "0")
                }-${
                  day
                    .toString()
                    .padStart(2, "0")
                }`;

              setFechaSeleccionada(fecha);

              setMostrarCalendario(false);
              setVistaCalendario("dias");
            }}
          >

            <Text
              style={[
                styles.dayText,
                selectedDay === day &&
                  styles.dayTextSelected
              ]}
            >
              {day}
            </Text>

          </TouchableOpacity>

        );

      })}

    </View>

  )}

  {/* VISTA MESES */}
  {vistaCalendario === "meses" && (

    <View style={styles.monthsGrid}>

      {nombresMeses.map((mes, index) => (

        <TouchableOpacity
          key={mes}
          style={[
            styles.monthButton,
            mesSeleccionado === index &&
              styles.monthButtonSelected
          ]}
          onPress={() => {

            setMesSeleccionado(index);

            setVistaCalendario("dias");

          }}
        >

          <Text
            style={[
              styles.monthButtonText,
              mesSeleccionado === index && {
                color: "#FFF"
              }
            ]}
          >
            {mes}
          </Text>

        </TouchableOpacity>

      ))}

    </View>

  )}

  {/* VISTA AÑOS */}
  {vistaCalendario === "años" && (

    <ScrollView
      style={{ maxHeight: 300 }}
      showsVerticalScrollIndicator={false}
    >

      <View style={styles.yearsGrid}>

        {aniosDisponibles.map((anio) => (

          <TouchableOpacity
            key={anio}
            style={[
              styles.yearButton,
              anioSeleccionado === anio &&
                styles.yearButtonSelected
            ]}
            onPress={() => {

              setAnioSeleccionado(anio);

              setVistaCalendario("dias");

            }}
          >

            <Text
              style={[
                styles.yearButtonText,
                anioSeleccionado === anio && {
                  color: "#FFF"
                }
              ]}
            >
              {anio}
            </Text>

          </TouchableOpacity>

        ))}

      </View>

    </ScrollView>

  )}

</View>

  </View>
</Modal>

<Modal
  visible={!!citaSeleccionada}
  animationType="slide"
  transparent={true}
  onRequestClose={() => {
    setCitaSeleccionada(null);
    setDetalleCita(null);
  }}
>

  <View style={styles.modalOverlay}>

    <View style={styles.detailModal}>

      {citaSeleccionada && (

        <>

          <Text style={styles.detailTitle}>
            {citaSeleccionada.Nombres}{" "}
            {citaSeleccionada.Apellidos}
          </Text>

          <Text style={styles.detailSubtitle}>
            {citaSeleccionada.Fecha} ·{" "}
            {citaSeleccionada.Hora}
          </Text>

          <View style={styles.detailBox}>

            <Text style={styles.detailLabel}>
              Estado
            </Text>

            <Text style={styles.detailValue}>
              {citaSeleccionada.Estado}
            </Text>

          </View>

          <View style={styles.detailBox}>

            <Text style={styles.detailLabel}>
              Consultorio
            </Text>

            <Text style={styles.detailValue}>
              {citaSeleccionada.NumeroConsultorio || "--"}
            </Text>

          </View>

          {/* SI YA PASÓ */}
          {citaSeleccionada.TipoCita === "Pasada" && (

            <>

              <Text style={styles.sectionTitle}>
                Expediente médico
              </Text>

              <View style={styles.historyItem}>

                <Text style={styles.historyDiag}>
                  Diagnóstico:
                </Text>

                <Text style={styles.historyDiag}>
                  {detalleCita?.Diagnostico ||
                    "Sin diagnóstico"}
                </Text>

                <Text style={styles.historyDiag}>
                  Tratamiento:
                </Text>

                <Text style={styles.historyDiag}>
                  {detalleCita?.Tratamiento ||
                    "Sin tratamiento"}
                </Text>

                <Text style={styles.historyDiag}>
                  Observaciones:
                </Text>

                <Text style={styles.historyDiag}>
                  {detalleCita?.Observaciones ||
                    "Sin observaciones"}
                </Text>

              </View>

            </>

          )}

          {/* SI ES FUTURA */}
          {citaSeleccionada.TipoCita !== "Pasada" && (

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => confirmarCancelacion(citaSeleccionada.IdCita)}
            >

              <Text style={styles.cancelButtonText}>
                Cancelar cita
              </Text>

            </TouchableOpacity>

          )}

          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => {

              setCitaSeleccionada(null);

              setDetalleCita(null);

            }}
          >

            <Text style={styles.closeBtnText}>
              Cerrar
            </Text>

          </TouchableOpacity>

        </>

      )}

    </View>

  </View>

</Modal>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.brand}>Cuida+ Gestión</Text>
          <Text style={styles.title}>Mi Agenda</Text>
        </View>

        {/* Selector de Fechas */}
        <View style={styles.calendarBar}>

  <View>
    <Text style={styles.selectedDateLabel}>
      {textoFecha}
    </Text>
  </View>

  <TouchableOpacity
    onPress={() => setMostrarCalendario(true)}
  >
    <Ionicons
      name="calendar"
      size={28}
      color="#345195"
    />
  </TouchableOpacity>

</View>

        {/* Lista de Citas Cronológica */}
<View style={styles.timeline}>

  {citasAgenda.length === 0 ? (

    <View style={styles.emptyContainer}>

      <Ionicons
        name="calendar-outline"
        size={70}
        color="#CBD5E0"
      />

      <Text style={styles.emptyTitle}>
        Sin citas programadas
      </Text>

      <Text style={styles.emptySubtitle}>
        No tienes citas agendadas para este día.
      </Text>

    </View>

  ) : (

    citasAgenda.map((cita: any) => (
      <View key={cita.IdCita} style={styles.timelineItem}>

        {/* Hora */}
        <View style={styles.hourContainer}>
          <Text style={styles.hourText}>
            {cita.Hora}
          </Text>

          <View style={styles.verticalLine} />
        </View>

        {/* Card */}
        <TouchableOpacity
          style={[
            styles.appointmentCard,
            cita.Estado === "En espera" &&
              styles.borderHighlight
          ]}
          /* onPress={() =>
            console.log(
              "Detalle de cita con:",
              `${cita.Nombres} ${cita.Apellidos}`
            )
          } */
           onPress={() => abrirDetalleCita(cita)}
        >

          <View style={styles.cardHeader}>

            <Text style={styles.patientName}>
              {`${cita.Nombres} ${cita.Apellidos}`}
            </Text>

            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor:
                    cita.Estado === "Completada"
                      ? "#48BB78"
                      : cita.Estado === "Pendiente"
                      ? "#ED8936"
                      : "#E53E3E",
                },
              ]}
            />

          </View>

          <Text style={styles.statusLabel}>
            {cita.Estado}
          </Text>

        </TouchableOpacity>

      </View>
    ))

  )}

</View>

      </ScrollView>

      {/* Botón flotante para bloquear horario o cita extra */}
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FAFC" },
  scrollContent: { padding: 20 },
  header: { marginBottom: 20 },
  brand: { fontSize: 14, fontWeight: "bold", color: "#41A69A", marginBottom: 5 },
  title: { fontSize: 28, fontWeight: "bold", color: "#1A202C" },
  
  dateSelector: { flexDirection: "row", gap: 10, marginBottom: 25 },
  dateTab: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, backgroundColor: "#E2E8F0" },
  dateTabActive: { backgroundColor: "#345195" },
  dateTabText: { color: "#4A5568", fontWeight: "600" },
  dateTabTextActive: { color: "#FFFFFF" },

  timeline: { marginTop: 10 },
  timelineItem: { flexDirection: "row", marginBottom: 20 },
  hourContainer: { width: 70, alignItems: "center" },
  hourText: { fontSize: 12, fontWeight: "bold", color: "#718096", marginBottom: 5 },
  verticalLine: { flex: 1, width: 2, backgroundColor: "#E2E8F0", borderRadius: 1 },
  
  appointmentCard: { 
    flex: 1, 
    backgroundColor: "#FFFFFF", 
    borderRadius: 15, 
    padding: 15, 
    borderWidth: 1, 
    borderColor: "#E2E8F0",
    marginLeft: 10
  },
  borderHighlight: { borderColor: "#345195", borderWidth: 2 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 5 },
  patientName: { fontSize: 16, fontWeight: "bold", color: "#2D3748" },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  reasonText: { fontSize: 13, color: "#718096", marginBottom: 8 },
  statusLabel: { fontSize: 11, fontWeight: "bold", color: "#345195", textTransform: "uppercase" },

  fab: { 
    position: "absolute", 
    right: 20, 
    bottom: 20, 
    backgroundColor: "#345195", 
    width: 56, 
    height: 56, 
    borderRadius: 28, 
    justifyContent: "center", 
    alignItems: "center",
    elevation: 5
  },
  fabText: { color: "#FFFFFF", fontSize: 30, fontWeight: "bold" },
  calendarBar: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 20,
},

selectedDateLabel: {
  fontSize: 16,
  fontWeight: "bold",
  color: "#345195",
},

modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.4)",
  justifyContent: "center",
  padding: 20,
},

calendarModal: {
  backgroundColor: "#FFF",
  borderRadius: 20,
  padding: 20,
},

daysGrid: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
},

dayButton: {
  width: 40,
  height: 40,
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 10,
},

daySelected: {
  backgroundColor: "#345195",
  borderRadius: 10,
},

dayText: {
  fontWeight: "bold",
},

dayTextSelected: {
  color: "#FFF",
},
monthTitle: {
  fontWeight: "bold",
  fontSize: 16,
  marginBottom: 15,
  color: "#2D3748",
},emptyContainer: {
  alignItems: "center",
  justifyContent: "center",
  marginTop: 80,
},

emptyTitle: {
  fontSize: 20,
  fontWeight: "bold",
  color: "#4A5568",
  marginTop: 15,
},

emptySubtitle: {
  fontSize: 14,
  color: "#A0AEC0",
  marginTop: 5,
  textAlign: "center",
},
calendarHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 20,
},
yearTitle: {
  fontSize: 15,
  color: "#718096",
  fontWeight: "600",
},

monthsGrid: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
},

monthButton: {
  width: "30%",
  paddingVertical: 15,
  borderRadius: 12,
  backgroundColor: "#EDF2F7",
  marginBottom: 10,
  alignItems: "center",
},

monthButtonSelected: {
  backgroundColor: "#345195",
},

monthButtonText: {
  fontWeight: "bold",
  color: "#2D3748",
},

yearsGrid: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
},

yearButton: {
  width: "30%",
  paddingVertical: 15,
  borderRadius: 12,
  backgroundColor: "#EDF2F7",
  marginBottom: 10,
  alignItems: "center",
},

yearButtonSelected: {
  backgroundColor: "#345195",
},

yearButtonText: {
  fontWeight: "bold",
  color: "#2D3748",
},
detailModal: {
  backgroundColor: "#FFF",
  borderRadius: 20,
  padding: 20,
},

detailTitle: {
  fontSize: 22,
  fontWeight: "bold",
  color: "#1A202C",
},

detailSubtitle: {
  color: "#718096",
  marginBottom: 20,
},

detailBox: {
  marginBottom: 15,
},

detailLabel: {
  fontWeight: "bold",
  color: "#345195",
},

detailValue: {
  color: "#2D3748",
  marginTop: 3,
},

cancelButton: {
  backgroundColor: "#E53E3E",
  paddingVertical: 15,
  borderRadius: 12,
  alignItems: "center",
  marginTop: 20,
},

cancelButtonText: {
  color: "#FFF",
  fontWeight: "bold",
},
sectionTitle: {
  fontSize: 18,
  fontWeight: "bold",
  color: "#1A202C",
  marginTop: 15,
  marginBottom: 10,
},

historyItem: {
  backgroundColor: "#F7FAFC",
  padding: 15,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: "#E2E8F0",
  marginBottom: 10,
},

historyDiag: {
  fontSize: 14,
  color: "#2D3748",
  marginBottom: 6,
  lineHeight: 20,
},

closeBtn: {
  backgroundColor: "#718096",
  paddingVertical: 12,
  borderRadius: 12,
  alignItems: "center",
  marginTop: 10,
},

closeBtnText: {
  color: "#FFF",
  fontWeight: "bold",
  fontSize: 14,
},
});