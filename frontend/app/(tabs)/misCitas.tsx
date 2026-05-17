import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { io } from "socket.io-client";
import API_URL from "../../config/api";
import { UserContext } from "../../context/userContext";
const socket = io(API_URL);
export default function misCitas() {
  const { usuario } = useContext(UserContext); 
  const [filtro, setFiltro] = useState("Próximas");
  const [citas, setCitas] = useState([]); 
  const [cargando, setCargando] = useState(true);
  const router = useRouter();
  

  // --- FUNCIÓN PARA FORMATEAR FECHA (Recibe el objeto 'cita' completo) ---
  const formatearCita = (item: any) => {
    const fRaw = item.fechaRaw || item.fecha || item.Fecha;
    const hRaw = item.horaRaw || item.hora || item.Hora;

    if (!fRaw || !hRaw) return "Fecha no disponible";

    try {
      // 1. Extraemos los números de la fecha (2026-05-10)
      const soloFecha = fRaw.split('T')[0];
      const [anio, mes, dia] = soloFecha.split('-').map(Number);

      // 2. Extraemos los números de la hora (16:00:00)
      const [horas, minutos] = hRaw.split(':').map(Number);

      // 3. Creamos el objeto de fecha manualmente
      const fechaObj = new Date(anio, mes - 1, dia, horas, minutos);

      if (isNaN(fechaObj.getTime())) return "Formato inválido";

      // 4. Mapeo de meses manual
      const meses = [
        "Ene", "Feb", "Mar", "Abr", "May", "Jun",
        "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
      ];

      const nombreMes = meses[fechaObj.getMonth()];
      const nDia = fechaObj.getDate();

      // 5. Formato de hora 12h (AM/PM)
      let h = fechaObj.getHours();
      const m = fechaObj.getMinutes().toString().padStart(2, '0');
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12;
      h = h ? h : 12; 
      const horaFinal = `${h}:${m} ${ampm}`;

      return `${nDia} ${nombreMes} · ${horaFinal}`;

    } catch (e) {
      console.error("Error al formatear:", e);
      return "Error de formato";
    }
  };

  // --- TRAER DATOS REALES ---
  const obtenerCitas = async () => {
    // Evitamos que intente buscar si el ID aún no está listo
    if (!usuario?.id) return; 

    try {
      const res = await fetch(`${API_URL}/mis-citas/${usuario.id}`);
      const data = await res.json(); 
      setCitas(data);
    } catch (error) {
      console.error("Error al obtener citas:", error);
    } finally {
      setCargando(false);
    }
  };

  const socketRef = React.useRef<any>(null);

useEffect(() => {
  socketRef.current = io(API_URL);

  socketRef.current.on("cita-actualizada", () => {
    console.log("Cambio en citas detectado (paciente)");
    obtenerCitas();
  });

  socketRef.current.on("cita-cancelada", () => {
    obtenerCitas();
  });

  return () => {
    socketRef.current.disconnect();
  };
}, []);

  useFocusEffect(
    useCallback(() => {
      obtenerCitas();
    }, [usuario?.id])
  );

  // --- LÓGICA DE FILTRADO ---
  const citasFiltradas = citas.filter((cita: any) => {
    const estadoLimpio = cita.Estado ? cita.Estado.toLowerCase() : "";
    if (filtro === "Próximas") {
      // Agregamos "confirmada" a la lista de estados válidos para esta pestaña
      return (
        estadoLimpio === "pendiente" || 
        estadoLimpio === "agendada" || 
        estadoLimpio === "confirmada"
      ); 
    }
    
    if (filtro === "Pasadas") {
      return (
        estadoLimpio === "completada" || 
        estadoLimpio === "finalizada" || 
        estadoLimpio === "terminada"
      );
    }
    
    if (filtro === "Canceladas") {
      return estadoLimpio === "cancelada";
    }
    
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.brand}>Cuida+</Text>
          <Text style={styles.title}>Mis citas</Text>
          <Text style={styles.subtitle}>
            Consulta citas próximas, historial y estado de tu anticipo.
          </Text>
        </View>

        {/* Filtros */}
        <View style={styles.filtersContainer}>
          {["Próximas", "Pasadas", "Canceladas"].map((nombreFiltro) => {
            const esActivo = filtro === nombreFiltro;
            return (
              <TouchableOpacity
                key={nombreFiltro}
                style={[styles.filterButton, esActivo && styles.filterActive]}
                onPress={() => setFiltro(nombreFiltro)}
              >
                <Text style={[styles.filterText, esActivo && styles.filterTextActive]}>
                  {nombreFiltro}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Lista Dinámica */}
        {cargando ? (
          <ActivityIndicator size="large" color="#345195" style={{ marginTop: 20 }} />
        ) : citas.length === 0 ? (
          <Text style={styles.vacioText}>Aun no hay citas registradas.</Text>
        ) : citasFiltradas.length === 0 ? (
          // 👇 Agregué este mensaje por si el paciente no tiene citas en ese filtro específico
          <Text style={styles.vacioText}>No tienes citas en la sección de {filtro}.</Text> 
        ) : (
          citasFiltradas.map((cita: any) => {
          const fechaFormateada = formatearCita(cita); 

          return (
            <View key={cita.IdCita} style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.fechaTexto}>{fechaFormateada}</Text>
                <Text style={styles.doctorTexto}>Dr. {cita.nombreDoctor} {cita.apellidosDoctor}</Text>
                <Text style={styles.detalleTexto}>
                  {cita.Especialidad} · {cita.Estado}
                </Text>
              </View>

              <TouchableOpacity 
                style={styles.verButton}
                onPress={() => {
                  router.push({
                    pathname: "/(tabs)/detalleCita", 
                    params: { 
                      idCita: cita.IdCita,
                      doctor: `Dr. ${cita.nombreDoctor} ${cita.apellidosDoctor}`, 
                      especialidad: cita.Especialidad,
                      fecha: fechaFormateada,
                      estado: cita.Estado
                    }
                  });
                }}
              >
                <Text style={styles.verButtonText}>Ver</Text>
              </TouchableOpacity>
            </View>
          );
        })
      )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F7FA" },
  content: { padding: 20 },
  header: { marginBottom: 20 },
  brand: { fontSize: 18, fontWeight: "bold", color: "#345195", marginBottom: 5 },
  title: { fontSize: 30, fontWeight: "bold", color: "#1A202C" },
  subtitle: { fontSize: 13, color: "#718096", marginTop: 5 },
  filtersContainer: { flexDirection: "row", marginBottom: 20 },
  filterButton: { backgroundColor: "#E6FFFA", paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, marginRight: 10 },
  filterActive: { backgroundColor: "#345195" },
  filterText: { color: "#319795", fontWeight: "600", fontSize: 12 },
  filterTextActive: { color: "#FFFFFF" },
  card: { backgroundColor: "#FFFFFF", borderRadius: 18, padding: 18, marginBottom: 15, borderWidth: 1, borderColor: "#E2E8F0", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  fechaTexto: { fontSize: 16, fontWeight: "bold", color: "#2D3748", marginBottom: 5 },
  doctorTexto: { fontSize: 14, color: "#2D3748", marginBottom: 3 },
  detalleTexto: { fontSize: 12, color: "#A0AEC0" },
  verButton: { borderWidth: 1, borderColor: "#CBD5E0", paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  verButtonText: { fontWeight: "bold", color: "#2D3748" },
  vacioText: { textAlign: 'center', marginTop: 50, color: '#A0AEC0', fontSize: 16 }
});