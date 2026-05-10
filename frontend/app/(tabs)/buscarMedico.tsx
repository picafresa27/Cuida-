import { useRouter } from "expo-router";
//import React from "react";
import { Ionicons } from '@expo/vector-icons';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

/*const MEDICOS = [
  {
    id: "1",
    nombre: "Dra. Ana Beltrán",
    especialidad: "Cardiología",
    disponible: "Hoy 10:30",
    calificacion: "4.9",
  },
  {
    id: "2",
    nombre: "Dr. Daniel Ruiz",
    especialidad: "Dermatología",
    disponible: "Mañana 9:00",
    calificacion: "4.8",
  },
  {
    id: "3",
    nombre: "Dra. Sofía Ibarra",
    especialidad: "Pediatría",
    disponible: "Jue 12:00",
    calificacion: "4.7",
  },
];*/

import React, { useEffect, useState } from "react";

export default function BuscarMedico() {
  // 1. Estado para el texto de búsqueda
  const [busqueda, setBusqueda] = useState("");
  const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState("");
  // 2. Estado para saber qué filtro de arriba está seleccionado
  const [filtroSeleccionado, setFiltroSeleccionado] = useState("Especialidades");
  // 3. Estado para controlar si mostramos la cuadrícula o la lista de doctores
  const [mostrarResultados, setMostrarResultados] = useState(false);
  // 4. Estado para guardar los doctores que traigamos del backend
  const [doctores, setDoctores] = useState([]);
  const router = useRouter();
  const [medicos, setMedicos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroActivo, setFiltroActivo] = useState("Todos");

  useEffect(() => {
    obtenerDoctores();
  }, []);

  const obtenerDoctores = async () => {
    try {
      const response = await fetch(
        "https://special-xylophone-695xxpjwwp45hrw74-3000.app.github.dev/doctores"
      );

      const data = await response.json();

      setMedicos(data);

    } catch (error) {
      console.log("Error al obtener doctores:", error);
    } finally {
      setLoading(false);
    }
  };

  /*const manejarCambioFiltro = (filtro: string) => {
    setFiltroActivo(filtro); // Cambia el brillo del botón seleccionado

    if (filtro === "Especialidades") {
      // Si elige especialidades, "apagamos" la lista de doctores para ver las tarjetas
      setMostrarResultados(false);
    } else {
      // Para cualquier otro filtro, "encendemos" la lista y cargamos datos
      setMostrarResultados(true);

      // Aquí podrías pasar el nombre del filtro para que tu backend sepa qué buscar
      // Por ejemplo: obtenerDoctores(filtro); 
      obtenerDoctores();
    }
  };*/

  /*const doctoresFiltrados = medicos.filter((medico) => {
    const termino = busqueda.toLowerCase();
    return (
      medico.Nombres.toLowerCase().includes(termino) ||
      medico.Apellidos.toLowerCase().includes(termino) ||
      medico.Especialidad.toLowerCase().includes(termino)
    );
  });*/

  const doctoresFiltrados = medicos.filter((medico) => {

    const termino = busqueda.toLowerCase();

    // Buscar por texto
    const coincideBusqueda =
      medico.Nombres.toLowerCase().includes(termino) ||
      medico.Apellidos.toLowerCase().includes(termino) ||
      medico.Especialidad.toLowerCase().includes(termino);

    // Filtrar por especialidad seleccionada
    const coincideEspecialidad =
      especialidadSeleccionada === "" ||
      medico.Especialidad === especialidadSeleccionada;

    return coincideBusqueda && coincideEspecialidad;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brand}>Cuida+</Text>
        <Text style={styles.titulo}>Buscar médico</Text>
        <Text style={styles.subtitulo}>
          Filtra por especialidad, sede y disponibilidad.
        </Text>
      </View>

      {/* Buscador */}
      <View style={styles.searchSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="Dermatología, cardiología..."
          placeholderTextColor="#A0AEC0"
          value={busqueda}
          onChangeText={(texto) => {
            setBusqueda(texto);
            if (texto.length > 0) {
              setMostrarResultados(true);
            }else{
              setMostrarResultados(false);
            }
          }}
        />
      </View>

      {/* CHIP DE ESPECIALIDAD */}
      {especialidadSeleccionada !== "" && (

        <View style={styles.chipContainer}>

          <View style={styles.chip}>

            <Text style={styles.chipText}>
              {especialidadSeleccionada}
            </Text>

            <TouchableOpacity
              onPress={() => {

                setEspecialidadSeleccionada("");

              // Si tampoco hay búsqueda, volver a especialidades
              if (busqueda.trim() === "") {
                  setMostrarResultados(false);
                }
              }}
            >
              <Ionicons name="close" size={18} color="white" />
            </TouchableOpacity>

          </View>

        </View>
      )}

      {/* Contenido Dinámico */}
      <ScrollView contentContainerStyle={styles.listContainer}>
        {!mostrarResultados ? (
          <View style={styles.gridEspecialidades}>
            {["Medicina General", "Cardiología", "Dermatología", "Pediatría", "Ginecología", "Traumatología"].map((esp) => (
              <TouchableOpacity
                key={esp}
                style={styles.cardEspecialidad}
                onPress={() => {
                  /*setBusqueda(esp);
                  setFiltroActivo("Todos");*/
                  setEspecialidadSeleccionada(esp);
                  setMostrarResultados(true);
                }}
              >
                <Text style={styles.especialidadTitle}>{esp}</Text>
                <Text style={styles.verMedicosText}>Ver médicos</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          doctoresFiltrados.map((medico) => (
            <View key={medico.IdDoctor} style={styles.doctorCard}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.doctorName}>
                    Dr. {medico.Nombres} {medico.Apellidos}
                  </Text>
                  <Text style={styles.doctorSpec}>{medico.Especialidad}</Text>
                  <Text style={styles.doctorTime}>Disponible: Hoy 10:30</Text>
                </View>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>★ 4.9</Text>
                </View>
              </View>

              <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                <TouchableOpacity style={styles.profileButton}>
                  <Text style={styles.profileButtonText}>Ver perfil</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.profileButton, { marginLeft: 10 }]}
                  onPress={() => router.push({
                    pathname: "/(tabs)/agendarCita",
                    params: {
                      idDoctor: medico.IdDoctor,
                      nombre: medico.Nombres,
                      apellidos: medico.Apellidos,
                      especialidad: medico.Especialidad,
                    },
                  })}
                >
                  <Text style={styles.profileButtonText}>Agendar Cita</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

{
  /* Estilos */
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
  header: {
    paddingHorizontal: 25,
    paddingTop: 20,
    marginBottom: 20,
  },
  brand: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#345195",
    marginBottom: 5,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1A202C",
  },
  subtitulo: {
    fontSize: 14,
    color: "#718096",
  },
  searchSection: {
    paddingHorizontal: 25,
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 15,
    padding: 15,
    fontSize: 14,
  },
  filtersWrapper: {
    marginBottom: 20,
  },
  filtersContainer: {
    paddingHorizontal: 25,
    gap: 10,
  },
  filterChip: {
    backgroundColor: "#E6FFFA",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },
  filterActive: {
    backgroundColor: "#345195",
  },
  filterText: {
    color: "#319795",
    fontWeight: "600",
    fontSize: 13,
  },
  filterTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  listContainer: {
    paddingHorizontal: 25,
    paddingBottom: 20,
  },
  doctorCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A202C",
  },
  doctorSpec: {
    fontSize: 14,
    color: "#718096",
    marginVertical: 2,
  },
  doctorTime: {
    fontSize: 13,
    color: "#41A69A",
    fontWeight: "500",
  },
  ratingBadge: {
    backgroundColor: "#E6FFFA",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  ratingText: {
    color: "#319795",
    fontWeight: "bold",
    fontSize: 12,
  },
  profileButton: {
    alignSelf: "flex-end",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
  },
  profileButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1A202C",
  },

  gridEspecialidades: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardEspecialidad: {
    width: '48%', // Para que salgan dos por fila
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    elevation: 2, // Sombra en Android
    shadowColor: "#000", // Sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
  },
  especialidadTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A202C",
  },
  verMedicosText: {
    fontSize: 13,
    color: "#41A69A",
    fontWeight: "600",
    marginTop: 10,
  },
  chipContainer: {
  paddingHorizontal: 25,
  marginBottom: 10,
  },

  chip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#345195",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },

  chipText: {
    color: "white",
    fontWeight: "600",
    marginRight: 8,
  },
});
