import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Modal, 
  TextInput 
} from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons'; 

// Configuración del idioma del calendario a Español
LocaleConfig.locales['es'] = {
  monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
  monthNamesShort: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
  dayNames: ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
  dayNamesShort: ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'],
};
LocaleConfig.defaultLocale = 'es';

export default function Agenda() {
  // Modales
  const [modalVisible, setModalVisible] = useState(false); 
  const [calendarioVisible, setCalendarioVisible] = useState(false);

  // Datos del formulario
  const [tipoBloqueo, setTipoBloqueo] = useState<'horas' | 'rango'>('rango'); 
  const [motivo, setMotivo] = useState('');
  const [fechaTexto, setFechaTexto] = useState('2026-05-16'); // Valor inicial idéntico a tu captura

  // Control del rango del calendario
  const [fechaInicio, setFechaInicio] = useState<string | null>(null);
  const [fechaFin, setFechaFin] = useState<string | null>(null);
  const [periodoMarcado, setPeriodoMarcado] = useState<any>({});

  // Manejador del rango de fechas tipo Gmail
  const manejarSeleccionDia = (dia: any) => {
    const fechaClave = dia.dateString; 

    if (!fechaInicio || (fechaInicio && fechaFin)) {
      // Primer click: define inicio del rango
      setFechaInicio(fechaClave);
      setFechaFin(null);
      setFechaTexto(fechaClave);
      setPeriodoMarcado({
        [fechaClave]: { startingDay: true, color: '#345195', textColor: 'white' }
      });
    } else if (fechaInicio && !fechaFin && fechaClave >= fechaInicio) {
      // Segundo click: define fin del rango y calcula los días intermedios
      setFechaFin(fechaClave);
      setFechaTexto(`${fechaInicio} al ${fechaClave}`);
      
      let marcas: any = {};
      let fechaActual = new Date(fechaInicio + 'T00:00:00');
      const fechaLimite = new Date(fechaClave + 'T00:00:00');

      while (fechaActual <= fechaLimite) {
        const stringFormateado = fechaActual.toISOString().split('T')[0];
        if (stringFormateado === fechaInicio) {
          marcas[stringFormateado] = { startingDay: true, color: '#345195', textColor: 'white' };
        } else if (stringFormateado === fechaClave) {
          marcas[stringFormateado] = { endingDay: true, color: '#345195', textColor: 'white' };
        } else {
          marcas[stringFormateado] = { color: '#E2E8F0', textColor: '#345195' }; 
        }
        fechaActual.setDate(fechaActual.getDate() + 1);
      }
      setPeriodoMarcado(marcas);
      // Opcional: Cierra el selector automáticamente tras elegir el rango completo
      setTimeout(() => setCalendarioVisible(false), 300);
    } else {
      // Si selecciona una fecha anterior, reinicia el rango con la nueva fecha
      setFechaInicio(fechaClave);
      setFechaTexto(fechaClave);
      setPeriodoMarcado({
        [fechaClave]: { startingDay: true, color: '#345195', textColor: 'white' }
      });
    }
  };

  const procesarBloqueo = () => {
    console.log("Bloqueo confirmado:", { tipoBloqueo, fechaTexto, motivo });
    setModalVisible(false);
    setMotivo('');
  };

  return (
    <View style={styles.container}>
      
      {/* PANTALLA PRINCIPAL DE LA AGENDA */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.subBrand}>Cuida+ Gestión</Text>
          <Text style={styles.tituloPantalla}>Mi Agenda</Text>
        </View>
        <TouchableOpacity style={styles.iconHeaderButton}>
          <Ionicons name="calendar-outline" size={24} color="#345195" />
        </TouchableOpacity>
      </View>

      <View style={styles.contentPlaceholder}>
        <Text style={styles.hoyLabel}>Hoy</Text>
        <Text style={{ fontFamily: 'Montserrat', color: '#9CA3AF', marginTop: 20 }}>
          No hay citas agendadas para mostrar en este momento.
        </Text>
      </View>

      {/* BOTÓN FLOTANTE */}
      <TouchableOpacity 
        style={styles.botonFlotanteCandado}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="lock-closed" size={26} color="#FFFFFF" />
      </TouchableOpacity>

      {/* MODAL PRINCIPAL: FORMULARIO DE BLOQUEO */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            <Text style={styles.modalTitulo}>Bloquear Horario en Agenda</Text>
            <Text style={styles.modalSubtitulo}>Evita que los pacientes agenden en este intervalo.</Text>

            <View style={styles.tabContainer}>
              <TouchableOpacity 
                style={[styles.tabButton, tipoBloqueo === 'horas' && styles.tabButtonActive]}
                onPress={() => setTipoBloqueo('horas')}
              >
                <Text style={[styles.tabButtonText, tipoBloqueo === 'horas' && styles.tabButtonTextActive]}>
                  Por Horas
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.tabButton, tipoBloqueo === 'rango' && styles.tabButtonActive]}
                onPress={() => setTipoBloqueo('rango')}
              >
                <Text style={[styles.tabButtonText, tipoBloqueo === 'rango' && styles.tabButtonTextActive]}>
                  Todo el Día / Rango
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ width: '100%' }}>
              
              <Text style={styles.label}>Fecha de Fin del Bloqueo (AAAA-MM-DD):</Text>
              
              {/* CAMPO INTERACTIVO QUE ACTÚA COMO INPUT PERO ABRE EL CALENDARIO */}
              <TouchableOpacity 
                style={styles.inputFechaFalso} 
                onPress={() => setCalendarioVisible(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.inputFechaFalsoTexto}>{fechaTexto}</Text>
                <Ionicons name="calendar" size={18} color="#9CA3AF" />
              </TouchableOpacity>

              <Text style={styles.label}>Motivo del Bloqueo:</Text>
              <TextInput
                style={styles.inputMotivo}
                placeholder="Ej. Cirugía programada, Vacaciones, Comida"
                placeholderTextColor="#9CA3AF"
                value={motivo}
                onChangeText={setMotivo}
                multiline={true}
              />

              <TouchableOpacity style={styles.botonConfirmar} onPress={procesarBloqueo}>
                <Text style={styles.botonConfirmarText}>Confirmar Bloqueo</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.botonVolver} onPress={() => setModalVisible(false)}>
                <Text style={styles.botonVolverText}>Volver</Text>
              </TouchableOpacity>

            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* DESPLEGABLE DESDE ABAJO TIPO GMAIL PARA EL CALENDARIO */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={calendarioVisible}
        onRequestClose={() => setCalendarioVisible(false)}
      >
        <View style={styles.calendarioModalOverlay}>
          <View style={styles.calendarioModalContent}>
            <View style={styles.calendarioHeaderModal}>
              <Text style={styles.calendarioModalTitulo}>Selecciona el Periodo</Text>
              <TouchableOpacity onPress={() => setCalendarioVisible(false)}>
                <Ionicons name="close-circle" size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <Calendar
              markingType={'period'}
              markedDates={periodoMarcado}
              onDayPress={manejarSeleccionDia}
              theme={{
                calendarBackground: '#FFFFFF',
                textSectionTitleColor: '#9CA3AF',
                selectedDayBackgroundColor: '#345195',
                selectedDayTextColor: '#ffffff',
                todayTextColor: '#059669',
                dayTextColor: '#1F2937',
                arrowColor: '#345195',
                monthTextColor: '#1F2937',
                textDayFontFamily: 'Montserrat',
                textMonthFontFamily: 'Montserrat',
                textDayHeaderFontFamily: 'Montserrat',
              }}
              style={styles.calendarioCard}
            />

            <TouchableOpacity 
              style={[styles.botonConfirmar, { marginTop: 10 }]} 
              onPress={() => setCalendarioVisible(false)}
            >
              <Text style={styles.botonConfirmarText}>Listo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', paddingHorizontal: 24, paddingTop: 60 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  subBrand: { fontFamily: 'Montserrat', fontSize: 13, fontWeight: '600', color: '#3FB099' },
  tituloPantalla: { fontFamily: 'Montserrat', fontSize: 26, fontWeight: '700', color: '#1F2937' },
  iconHeaderButton: { backgroundColor: '#FFFFFF', padding: 10, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  hoyLabel: { fontFamily: 'Montserrat', fontSize: 16, fontWeight: '700', color: '#345195' },
  contentPlaceholder: { flex: 1, marginTop: 10 },
  botonFlotanteCandado: { position: 'absolute', bottom: 30, right: 24, backgroundColor: '#345195', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 8 },
  
  // Estilos del Formulario principal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.4)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', backgroundColor: '#FFFFFF', borderRadius: 28, padding: 24, alignItems: 'center', maxHeight: '85%' },
  modalTitulo: { fontFamily: 'Montserrat', fontSize: 20, fontWeight: '700', color: '#1F2937', marginBottom: 4, textAlign: 'center' },
  modalSubtitulo: { fontFamily: 'Montserrat', fontSize: 13, color: '#6B7280', marginBottom: 20, textAlign: 'center' },
  tabContainer: { flexDirection: 'row', backgroundColor: '#F3F4F6', borderRadius: 12, padding: 4, marginBottom: 16, width: '100%' },
  tabButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabButtonActive: { backgroundColor: '#345195' },
  tabButtonText: { fontFamily: 'Montserrat', fontSize: 13, fontWeight: '600', color: '#6B7280' },
  tabButtonTextActive: { color: '#FFFFFF' },
  label: { fontFamily: 'Montserrat', fontSize: 13, fontWeight: '600', color: '#4B5563', marginBottom: 8, alignSelf: 'flex-start' },
  
  // El "Input" Falso para abrir calendario
  inputFechaFalso: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 14, marginBottom: 20 },
  inputFechaFalsoTexto: { fontFamily: 'Montserrat', fontSize: 14, color: '#1F2937' },
  
  inputMotivo: { width: '100%', backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 12, fontFamily: 'Montserrat', fontSize: 14, color: '#1F2937', minHeight: 80, textAlignVertical: 'top', marginBottom: 20 },
  botonConfirmar: { width: '100%', backgroundColor: '#3FB099', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 8 },
  botonConfirmarText: { fontFamily: 'Montserrat', fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  botonVolver: { width: '100%', paddingVertical: 10, alignItems: 'center' },
  botonVolverText: { fontFamily: 'Montserrat', fontSize: 14, fontWeight: '600', color: '#6B7280' },

  // Estilos del Modal secundario del Calendario (Estilo Gmail)
  calendarioModalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.3)', justifyContent: 'flex-end' },
  calendarioModalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, width: '100%', shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 },
  calendarioHeaderModal: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  calendarioModalTitulo: { fontFamily: 'Montserrat', fontSize: 16, fontWeight: '700', color: '#1F2937' },
  calendarioCard: { borderRadius: 14, borderWidth: 1, borderColor: '#E5E7EB', padding: 4, width: '100%' }
});