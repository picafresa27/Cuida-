import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { io } from "socket.io-client";
import API_URL from "../../../config/api";
import { UserContext } from "../../../context/userContext";
// Configuración del Socket (mismo endpoint, diferente canal si fuera necesario)
//const URL_BACKEND = `${API_URL}/usuarios`;
//const socket = io(URL_BACKEND);
export default function HomeDoctor() {
  const { usuario } = useContext(UserContext);
  const router = useRouter();
  const [dashboard, setDashboard] = useState<any>(null);

  const socketRef = React.useRef<any>(null);

  const obtenerDashboard = async () => {
    try {
      const response = await fetch(
        `${API_URL}/dashboard-doctor/${usuario?.id}`
      );

      const data = await response.json();
      setDashboard(data);

    } catch (error) {
      console.log("ERROR DASHBOARD:", error);
    }
  };

  useEffect(() => {
    obtenerDashboard();
  }, []);

  useEffect(() => {
    socketRef.current = io(API_URL);

    socketRef.current.on("connect", () => {
      console.log("🟢 Doctor conectado:", socketRef.current.id);
    });

    socketRef.current.on("cita-actualizada", () => {
      console.log("📡 Dashboard actualizado en tiempo real");
      obtenerDashboard(); // 🔥 CLAVE
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Encabezado Profesional */}
        <View style={styles.header}>
          <Text style={styles.brand}>Panel Médico Cuida+</Text>
          <Text style={styles.welcome}>Buen día, Dr. {usuario?.nombres || "Especialista"} {usuario?.apellidos}</Text>
          <Text style={styles.subtitle}>
            Hoy tienes {dashboard?.citasHoy || 0} citas programadas.
          </Text>
        </View>

        {/* Resumen de Estadísticas Rápidas */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{dashboard?.citasHoy || 0}</Text>
            <Text style={styles.statLabel}>Citas Hoy</Text>
          </View>
          <View style={[styles.statCard, { borderColor: '#41A69A' }]}>
            <Text style={[styles.statNumber, { color: '#41A69A' }]}>{dashboard?.pacientes || 0}</Text>
            <Text style={styles.statLabel}>Pacientes</Text>
          </View>
        </View>

        {/* Menú de Gestión Doctor */}
        <View style={styles.menuGrid}>
          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => router.push("/interfacesDoctor/(tabsDoctor)/agenda")}
          >
            <Text style={styles.menuTitle}>Ver Agenda</Text>
            <Text style={styles.menuSubtitle}>Calendario completo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => router.push("/interfacesDoctor/(tabsDoctor)/pacientes")}
          >
            <Text style={styles.menuTitle}>Pacientes</Text>
            <Text style={styles.menuSubtitle}>Historial clínico</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuCard}>
            <Text style={styles.menuTitle}>Horarios</Text>
            <Text style={styles.menuSubtitle}>Gestionar turnos</Text>
          </TouchableOpacity>
        </View>

        {/* Próximo Paciente (Tarjeta enfocada) */}
        <View style={styles.nextPatientCard}>
  <Text style={styles.sectionLabel}>Siguiente Paciente</Text>

  {dashboard?.siguientePaciente ? (
    <>
      {/* CASO CON PACIENTE */}
      <View style={styles.patientInfoRow}>
        <View>
          <Text style={styles.patientName}>
            {dashboard.siguientePaciente.Nombres}{" "}
            {dashboard.siguientePaciente.Apellidos}
          </Text>

          <Text style={styles.appointmentTime}>
  {new Date(dashboard.siguientePaciente.Fecha).toLocaleDateString(
    "es-MX",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  ).replace(" de ", " ").replace(" de ", " ")}{" "}
  - {dashboard.siguientePaciente.Hora} - Consultorio{" "}
  {dashboard.siguientePaciente.NumeroConsultorio}
</Text>
        </View>
      </View>

      <View style={styles.actionButtonsRow}>
        <TouchableOpacity
          style={styles.btnVerExpediente}
          onPress={() => {
            router.push({
              pathname: "./interfacesDoctor/(tabsDoctor)/expedientePaciente",
              params: { 
                expediente: dashboard.siguientePaciente.NumeroExpediente 
              }
            });
          }}
        >
          <Text style={styles.btnTextAzul}>Ver Expediente</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnIniciarConsulta}
          onPress={() => {
            router.push({
              pathname: "/interfacesDoctor/(tabsDoctor)/registroConsulta", // <-- Asegúrate de que esta ruta apunte a tu nuevo archivo
              params: { 
                cita: dashboard.siguientePaciente.IdCita, 
                expediente: dashboard.siguientePaciente.NumeroExpediente 
              }
            });
          }}
        >
          <Text style={styles.btnTextBlanco}>Iniciar Consulta</Text>
        </TouchableOpacity>
      </View>
    </>
  ) : (
    <>
      {/* CASO SIN PACIENTE (NUEVO DISEÑO) */}
      <View style={styles.emptyState}>
        <Ionicons name="calendar-outline" size={34} color="#CBD5E0" style={{ marginBottom: 10 }} />
        <Text style={styles.emptyTitle}>No tienes pacientes pendientes</Text>
        <Text style={styles.emptySubtitle}>
          Todo está al día por ahora
        </Text>

        <TouchableOpacity
          style={styles.emptyButton}
          onPress={() => router.push("/interfacesDoctor/(tabsDoctor)/agenda")}
        >
          <Text style={styles.emptyButtonText}>
            Ver agenda completa
          </Text>
        </TouchableOpacity>
      </View>
    </>
  )}
</View>

        {/* Notificaciones o Pendientes */}
        <View style={styles.pendingSection}>
          <Text style={styles.sectionLabelBold}>Pendientes administrativos</Text>
          <TouchableOpacity style={styles.pendingItem}>
            <View style={styles.dotRed} />
            <Text style={styles.pendingText}>Firmar receta digital - Folio #882</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.pendingItem}>
            <View style={styles.dotOrange} />
            <Text style={styles.pendingText}>Actualizar disponibilidad para Mayo</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  patientInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    marginBottom: 20,
  },
  brand: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#41A69A", // Verde del logo para diferenciar que es panel doctor
    letterSpacing: 1,
    marginBottom: 10,
  },
  welcome: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1A202C",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#718096",
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    width: '48%',
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#345195',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#345195',
  },
  statLabel: {
    fontSize: 12,
    color: '#718096',
    marginTop: 2,
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
    minHeight: 90,
  },
  menuTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#1A202C",
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 10,
    color: "#A0AEC0",
  },
  nextPatientCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#345195",
    marginBottom: 25,
    shadowColor: "#345195",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#345195",
    textTransform: "uppercase",
    marginBottom: 10,
  },
  patientName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A202C",
    marginBottom: 4,
  },
  appointmentTime: {
    fontSize: 14,
    color: "#41A69A",
    fontWeight: "600",
    marginBottom: 2,
  },
  reasonText: {
    fontSize: 13,
    color: "#718096",
    marginBottom: 15,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  btnVerExpediente: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#345195",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  btnIniciarConsulta: {
    flex: 1,
    backgroundColor: "#345195",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  btnTextAzul: {
    color: "#345195",
    fontWeight: "bold",
    fontSize: 14,
  },
  btnTextBlanco: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  pendingSection: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  sectionLabelBold: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A202C",
    marginBottom: 15,
  },
  pendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dotRed: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E53E3E',
    marginRight: 10,
  },
  dotOrange: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ED8936',
    marginRight: 10,
  },
  pendingText: {
    fontSize: 14,
    color: "#4A5568",
  },
  emptyState: {
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: 30,
},

emptyIcon: {
  fontSize: 30,
  marginBottom: 10,
},

emptyTitle: {
  fontSize: 16,
  fontWeight: "bold",
  color: "#1A202C",
  marginBottom: 5,
},

emptySubtitle: {
  fontSize: 13,
  color: "#718096",
  marginBottom: 15,
  textAlign: "center",
},

emptyButton: {
  backgroundColor: "#345195",
  paddingVertical: 10,
  paddingHorizontal: 15,
  borderRadius: 10,
},

emptyButtonText: {
  color: "#fff",
  fontWeight: "bold",
  fontSize: 13,
},
});