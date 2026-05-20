import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Linking, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AyudaSoporteScreen() {
  const router = useRouter();

  const abrirWhatsApp = () => {
    // Ejemplo de enlace para soporte por WhatsApp
    Linking.openURL('https://wa.me/1234567890');
  };

  const enviarCorreo = () => {
    Linking.openURL('mailto:soporte@cuidaplus.com');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header con el icono de flecha azul */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#345195" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ayuda y Soporte</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Sección de FAQ */}
        <Text style={styles.sectionTitle}>Preguntas Frecuentes</Text>
        
        <HelpCard 
          icon="calendar-outline" 
          title="¿Cómo agendar una cita?" 
          desc="Guía paso a paso para programar tu consulta."
        />
        <HelpCard 
          icon="wallet-outline" 
          title="Problemas con el pago" 
          desc="Qué hacer si tu tarjeta fue rechazada."
        />
        <HelpCard 
          icon="videocam-outline" 
          title="Uso de la videollamada" 
          desc="Requerimientos técnicos para tu cita online."
        />

        {/* Sección de Contacto Directo */}
        <Text style={styles.sectionTitle}>Contacto Directo</Text>
        
        <TouchableOpacity style={styles.contactCard} onPress={abrirWhatsApp}>
          <View style={[styles.iconBox, { backgroundColor: '#DCFCE7' }]}>
            <Ionicons name="logo-whatsapp" size={24} color="#16A34A" />
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactTitle}>Chat en Vivo</Text>
            <Text style={styles.contactSub}>Disponible de 9:00 AM a 6:00 PM</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactCard} onPress={enviarCorreo}>
          <View style={[styles.iconBox, { backgroundColor: '#E0E7FF' }]}>
            <Ionicons name="mail-outline" size={24} color="#345195" />
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactTitle}>Correo Electrónico</Text>
            <Text style={styles.contactSub}>soporte@cuidaplus.com</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

// Componente pequeño para las tarjetas de ayuda
function HelpCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <TouchableOpacity style={styles.helpCard}>
      <View style={styles.helpLeft}>
        <Ionicons name={icon} size={22} color="#345195" style={styles.helpIcon} />
        <View>
          <Text style={styles.helpTitle}>{title}</Text>
          <Text style={styles.helpDesc}>{desc}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
  },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1E293B' },
  content: { padding: 20 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 15,
    marginTop: 10,
  },
  helpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  helpLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  helpIcon: { marginRight: 15 },
  helpTitle: { fontSize: 16, fontWeight: '600', color: '#334155' },
  helpDesc: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  iconBox: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  contactInfo: { flex: 1 },
  contactTitle: { fontSize: 16, fontWeight: '700', color: '#334155' },
  contactSub: { fontSize: 12, color: '#64748B' },
});