import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';

export default function HomePaciente() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Titulos */}
        <View style={styles.header}>
          <Text style={styles.brand}>Cuida+</Text>
          <Text style={styles.welcome}>Hola, {nombre || 'Usuario'}</Text>
          <Text style={styles.subtitle}>Encuentra especialidades, agenda tu próxima cita y revisa tus consultas activas.</Text>
        </View>

        {/* Buscador */}
        <View style={styles.searchContainer}>
          <TextInput 
            style={styles.searchInput}
            placeholder="Buscar médico o especialidad"
            placeholderTextColor="#A0AEC0"
          />
        </View>

        {/* Menú de Opciones */}
        <View style={styles.menuGrid}>
          <TouchableOpacity style={styles.menuCard} 
            onPress={() => router.push('../interfaces/buscarMedico')}>
            <Text style={styles.menuTitle}>Buscar médico</Text>
            <Text style={styles.menuSubtitle}>Especialidades y perfiles</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuCard}
            onPress={() => router.push('../interfaces/agendarCita')}>
            <Text style={styles.menuTitle}>Mis citas</Text>
            <Text style={styles.menuSubtitle}>Próximas y pasadas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuCard}>
            <Text style={styles.menuTitle}>Pagos</Text>
            <Text style={styles.menuSubtitle}>Anticipos y recibos</Text>
          </TouchableOpacity>
        </View>

        {/* Cita proxima */}
        <View style={styles.appointmentCard}>
          <Text style={styles.sectionLabel}>Próxima cita</Text>
          <Text style={styles.doctorName}>Cardiología - Dra. Ana Beltrán</Text>
          <Text style={styles.appointmentDetail}>Miércoles 18 de marzo · 10:30 AM</Text>
          <Text style={styles.appointmentDetail}>Sucursal Zona Norte · Consultorio 4</Text>
          
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Confirmada</Text>
          </View>
        </View>

        {/* Botón nueva cita */}
        <TouchableOpacity style={styles.mainButton}>
          <Text style={styles.mainButtonText}>Agendar nueva cita</Text>
        </TouchableOpacity>

        {/* Especialidades Destacadas */}
        <View style={styles.specialtiesSection}>
          <Text style={styles.sectionLabelBold}>Especialidades destacadas</Text>
          <View style={styles.tagsContainer}>
            {['Medicina general', 'Dermatología', 'Pediatría', 'Cardiología', 'Ginecología', 'Traumatología'].map((item) => (
              <View key={item} style={styles.tag}>
                <Text style={styles.tagText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

{/* Estilos */}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC', 
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    marginBottom: 25,
  },
  brand: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#345195',
    marginBottom: 5,
  },
  welcome: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#718096',
    lineHeight: 20,
  },
  searchContainer: {
    marginBottom: 25,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    fontSize: 14,
  },
  menuGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    width: '31%',
    padding: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: 100,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 5,
  },
  menuSubtitle: {
    fontSize: 10,
    color: '#A0AEC0',
  },
  appointmentCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 8,
  },
  sectionLabelBold: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 15,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 5,
  },
  appointmentDetail: {
    fontSize: 13,
    color: '#718096',
    marginBottom: 3,
  },
  statusBadge: {
    backgroundColor: '#E6FFFA', // Verde clarito
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginTop: 15,
  },
  statusText: {
    color: '#319795', // Verde oscuro
    fontSize: 12,
    fontWeight: 'bold',
  },
  mainButton: {
    backgroundColor: '#345195',
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 25,
  },
  mainButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  specialtiesSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 30,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tag: {
    backgroundColor: '#E6FFFA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  tagText: {
    color: '#319795',
    fontSize: 12,
    fontWeight: '600',
  },
});