import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { io } from "socket.io-client";
import API_URL from "../../config/api";
import { UserContext } from "../../context/userContext";

// 1. CONFIGURACIÓN DEL SOCKET
const URL_BACKEND_SOCKET = `${API_URL}/inicioPaciente`;
const socket = io(URL_BACKEND_SOCKET);

export default function HomePaciente() {
  const { usuario } = useContext(UserContext);
  const router = useRouter();

  const [especialidadActiva, setEspecialidadActiva] = useState("Medicina general");
  
  // Estados para la próxima cita dinámica
  const [proximaCita, setProximaCita] = useState<any>(null);
  const [cargandoCita, setCargandoCita] = useState(true);

  const formatearFechaInicio = (fechaIso: string, horaIso: string) => {
    if (!fechaIso || !horaIso) return "";
    try {
      // Sacar el día y el mes
      const soloFecha = fechaIso.split('T')[0];
      const [anio, mes, dia] = soloFecha.split('-').map(Number);
      
      // Limpiar la hora de ese "1970-01-01T..."
      let horaLimpia = horaIso.includes('T') ? horaIso.split('T')[1].substring(0, 5) : horaIso.substring(0, 5);
      
      // Convertir a AM/PM
      const [hStr, mStr] = horaLimpia.split(':');
      let h = parseInt(hStr, 10);
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12;
      h = h ? h : 12;
      
      const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
      
      return `${dia} ${meses[mes - 1]} · ${h}:${mStr} ${ampm}`;
    } catch (error) {
      return "Formato inválido";
    }
  };

  // Efecto para el Socket (Tu lógica original)
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Conectado al servidor de Cuida+. ID:", socket.id);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Efecto para traer la próxima cita desde Azure
  useEffect(() => {
    if (!usuario?.id) {
        setCargandoCita(false);
        return;
    }

    const obtenerProximaCita = async () => {
      try {
        const res = await fetch(`${API_URL}/proxima-cita/${usuario.id}`);
        if (res.ok) {
          const data = await res.json();
          setProximaCita(data);
        } else {
          setProximaCita(null);
        }
      } catch (error) {
        console.log("Error trayendo la cita:", error);
        setProximaCita(null);
      } finally {
        setCargandoCita(false);
      }
    };

    obtenerProximaCita();
  }, [usuario]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Encabezado */}
        <View style={styles.header}>
          <Text style={styles.brand}>Cuida+</Text>
          <Text style={styles.welcome}>Hola, {usuario?.nombres || usuario?.nombre || "Usuario"}</Text>
          <Text style={styles.subtitle}>
            Encuentra especialidades, agenda tu próxima cita y revisa tus consultas activas.
          </Text>
        </View>

        {/* Buscador */}
        <View style={styles.searchWrapper}>
          <Pressable
            onPress={() => router.push("/(tabs)/buscarMedico")}
            style={({ pressed }) => [
              styles.fakeSearchInput,
              { opacity: pressed ? 0.8 : 1 }
            ]}
          >
            <View pointerEvents="none" style={styles.innerSearch}>
              <Ionicons name="search-outline" size={20} color="#718096" style={{ marginRight: 10 }} />
              <Text style={styles.fakeSearchPlaceholder}>Buscar médicos</Text>
            </View>
          </Pressable>
        </View>

        {/* Menú de Opciones */}
        <View style={styles.menuGrid}>
          <TouchableOpacity style={styles.menuCard} onPress={() => router.push("/(tabs)/buscarMedico")}>
            <Text style={styles.menuTitle}>Buscar médico</Text>
            <Text style={styles.menuSubtitle}>Especialidades y perfiles</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuCard} onPress={() => router.push("/(tabs)/misCitas")}>
            <Text style={styles.menuTitle}>Mis citas</Text>
            <Text style={styles.menuSubtitle}>Próximas y pasadas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuCard}>
            <Text style={styles.menuTitle}>Pagos</Text>
            <Text style={styles.menuSubtitle}>Anticipos y recibos</Text>
          </TouchableOpacity>
        </View>

        {/* SECCIÓN DE PRÓXIMA CITA (DINÁMICA) */}
        <Text style={styles.sectionLabelBold}>Tu actividad</Text>
        
        {cargandoCita ? (
          <View style={[styles.appointmentCard, { alignItems: 'center', paddingVertical: 40 }]}>
            <ActivityIndicator size="small" color="#345195" />
            <Text style={{ marginTop: 10, color: '#A0AEC0', fontSize: 12 }}>Consultando Azure...</Text>
          </View>
        ) : proximaCita ? (
          <TouchableOpacity
            style={styles.appointmentCard}
            activeOpacity={0.7}
            onPress={() => {
              router.push({
                pathname: "/(tabs)/detalleCita",
                params: {
                  doctor: `Dr. ${proximaCita.NombreMedico} ${proximaCita.ApellidoMedico}`,
                  especialidad: proximaCita.Especialidad,
                  fecha: formatearFechaInicio(proximaCita.Fecha, proximaCita.Hora),
                  sucursal: "Consultorio Cuida+", 
                  estado: "Confirmada"
                }
              });
            }}
          >
            <Text style={styles.sectionLabel}>Próxima cita</Text>
            <Text style={styles.doctorName}>
              {proximaCita.Especialidad} - Dr. {proximaCita.NombreMedico} {proximaCita.ApellidoMedico}
            </Text>
            <Text style={styles.appointmentDetail}>
              {formatearFechaInicio(proximaCita.Fecha, proximaCita.Hora)}
            </Text>
            <Text style={styles.appointmentDetail}>
              Consultorio Cuida+ · Zona Norte
            </Text>

            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Confirmada</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.appointmentCard, { alignItems: 'center', backgroundColor: '#F8FAFC', borderStyle: 'dashed' }]}
            activeOpacity={0.7}
            onPress={() => router.push("/(tabs)/buscarMedico")}
          >
            <Ionicons name="calendar-outline" size={24} color="#CBD5E0" style={{ marginBottom: 8 }} />
            <Text style={[styles.sectionLabel, { marginBottom: 4 }]}>Sin citas pendientes</Text>
            <Text style={styles.appointmentDetail}>¡Agenda una consulta hoy mismo!</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.mainButton}
          onPress={() => router.push("/(tabs)/buscarMedico")}
        >
          <Text style={styles.mainButtonText}>Agendar nueva cita</Text>
        </TouchableOpacity>

        {/* Especialidades Destacadas */}
        <View style={styles.specialtiesSection}>
          <Text style={styles.sectionLabelBold}>Especialidades destacadas</Text>
          <View style={styles.tagsContainer}>
            {["Medicina general", "Dermatología", "Pediatría", "Cardiología", "Ginecología", "Traumatología"].map((item) => {
              const esActiva = especialidadActiva === item;
              return (
                <TouchableOpacity
                  key={item}
                  onPress={() => setEspecialidadActiva(item)}
                  style={[styles.tag, esActiva && styles.tagActiva]}
                >
                  <Text style={[styles.tagText, esActiva && styles.tagTextActiva]}>
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
  container: { flex: 1, backgroundColor: "#F7FAFC" },
  scrollContent: { paddingHorizontal: 20, paddingVertical: 20 },
  header: { marginBottom: 25 },
  brand: { fontSize: 22, fontWeight: "bold", color: "#345195", marginBottom: 5 },
  welcome: { fontSize: 28, fontWeight: "bold", color: "#1A202C", marginBottom: 5 },
  subtitle: { fontSize: 14, color: "#718096", lineHeight: 20 },
  searchWrapper: { marginBottom: 25, width: '100%' },
  fakeSearchInput: { backgroundColor: '#FFFFFF', height: 55, borderRadius: 15, justifyContent: 'center', paddingHorizontal: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2, borderWidth: 1, borderColor: "#E2E8F0" },
  fakeSearchPlaceholder: { color: '#9CA3AF', fontSize: 16 },
  innerSearch: { flexDirection: 'row', alignItems: 'center' },
  menuGrid: { flexDirection: "row", justifyContent: "space-between", marginBottom: 25 },
  menuCard: { backgroundColor: "#FFFFFF", width: "31%", padding: 12, borderRadius: 15, borderWidth: 1, borderColor: "#E2E8F0", minHeight: 100 },
  menuTitle: { fontSize: 14, fontWeight: "bold", color: "#1A202C", marginBottom: 5 },
  menuSubtitle: { fontSize: 10, color: "#A0AEC0" },
  appointmentCard: { backgroundColor: "#FFFFFF", padding: 20, borderRadius: 20, borderWidth: 1, borderColor: "#E2E8F0", marginBottom: 20 },
  sectionLabel: { fontSize: 14, fontWeight: "600", color: "#4A5568", marginBottom: 8 },
  sectionLabelBold: { fontSize: 16, fontWeight: "bold", color: "#1A202C", marginBottom: 15 },
  doctorName: { fontSize: 18, fontWeight: "bold", color: "#1A202C", marginBottom: 5 },
  appointmentDetail: { fontSize: 13, color: "#718096", marginBottom: 3 },
  statusBadge: { backgroundColor: "#E6FFFA", alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, marginTop: 15 },
  statusText: { color: "#319795", fontSize: 12, fontWeight: "bold" },
  mainButton: { backgroundColor: "#345195", paddingVertical: 18, borderRadius: 15, alignItems: "center", marginBottom: 25 },
  mainButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
  specialtiesSection: { backgroundColor: "#F1F5F9", padding: 20, borderRadius: 20, borderWidth: 1, borderColor: "#E2E8F0", marginBottom: 30 },
  tagsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  tag: { backgroundColor: "#E6FFFA", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: "#ffffff" },
  tagActiva: { backgroundColor: "#345195", borderColor: "#345195" },
  tagText: { color: "#319795", fontSize: 12, fontWeight: "600" },
  tagTextActiva: { color: "#FFFFFF" },
});