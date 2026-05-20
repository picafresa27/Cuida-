import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ExpedientePaciente() {
  // Atrapamos el número de expediente que nos manda la pantalla anterior
  const params = useLocalSearchParams(); 
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Expediente Clínico</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Tarjeta de Información */}
      <View style={styles.card}>
        <Ionicons name="folder-open" size={50} color="#345195" style={{ marginBottom: 15 }} />
        <Text style={styles.textoDestacado}>
          Expediente ID: {params.expediente || 'No recibido'}
        </Text>
        <Text style={styles.subtexto}>
          Aquí irá el historial, alergias (NOM-004) y consultas anteriores traídas desde tu base de datos SQL Server.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', paddingHorizontal: 20, paddingTop: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  titulo: { fontSize: 20, fontWeight: '700', color: '#1F2937' },
  card: { backgroundColor: '#FFFFFF', padding: 30, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  textoDestacado: { fontSize: 18, fontWeight: 'bold', color: '#345195', marginBottom: 10 },
  subtexto: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 22 }
});