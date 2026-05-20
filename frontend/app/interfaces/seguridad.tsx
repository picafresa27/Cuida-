import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function SeguridadScreen() {
  const router = useRouter();
  
  // Estados para los interruptores (Toggle switches)
  const [biometria, setBiometria] = useState(false);
  const [autenticacionDosPasos, setAutenticacionDosPasos] = useState(false);

  const handleCambiarPassword = () => {
    // Aquí podrías navegar a una sub-ventana o abrir un modal
    Alert.alert("Cambio de Contraseña", "Se ha enviado un enlace a tu correo para restablecer tu contraseña.");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Botón de regreso con el icono que solicitaste */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#345195" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Seguridad</Text>
        <View style={{ width: 40 }} /> {/* Espaciador para centrar el título */}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Sección de Contraseña */}
        <Text style={styles.sectionTitle}>Acceso</Text>
        <TouchableOpacity style={styles.optionCard} onPress={handleCambiarPassword}>
          <View style={styles.optionLeft}>
            <View style={[styles.iconBox, { backgroundColor: '#E0E7FF' }]}>
              <Ionicons name="key-outline" size={22} color="#345195" />
            </View>
            <View>
              <Text style={styles.optionLabel}>Cambiar Contraseña</Text>
              <Text style={styles.optionSubLabel}>Actualizada hace 3 meses</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Sección de Biometría */}
        <Text style={styles.sectionTitle}>Protección Adicional</Text>
        <View style={styles.optionCard}>
          <View style={styles.optionLeft}>
            <View style={[styles.iconBox, { backgroundColor: '#F0FDF4' }]}>
              <Ionicons name="finger-print-outline" size={22} color="#16A34A" />
            </View>
            <View>
              <Text style={styles.optionLabel}>Huella Digital / FaceID</Text>
              <Text style={styles.optionSubLabel}>Acceso rápido y seguro</Text>
            </View>
          </View>
          <Switch
            value={biometria}
            onValueChange={setBiometria}
            trackColor={{ false: "#D1D5DB", true: "#345195" }}
            thumbColor={biometria ? "#FFF" : "#F4F4F5"}
          />
        </View>

        <View style={styles.optionCard}>
          <View style={styles.optionLeft}>
            <View style={[styles.iconBox, { backgroundColor: '#FFF7ED' }]}>
              <Ionicons name="shield-checkmark-outline" size={22} color="#EA580C" />
            </View>
            <View>
              <Text style={styles.optionLabel}>Autenticación en 2 pasos</Text>
              <Text style={styles.optionSubLabel}>Verificación por SMS o correo</Text>
            </View>
          </View>
          <Switch
            value={autenticacionDosPasos}
            onValueChange={setAutenticacionDosPasos}
            trackColor={{ false: "#D1D5DB", true: "#345195" }}
            thumbColor={autenticacionDosPasos ? "#FFF" : "#F4F4F5"}
          />
        </View>

        {/* Sección de Dispositivos */}
        <Text style={styles.sectionTitle}>Dispositivos</Text>
        <TouchableOpacity style={styles.optionCard}>
          <View style={styles.optionLeft}>
            <View style={[styles.iconBox, { backgroundColor: '#F8FAFC' }]}>
                <Ionicons name="hardware-chip-outline" size={22} color="#64748B" />            </View>
            <View>
              <Text style={styles.optionLabel}>Sesiones Activas</Text>
              <Text style={styles.optionSubLabel}>Gestionar donde has iniciado sesión</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    fontFamily: 'Montserrat',
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 15,
    marginTop: 10,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },
  optionSubLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
});