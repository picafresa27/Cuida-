import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { io } from "socket.io-client";
import API_URL from "../../../config/api";
import { UserContext } from "../../../context/userContext";

LocaleConfig.locales['es'] = {
  monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
  monthNamesShort: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
  dayNames: ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
  dayNamesShort: ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'],
};
LocaleConfig.defaultLocale = 'es';

// Tipado rápido para claridad del flujo
interface EventoAgenda {
  idCita?: number;
  tipo: 'bloqueo' | 'cita';
  titulo: string;
  detalle: string;
  hora?: string;
  numeroExpediente?: number;
}

export default function Agenda() {
  const navigation = useNavigation<any>();
  
  // Modales y Controles
  const [modalBloqueoVisible, setModalBloqueoVisible] = useState(false);
  const [modalCalendarioVisible, setModalCalendarioVisible] = useState(false);
  
  const [tipoBloqueo, setTipoBloqueo] = useState<'horas' | 'rango'>('rango'); 
  const [motivo, setMotivo] = useState('');
  const [fechaTextoFormulario, setFechaTextoFormulario] = useState('Seleccionar periodo');

  // Estado del Calendario Principal (Pantalla)
  const [diaSeleccionadoPantalla, setDiaSeleccionadoPantalla] = useState('2026-05-16');

  // ESTADO UNIFICADO DE EVENTOS (Bloqueos y Citas)
  const [eventosAgenda, setEventosAgenda] = useState<{[key: string]: EventoAgenda[];}>({});

  // Estado temporal para el Calendario del Formulario de Bloqueo
  const [fechaInicio, setFechaInicio] = useState<string | null>(null);
  const [fechaFin, setFechaFin] = useState<string | null>(null);
  const [periodoMarcadoFormulario, setPeriodoMarcadoFormulario] = useState<any>({});
  const [citaSeleccionada, setCitaSeleccionada] = useState<any>(null);
  const [detalleCita, setDetalleCita] = useState<any>(null);

  const { usuario } = useContext(UserContext);
  const socket = io(API_URL);

  const obtenerCitas = async () => {

  try {

    const response = await fetch(
      `${API_URL}/citas-doctor/${usuario?.id}/${diaSeleccionadoPantalla}`
    );

    const data = await response.json();

    let eventosTransformados: any = {};

    data.forEach((cita: any) => {

      if (!eventosTransformados[cita.Fecha]) {
        eventosTransformados[cita.Fecha] = [];
      }

      eventosTransformados[cita.Fecha].push({
        tipo: "cita",
  titulo: `${cita.Nombres} ${cita.Apellidos}`,
  detalle: `${cita.Estado} - ${cita.Hora}`,
  hora: cita.Hora,
  citaCompleta: cita,
  idCita: cita.IdCita,
  numeroExpediente: cita.NumeroExpediente
      });

    });

    setEventosAgenda((prev: any) => ({
      ...prev,
      ...eventosTransformados
    }));

  } catch (error) {

    console.log(error);

  }
};

const abrirDetalleCita = async (cita: any) => {

  setCitaSeleccionada(cita);

  try {

    const response = await fetch(
      `${API_URL}/detalle-cita/${cita.IdCita}`
    );

    const data = await response.json();

    setDetalleCita(data);

  } catch (error) {

    console.log(error);

  }

};

useEffect(() => {
  obtenerCitas();
}, [diaSeleccionadoPantalla]);

useEffect(() => {

  socket.on("cita-actualizada", () => {
    obtenerCitas();
  });

  socket.on("cita-cancelada", () => {
    obtenerCitas();
  });

  return () => {
    socket.off("cita-actualizada");
    socket.off("cita-cancelada");
  };

}, [diaSeleccionadoPantalla]);

const cancelarCita = async (idCita: number) => {
  try {
    const response = await fetch(
      `${API_URL}/cancelar-cita/${idCita}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      obtenerCitas();
      setCitaSeleccionada(null);
      setDetalleCita(null);
    }
  } catch (error) {
    console.log(error);
  }
};

const confirmarCancelacion = (idCita: number) => {
  Alert.alert(
    "Cancelar cita",
    "¿Estás seguro de que deseas cancelar esta cita?",
    [
      {
        text: "No",
        style: "cancel",
      },
      {
        text: "Sí, cancelar",
        style: "destructive",
        onPress: () => cancelarCita(idCita),
      },
    ]
  );
};

  // Lógica de Selección de Rango en el Formulario
  const manejarSeleccionRangoBloqueo = (dia: any) => {
    const fechaClave = dia.dateString; 

    if (!fechaInicio || (fechaInicio && fechaFin)) {
      setFechaInicio(fechaClave);
      setFechaFin(null);
      setFechaTextoFormulario(fechaClave);
      setPeriodoMarcadoFormulario({
        [fechaClave]: { startingDay: true, color: '#345195', textColor: 'white' }
      });
    } else if (fechaInicio && !fechaFin && fechaClave >= fechaInicio) {
      setFechaFin(fechaClave);
      setFechaTextoFormulario(`${fechaInicio} al ${fechaClave}`);
      
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
      setPeriodoMarcadoFormulario(marcas);
      setTimeout(() => setModalCalendarioVisible(false), 300);
    } else {
      setFechaInicio(fechaClave);
      setFechaTextoFormulario(fechaClave);
      setPeriodoMarcadoFormulario({
        [fechaClave]: { startingDay: true, color: '#345195', textColor: 'white' }
      });
    }
  };

  // Guardar los bloqueos
  const procesarBloqueo = () => {
    if (!fechaInicio) return;

    const nuevosEventos = { ...eventosAgenda };
    const motivoFinal = motivo.trim() || 'Horario Bloqueado';

    if (tipoBloqueo === 'horas' || !fechaFin) {
      nuevosEventos[fechaInicio] = [
  {
    tipo: 'bloqueo',
    titulo: 'Horario Bloqueado',
    detalle: `Motivo: ${motivoFinal}`
  }
];
    } else {
      let fechaActual = new Date(fechaInicio + 'T00:00:00');
      const fechaLimite = new Date(fechaFin + 'T00:00:00');

      while (fechaActual <= fechaLimite) {
        const stringFormateado = fechaActual.toISOString().split('T')[0];
        nuevosEventos[stringFormateado] = [
  {
    tipo: 'bloqueo',
    titulo: 'Horario Bloqueado',
    detalle: `Motivo: ${motivoFinal}`
  }
];
        fechaActual.setDate(fechaActual.getDate() + 1);
      }
    }

    setEventosAgenda(nuevosEventos);
    setModalBloqueoVisible(false);
    
    setMotivo('');
    setFechaInicio(null);
    setFechaFin(null);
    setFechaTextoFormulario('Seleccionar periodo');
    setPeriodoMarcadoFormulario({});
  };

  // Confirmación antes de borrar el bloqueo
  const solicitarConfirmacionEliminar = (fechaAEliminar: string) => {
    Alert.alert(
      "Liberar Horario",
      "¿Estás seguro de que deseas eliminar este bloqueo? Los pacientes podrán agendar citas aquí de nuevo.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive", 
          onPress: () => {
            const copiaEventos = { ...eventosAgenda };
            delete copiaEventos[fechaAEliminar];
            setEventosAgenda(copiaEventos);
          } 
        }
      ]
    );
  };

  // NOVEDAD: Construcción de marcas con Diferenciación Visual por Puntos (Dots)
  const generarMarcasCalendarioPrincipal = () => {
    let marcas: any = {};

    Object.keys(eventosAgenda).forEach((fecha) => {
      const infoEvento = eventosAgenda[fecha][0];
      
      if (infoEvento.tipo === 'bloqueo') {
        // Estilo sutil de bloqueo administrativo
        marcas[fecha] = {
          marked: true,
          dotColor: '#345195', // Punto Azul Marino (Bloqueo)
          customStyles: {
            container: { backgroundColor: '#E2E8F0', borderRadius: 8 },
            text: { color: '#345195', fontWeight: '600' }
          }
        };
      } else if (infoEvento.tipo === 'cita') {
        // Estilo fresco de cita con paciente
        marcas[fecha] = {
          marked: true,
          dotColor: '#3FB099', // Punto Verde Turquesa Cuida+ (Cita)
          customStyles: {
            container: { backgroundColor: '#E6F4F1', borderRadius: 8 },
            text: { color: '#3FB099', fontWeight: '600' }
          }
        };
      }
    });

    // Tu azul principal resalta el día enfocado por encima de todo
    marcas[diaSeleccionadoPantalla] = {
      ...marcas[diaSeleccionadoPantalla],
      selected: true,
      selectedColor: '#345195',
      textColor: '#FFFFFF'
    };

    return marcas;
  };



  const atenderPaciente = (idCita?: number, numeroExpediente?: number) => {
    navigation.navigate('registroConsulta', { cita: idCita, expediente: numeroExpediente });
  };

  //const eventoDelDiaActual = eventosAgenda[diaSeleccionadoPantalla];
  const eventosDelDiaActual = eventosAgenda[diaSeleccionadoPantalla] || [];

  return (
    <View style={styles.container}>
      
      {/* CABECERA */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.subBrand}>Cuida+ Gestión</Text>
          <Text style={styles.tituloPantalla}>Mi Agenda</Text>
        </View>
        <TouchableOpacity 
          style={styles.iconHeaderButton} 
          onPress={() => setModalBloqueoVisible(true)}
        >
          <Ionicons name="lock-closed-outline" size={22} color="#345195" />
        </TouchableOpacity>
      </View>

      {/* CALENDARIO PRINCIPAL INTERACTIVO */}
      <View style={styles.calendarioPrincipalContenedor}>
        <Calendar
          current={diaSeleccionadoPantalla}
          onDayPress={(day) => setDiaSeleccionadoPantalla(day.dateString)}
          markingType={'custom'}
          markedDates={generarMarcasCalendarioPrincipal()}
          theme={{
            calendarBackground: '#FFFFFF',
            textSectionTitleColor: '#9CA3AF',
            todayTextColor: '#3FB099',
            dayTextColor: '#1F2937',
            arrowColor: '#345195',
            monthTextColor: '#1F2937',
            textDayFontFamily: 'Montserrat',
            textMonthFontFamily: 'Montserrat',
            textDayHeaderFontFamily: 'Montserrat',
          }}
          style={styles.calendarioCardEstilo}
        />
      </View>

      {/* SECCIÓN INFERIOR: SEGUIMIENTO DE LA AGENDA */}
      <View style={styles.agendaCitasSeccion}>
        <View style={styles.subHeaderCitas}>
          <Text style={styles.citasTituloLabel}>Agenda del día</Text>
          <Text style={styles.fechaSeleccionadaLabel}>{diaSeleccionadoPantalla}</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
          {eventosDelDiaActual.length > 0 ? (

  eventosDelDiaActual.map((evento: any, index: number) => (

    evento.tipo === "bloqueo" ? (

      <View
        key={index}
        style={styles.tarjetaBloqueoActivo}
      >

        <View style={styles.tarjetaBloqueoContenidoIzquierda}>

          <View style={styles.tarjetaBloqueoHeader}>

            <Ionicons
              name="lock-closed"
              size={16}
              color="#345195"
            />

            <Text style={styles.tarjetaBloqueoTitulo}>
              {evento.titulo}
            </Text>

          </View>

          <Text style={styles.tarjetaBloqueoMotivo}>
            {evento.detalle}
          </Text>

        </View>

        <TouchableOpacity
          style={styles.botonEliminarBloqueo}
          onPress={() =>
            solicitarConfirmacionEliminar(
              diaSeleccionadoPantalla
            )
          }
        >

          <Ionicons
            name="trash-outline"
            size={18}
            color="#4B5563"
          />

        </TouchableOpacity>

      </View>

    ) : (

      <TouchableOpacity
  key={index}
  style={styles.tarjetaCitaMedica}
  onPress={() =>
    abrirDetalleCita(evento.citaCompleta)
  }
>

  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
    }}
  >

    <View style={styles.tarjetaCitaIconoContenedor}>

      <Ionicons
        name="person"
        size={18}
        color="#3FB099"
      />

    </View>

    <View
      style={{
        flex: 1,
        marginLeft: 12,
      }}
    >

      <Text style={styles.tarjetaCitaTitulo}>
        {evento.titulo}
      </Text>

      <Text style={styles.tarjetaCitaDetalle}>
        {evento.detalle}
      </Text>

    </View>

  </View>

  <TouchableOpacity
    style={styles.botonIniciarConsulta}
    onPress={() =>
      atenderPaciente(
        evento.idCita,
        evento.numeroExpediente
      )
    }
  >

    <Text style={styles.botonIniciarConsultaText}>
      Iniciar Consulta
    </Text>

    <Ionicons
      name="arrow-forward"
      size={16}
      color="#FFFFFF"
    />

  </TouchableOpacity>

</TouchableOpacity>

    )

  ))

) : (

  <View style={styles.citasVaciasContainer}>

    <Ionicons
      name="calendar-clear-outline"
      size={32}
      color="#D1D5DB"
    />

    <Text style={styles.citasVaciasTexto}>
      No hay citas programadas ni bloqueos para este día.
    </Text>

  </View>

)}
        </ScrollView>
      </View>
      
      <Modal
  visible={!!citaSeleccionada}
  animationType="slide"
  transparent={true}
  onRequestClose={() => {
    setCitaSeleccionada(null);
    setDetalleCita(null);
  }}
>

  <View style={styles.modalOverlay}>

    <View style={styles.detailModal}>

      {citaSeleccionada && (

        <>

          <Text style={styles.detailTitle}>
            {citaSeleccionada.Nombres}{" "}
            {citaSeleccionada.Apellidos}
          </Text>

          <Text style={styles.detailSubtitle}>
            {citaSeleccionada.Fecha} ·{" "}
            {citaSeleccionada.Hora}
          </Text>

          <View style={styles.detailBox}>

            <Text style={styles.detailLabel}>
              Estado
            </Text>

            <Text style={styles.detailValue}>
              {citaSeleccionada.Estado}
            </Text>

          </View>

          <View style={styles.detailBox}>

            <Text style={styles.detailLabel}>
              Consultorio
            </Text>

            <Text style={styles.detailValue}>
              {citaSeleccionada.NumeroConsultorio || "--"}
            </Text>

          </View>

          {citaSeleccionada.TipoCita === "Pasada" && (

            <>

              <Text style={styles.sectionTitle}>
                Expediente médico
              </Text>

              <View style={styles.historyItem}>

                <Text style={styles.historyDiag}>
                  Diagnóstico:
                </Text>

                <Text style={styles.historyDiag}>
                  {detalleCita?.Diagnostico ||
                    "Sin diagnóstico"}
                </Text>

                <Text style={styles.historyDiag}>
                  Tratamiento:
                </Text>

                <Text style={styles.historyDiag}>
                  {detalleCita?.Tratamiento ||
                    "Sin tratamiento"}
                </Text>

                <Text style={styles.historyDiag}>
                  Observaciones:
                </Text>

                <Text style={styles.historyDiag}>
                  {detalleCita?.Observaciones ||
                    "Sin observaciones"}
                </Text>

              </View>

            </>

          )}

          {citaSeleccionada.TipoCita !== "Pasada" && (

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => confirmarCancelacion(citaSeleccionada.IdCita)}
            >

              <Text style={styles.cancelButtonText}>
                Cancelar cita
              </Text>

            </TouchableOpacity>

          )}

          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => {

              setCitaSeleccionada(null);

              setDetalleCita(null);

            }}
          >

            <Text style={styles.closeBtnText}>
              Cerrar
            </Text>

          </TouchableOpacity>

        </>

      )}

    </View>

  </View>

</Modal>

      {/* MODAL PRINCIPAL: FORMULARIO DE BLOQUEO */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalBloqueoVisible}
        onRequestClose={() => setModalBloqueoVisible(false)}
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
              
              <Text style={styles.label}>Periodo del Bloqueo:</Text>
              
              <TouchableOpacity 
                style={styles.inputFechaFalso} 
                onPress={() => setModalCalendarioVisible(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.inputFechaFalsoTexto}>{fechaTextoFormulario}</Text>
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

              <TouchableOpacity style={styles.botonVolver} onPress={() => setModalBloqueoVisible(false)}>
                <Text style={styles.botonVolverText}>Volver</Text>
              </TouchableOpacity>

            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* MODAL INTERNO: SELECTOR DE RANGOS */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalCalendarioVisible}
        onRequestClose={() => setModalCalendarioVisible(false)}
      >
        <View style={styles.calendarioModalOverlay}>
          <View style={styles.calendarioModalContent}>
            <View style={styles.calendarioHeaderModal}>
              <Text style={styles.calendarioModalTitulo}>Selecciona el Intervalo</Text>
              <TouchableOpacity onPress={() => setModalCalendarioVisible(false)}>
                <Ionicons name="close-circle" size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <Calendar
              markingType={'period'}
              markedDates={periodoMarcadoFormulario}
              onDayPress={manejarSeleccionRangoBloqueo}
              theme={{
                calendarBackground: '#FFFFFF',
                textSectionTitleColor: '#9CA3AF',
                selectedDayBackgroundColor: '#345195',
                selectedDayTextColor: '#ffffff',
                todayTextColor: '#3FB099',
                dayTextColor: '#1F2937',
                arrowColor: '#345195',
                monthTextColor: '#1F2937',
                textDayFontFamily: 'Montserrat',
                textMonthFontFamily: 'Montserrat',
                textDayHeaderFontFamily: 'Montserrat',
              }}
              style={styles.calendarioCardFormulario}
            />

            <TouchableOpacity 
              style={[styles.botonConfirmar, { marginTop: 16 }]} 
              onPress={() => setModalCalendarioVisible(false)}
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
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  subBrand: { fontFamily: 'Montserrat', fontSize: 13, fontWeight: '600', color: '#3FB099' },
  tituloPantalla: { fontFamily: 'Montserrat', fontSize: 26, fontWeight: '700', color: '#1F2937' },
  iconHeaderButton: { backgroundColor: '#FFFFFF', padding: 11, borderRadius: 14, borderWidth: 1, borderColor: '#E5E7EB', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  
  calendarioPrincipalContenedor: { width: '100%', marginBottom: 16 },
  calendarioCardEstilo: { borderRadius: 18, padding: 8, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  
  agendaCitasSeccion: { flex: 1, marginTop: 4 },
  subHeaderCitas: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingHorizontal: 2 },
  citasTituloLabel: { fontFamily: 'Montserrat', fontSize: 16, fontWeight: '700', color: '#1F2937' },
  fechaSeleccionadaLabel: { fontFamily: 'Montserrat', fontSize: 13, fontWeight: '600', color: '#345195', backgroundColor: '#E2E8F0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  
  citasVaciasContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 36, backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', borderStyle: 'dashed', marginTop: 4 },
  citasVaciasTexto: { fontFamily: 'Montserrat', fontSize: 13, color: '#9CA3AF', textAlign: 'center', marginTop: 10, paddingHorizontal: 32, lineHeight: 18 },

  // Tarjeta Bloqueo
  tarjetaBloqueoActivo: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 16, padding: 16, marginTop: 4, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tarjetaBloqueoContenidoIzquierda: { flex: 1, paddingRight: 8 },
  tarjetaBloqueoHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  tarjetaBloqueoTitulo: { fontFamily: 'Montserrat', fontSize: 15, fontWeight: '700', color: '#345195', marginLeft: 8 },
  tarjetaBloqueoMotivo: { fontFamily: 'Montserrat', fontSize: 13, color: '#4B5563', lineHeight: 18 },
  botonEliminarBloqueo: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },

  // NUEVO: Tarjeta Cita Médica (Identidad Cuida+)
  tarjetaCitaMedica: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 16, padding: 16, marginTop: 4, flexDirection: 'column', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.02, shadowRadius: 2, elevation: 1 },
  tarjetaCitaIconoContenedor: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#E6F4F1', justifyContent: 'center', alignItems: 'center' },
  tarjetaCitaTitulo: { fontFamily: 'Montserrat', fontSize: 15, fontWeight: '700', color: '#1F2937' },
  tarjetaCitaDetalle: { fontFamily: 'Montserrat', fontSize: 13, color: '#6B7280', marginTop: 2 },

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
  inputFechaFalso: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 14, marginBottom: 20 },
  inputFechaFalsoTexto: { fontFamily: 'Montserrat', fontSize: 14, color: '#1F2937' },
  inputMotivo: { width: '100%', backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 12, fontFamily: 'Montserrat', fontSize: 14, color: '#1F2937', minHeight: 80, textAlignVertical: 'top', marginBottom: 20 },
  botonConfirmar: { width: '100%', backgroundColor: '#3FB099', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 8 },
  botonConfirmarText: { fontFamily: 'Montserrat', fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  botonVolver: { width: '100%', paddingVertical: 10, alignItems: 'center' },
  botonVolverText: { fontFamily: 'Montserrat', fontSize: 14, fontWeight: '600', color: '#6B7280' },
botonIniciarConsulta: { backgroundColor: '#3FB099', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 10, marginTop: 12 },
  botonIniciarConsultaText: { fontFamily: 'Montserrat', fontSize: 14, fontWeight: '700', color: '#FFFFFF', marginRight: 4 },
  calendarioModalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.3)', justifyContent: 'flex-end' },
  calendarioModalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, width: '100%', shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 },
  calendarioHeaderModal: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  calendarioModalTitulo: { fontFamily: 'Montserrat', fontSize: 16, fontWeight: '700', color: '#1F2937' },
  calendarioCardFormulario: { borderRadius: 14, borderWidth: 1, borderColor: '#E5E7EB', padding: 4, width: '100%' },
  detailModal: {
  backgroundColor: "#FFF",
  borderRadius: 20,
  padding: 20,
},

detailTitle: {
  fontSize: 22,
  fontWeight: "bold",
  color: "#1A202C",
},

detailSubtitle: {
  color: "#718096",
  marginBottom: 20,
},

detailBox: {
  marginBottom: 15,
},

detailLabel: {
  fontWeight: "bold",
  color: "#345195",
},

detailValue: {
  color: "#2D3748",
  marginTop: 3,
},

cancelButton: {
  backgroundColor: "#E53E3E",
  paddingVertical: 15,
  borderRadius: 12,
  alignItems: "center",
  marginTop: 20,
},

cancelButtonText: {
  color: "#FFF",
  fontWeight: "bold",
},

sectionTitle: {
  fontSize: 18,
  fontWeight: "bold",
  color: "#1A202C",
  marginTop: 15,
  marginBottom: 10,
},

historyItem: {
  backgroundColor: "#F7FAFC",
  padding: 15,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: "#E2E8F0",
  marginBottom: 10,
},

historyDiag: {
  fontSize: 14,
  color: "#2D3748",
  marginBottom: 6,
  lineHeight: 20,
},

closeBtn: {
  backgroundColor: "#718096",
  paddingVertical: 12,
  borderRadius: 12,
  alignItems: "center",
  marginTop: 10,
},

closeBtnText: {
  color: "#FFF",
  fontWeight: "bold",
  fontSize: 14,
},
});