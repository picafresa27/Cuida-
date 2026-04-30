import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const MEDICOS = [
  { id: '1', nombre: 'Dra. Ana Beltrán', especialidad: 'Cardiología', disponible: 'Hoy 10:30', calificacion: '4.9' },
  { id: '2', nombre: 'Dr. Daniel Ruiz', especialidad: 'Dermatología', disponible: 'Mañana 9:00', calificacion: '4.8' },
  { id: '3', nombre: 'Dra. Sofía Ibarra', especialidad: 'Pediatría', disponible: 'Jue 12:00', calificacion: '4.7' },
];

export default function BuscarMedico() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brand}>Cuida+</Text>
        <Text style={styles.titulo}>Buscar médico</Text>
        <Text style={styles.subtitulo}>Filtra por especialidad, sede y disponibilidad.</Text>
      </View>

      {/* Buscador */}
      <View style={styles.searchSection}>
        <TextInput 
          style={styles.searchInput}
          placeholder="Dermatología, cardiología..."
          placeholderTextColor="#A0AEC0"
        />
      </View>

      {/* Filtros rápidos */}
      <View style={styles.filtersWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContainer}>
          <TouchableOpacity style={[styles.filterChip, styles.filterActive]}>
            <Text style={styles.filterTextActive}>Todos</Text>
          </TouchableOpacity>
          {['Zona Norte', 'Zona Sur', 'Mejor calificados'].map((filtro) => (
            <TouchableOpacity key={filtro} style={styles.filterChip}>
              <Text style={styles.filterText}>{filtro}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Lista de doctores */}
      <ScrollView contentContainerStyle={styles.listContainer}>
        {MEDICOS.map((medico) => (
          <View key={medico.id} style={styles.doctorCard}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.doctorName}>{medico.nombre}</Text>
                <Text style={styles.doctorSpec}>{medico.especialidad}</Text>
                <Text style={styles.doctorTime}>Disponible: {medico.disponible}</Text>
              </View>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>★ {medico.calificacion}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.profileButton}>
              <Text style={styles.profileButtonText}>Ver perfil</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

{/* Estilos */}
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F7FAFC'
  },
  header: { 
    paddingHorizontal: 25, 
    paddingTop: 20, 
    marginBottom: 20
  },
  brand: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#345195', 
    marginBottom: 5 
  },
  titulo: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#1A202C' 
  },
  subtitulo: { 
    fontSize: 14, 
    color: '#718096' 
  },
  searchSection: { 
    paddingHorizontal: 25, 
    marginBottom: 15 
  },
  searchInput: { 
    backgroundColor: '#FFFFFF', 
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    borderRadius: 15, 
    padding: 15, 
    fontSize: 14 
  },
  filtersWrapper: { 
    marginBottom: 20 
  },
  filtersContainer: { 
    paddingHorizontal: 25, 
    gap: 10 
  },
  filterChip: { 
    backgroundColor: '#E6FFFA', 
    paddingHorizontal: 18, 
    paddingVertical: 10, 
    borderRadius: 20 
  },
  filterActive: { 
    backgroundColor: '#345195' 
  },
  filterText: { 
    color: '#319795', 
    fontWeight: '600', 
    fontSize: 13 
  },
  filterTextActive: { 
    color: '#FFFFFF', 
    fontWeight: '600' 
  },
  listContainer: { 
    paddingHorizontal: 25, 
    paddingBottom: 20 
  },
  doctorCard: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 20, 
    padding: 20, 
    marginBottom: 15, 
    borderWidth: 1, 
    borderColor: '#E2E8F0' 
  },
  cardHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 15 
  },
  doctorName: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#1A202C' 
  },
  doctorSpec: { 
    fontSize: 14, 
    color: '#718096', 
    marginVertical: 2 
  },
  doctorTime: { 
    fontSize: 13, 
    color: '#41A69A', 
    fontWeight: '500' 
  },
  ratingBadge: { 
    backgroundColor: '#E6FFFA', 
    paddingHorizontal: 10, 
    paddingVertical: 5, 
    borderRadius: 10, 
    alignSelf: 'flex-start' 
  },
  ratingText: { 
    color: '#319795', 
    fontWeight: 'bold', 
    fontSize: 12 },
  profileButton: { 
    alignSelf: 'flex-end', 
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    borderRadius: 15 
  },
  profileButtonText: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#1A202C' 
  },
});