import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function ReagendarCita() {
  const router = useRouter();
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');

  // Datos de la cita actual (esto vendría de tus params o BD)
  const citaActual = {
    doctor: "Dra. Ana Beltrán",
    especialidad: "Cardiología",
    fechaAnterior: "18 Mar · 10:30 AM"
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Reagendar Cita</Text>
      
      {/* Resumen de la cita que se va a cambiar */}
      <View style={styles.cardInfo}>
        <Text style={styles.label}>Cita actual con:</Text>
        <Text style={styles.doctorName}>{citaActual.doctor}</Text>
        <Text style={styles.especialidad}>{citaActual.especialidad}</Text>
        <View style={styles.divider} />
        <Text style={styles.fechaTexto}>📅 {citaActual.fechaAnterior}</Text>
      </View>

      <Text style={styles.subtitle}>Selecciona la nueva fecha</Text>
      
      {/* Calendario */}
      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={(day) => setFechaSeleccionada(day.dateString)}
          markedDates={{
            [fechaSeleccionada]: { selected: true, selectedColor: '#2B498E' }
          }}
          theme={{
            todayTextColor: '#2B498E',
            arrowColor: '#2B498E',
          }}
        />
      </View>

      {/* Selector de Horarios (Ejemplo rápido) */}
      <Text style={styles.subtitle}>Horarios disponibles</Text>
      <View style={styles.horariosGrid}>
        {['09:00 AM', '11:30 AM', '04:00 PM'].map((hora) => (
          <TouchableOpacity key={hora} style={styles.horaChip}>
            <Text style={styles.horaTexto}>{hora}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Botón de Confirmar */}
      <TouchableOpacity 
        style={[styles.btnConfirmar, !fechaSeleccionada && { opacity: 0.5 }]}
        disabled={!fechaSeleccionada}
        onPress={() => {
            // Aquí iría tu lógica de UPDATE en SQL Server
            alert(`Cita reagendada para el ${fechaSeleccionada}`);
            router.back();
        }}
      >
        <Text style={styles.btnTexto}>Confirmar Cambio</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAFC', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1A365D', marginBottom: 20, marginTop: 40 },
  subtitle: { fontSize: 16, fontWeight: '600', color: '#1A365D', marginVertical: 15 },
  cardInfo: { 
    backgroundColor: '#FFFFFF', 
    padding: 15, 
    borderRadius: 12, 
    borderLeftWidth: 5, 
    borderLeftColor: '#2B498E',
    elevation: 3 
  },
  label: { fontSize: 12, color: '#718096', marginBottom: 5 },
  doctorName: { fontSize: 18, fontWeight: 'bold', color: '#2B498E' },
  especialidad: { fontSize: 14, color: '#4A5568' },
  divider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 10 },
  fechaTexto: { fontSize: 14, fontWeight: '500', color: '#1A365D' },
  calendarContainer: { backgroundColor: 'white', borderRadius: 12, overflow: 'hidden', elevation: 2 },
  horariosGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  horaChip: { backgroundColor: '#EBF8FF', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#BEE3F8' },
  horaTexto: { color: '#2B498E', fontWeight: 'bold' },
  btnConfirmar: { backgroundColor: '#2B498E', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 40 },
  btnTexto: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});