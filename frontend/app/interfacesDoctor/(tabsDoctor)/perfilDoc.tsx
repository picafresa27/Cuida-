import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ConsultoriosYDatosScreen() {
  const router = useRouter();
  
  // Estado para controlar qué pestaña está activa
  const [pestanaActiva, setPestanaActiva] = useState<'datos' | 'renta'>('datos');

  return (
    <SafeAreaView style={styles.container}>
      {/* Barra superior */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.btnBack}>
          <Ionicons name="arrow-back" size={24} color="#345195" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>
          {pestanaActiva === 'datos' ? 'Datos Profesionales' : 'Consultorio / Renta'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Selector de Pestañas Superiores (Segmented Control) */}
      <View style={styles.tabSegmentContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, pestanaActiva === 'datos' && styles.tabButtonActive]}
          onPress={() => setPestanaActiva('datos')}
        >
          {/* Se cambió "person-card" por "id-card" que sí existe en Ionicons */}
          <Ionicons name="id-card" size={18} color={pestanaActiva === 'datos' ? '#FFFFFF' : '#64748B'} />
          <Text style={[styles.tabButtonText, pestanaActiva === 'datos' && styles.tabButtonTextActive]}>
            Mis Datos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabButton, pestanaActiva === 'renta' && styles.tabButtonActive]}
          onPress={() => setPestanaActiva('renta')}
        >
          <Ionicons name="business" size={18} color={pestanaActiva === 'renta' ? '#FFFFFF' : '#64748B'} />
          <Text style={[styles.tabButtonText, pestanaActiva === 'renta' && styles.tabButtonTextActive]}>
            Mi Renta
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* ================= CONTENIDO: DATOS PROFESIONALES ================= */}
        {pestanaActiva === 'datos' && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionSubtitle}>Información que verán tus pacientes en la plataforma.</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Cédula Profesional</Text>
              <TextInput style={styles.inputReadOnly} value="12345678" editable={false} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Especialidad Médica</Text>
              <TextInput style={styles.inputReadOnly} value="Cardiología" editable={false} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Institución de Egreso</Text>
              <TextInput style={styles.inputReadOnly} value="Universidad Autónoma de Sinaloa" editable={false} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Correo de Contacto</Text>
              <TextInput style={styles.inputReadOnly} value="doctora.ana@cuidamascoding.com" editable={false} />
            </View>
          </View>
        )}

        {/* ================= CONTENIDO: CONSULTORIO Y RENTAS ================= */}
        {pestanaActiva === 'renta' && (
          <View>
            {/* Tarjeta de estado de renta */}
            <View style={styles.statusCard}>
              <View style={styles.cardHeader}>
                <Ionicons name="business" size={26} color="#41A69A" />
                <Text style={styles.statusBadge}>Contrato Activo</Text>
              </View>
              <Text style={styles.consultorioTitle}>Consultorio Médico #104</Text>
              <Text style={styles.consultorioSubtitle}>Clínica Médica Central - Piso 1</Text>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Próximo Pago:</Text>
                <Text style={styles.infoValue}>01 de Junio, 2026</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Monto Mensual:</Text>
                <Text style={styles.infoValueBold}>$4,500.00 MXN</Text>
              </View>
            </View>

            {/* Servicios */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Servicios Incluidos</Text>
              <View style={styles.serviceItem}>
                <Ionicons name="checkmark-circle" size={20} color="#41A69A" />
                <Text style={styles.serviceText}>Internet de alta velocidad y servicios (Luz/Agua)</Text>
              </View>
              <View style={styles.serviceItem}>
                <Ionicons name="checkmark-circle" size={20} color="#41A69A" />
                <Text style={styles.serviceText}>Asistente médica en recepción compartida</Text>
              </View>
            </View>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 15, backgroundColor: '#FFFFFF' },
  btnBack: { padding: 8 },
  topBarTitle: { fontSize: 18, fontFamily: 'Montserrat', fontWeight: '700', color: '#345195' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  
  // Estilos del Tab Segmentado
  tabSegmentContainer: { flexDirection: 'row', backgroundColor: '#E2E8F0', padding: 4, borderRadius: 12, marginHorizontal: 20, marginTop: 15 },
  tabButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 10 },
  tabButtonActive: { backgroundColor: '#345195' },
  tabButtonText: { marginLeft: 6, fontSize: 13, fontFamily: 'Montserrat', fontWeight: '600', color: '#64748B' },
  tabButtonTextActive: { color: '#FFFFFF' },

  // Estilos de los Datos Profesionales
  sectionContainer: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0' },
  sectionSubtitle: { fontSize: 13, fontFamily: 'Montserrat', color: '#64748B', marginBottom: 20 },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 13, fontFamily: 'Montserrat', fontWeight: '600', color: '#475569', marginBottom: 6 },
  inputReadOnly: { backgroundColor: '#F1F5F9', padding: 12, borderRadius: 10, fontSize: 14, fontFamily: 'Montserrat', color: '#1E293B', borderWidth: 1, borderColor: '#E2E8F0' },

  // Estilos de la sección de rentas
  statusCard: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 25 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  statusBadge: { fontSize: 12, fontFamily: 'Montserrat', fontWeight: '600', color: '#41A69A', backgroundColor: '#E6FFFA', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  consultorioTitle: { fontSize: 20, fontFamily: 'Montserrat', fontWeight: '700', color: '#1E293B' },
  consultorioSubtitle: { fontSize: 14, fontFamily: 'Montserrat', color: '#64748B', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 15 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  infoLabel: { fontSize: 14, fontFamily: 'Montserrat', color: '#64748B' },
  infoValue: { fontSize: 14, fontFamily: 'Montserrat', fontWeight: '500', color: '#334155' },
  infoValueBold: { fontSize: 16, fontFamily: 'Montserrat', fontWeight: '700', color: '#345195' },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 16, fontFamily: 'Montserrat', fontWeight: '700', color: '#1E293B', marginBottom: 12 },
  serviceItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 12, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: '#F1F5F9' },
  serviceText: { marginLeft: 10, fontSize: 13, fontFamily: 'Montserrat', color: '#475569', flex: 1 }
});