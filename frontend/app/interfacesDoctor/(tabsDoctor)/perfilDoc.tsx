import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// IMPORTACIÓN DE TU CONTEXTO REAL DE CUIDA+
import API_URL from "../../../config/api";
import { UserContext } from "../../../context/userContext";

export default function ConsultoriosYDatosScreen() {
  const router = useRouter();
  
  // 1. EXTRAEMOS EL USUARIO Y EL SETTER DEL CONTEXTO REAL
  const { usuario: usuarioData, setUsuario } = useContext(UserContext); 
  const usuario = usuarioData as any; 
  
  // Estado para controlar qué pestaña está activa
  const [pestanaActiva, setPestanaActiva] = useState<'datos' | 'renta'>('datos');

  // 🔥 NUEVO ESTADO: Controla si el usuario está en modo edición o lectura
  const [editando, setEditando] = useState(false);

  // Estados del Formulario
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [instagram, setInstagram] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [cargandoImagen, setCargandoImagen] = useState(false); 

  // Función reutilizable para mapear/restaurar los datos originales del contexto
  const restaurarDatosOriginales = () => {
    if (usuario) {
      const nombreCompleto = `Dr. ${usuario.nombres || ''} ${usuario.apellidos || ''}`.trim();
      setNombre(nombreCompleto);
      setDescripcion(usuario.descripcion || '');
      setInstagram(usuario.instagram || '');
      setTiktok(usuario.tiktok || '');
    }
  };

  // 2. SINCRONIZACIÓN AUTOMÁTICA AL CARGAR
  useEffect(() => {
    restaurarDatosOriginales();
  }, [usuario]); 

  // SUBIR IMAGEN A CLOUDINARY (Solo permitida si está editando)
  const seleccionarImagen = async () => {
    if (!editando) return; // Protegemos el avatar si no está en modo edición

    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permiso.granted) {
      Alert.alert("Permiso denegado", "Necesitamos acceso a tus fotos para cambiar la imagen de perfil.");
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (resultado.canceled) return;

    const imagen = resultado.assets[0];
    const formData = new FormData();

    formData.append('file', {
      uri: imagen.uri,
      type: 'image/jpeg',
      name: 'perfil_doctor.jpg',
    } as any);

    formData.append('upload_preset', 'cuida+');

    try {
      setCargandoImagen(true); 

      const resCloudinary = await fetch(
        "https://api.cloudinary.com/v1_1/dji2j4zdz/image/upload",
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await resCloudinary.json();

      if (!data.secure_url) {
        Alert.alert("Error", "Cloudinary no devolvió la URL de la imagen.");
        setCargandoImagen(false);
        return;
      }

      console.log("URL CLOUDINARY DOCTOR:", data.secure_url);

      const resBackend = await fetch(
        `${API_URL}/actualizarFotoDoctor`, 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idDoctor: usuario?.id, 
            fotoPerfil: data.secure_url,
          }),
        }
      );
      
      if (resBackend.ok) {
        console.log(resBackend);
        if (setUsuario) {
          setUsuario({
            ...usuario,
            fotoPerfil: data.secure_url
          });
        }
        Alert.alert("Éxito", "Tu foto de perfil ha sido actualizada.");
      } else {
        Alert.alert("Error", "No se pudo actualizar la foto en el servidor principal.");
      }

    } catch (error) {
      console.log("ID DOCTOR:", usuario?.id);
      console.log("ERROR SUBIDA FOTO DOCTOR:", error);
      Alert.alert("Error", "Ocurrió un fallo al intentar subir la imagen.");
    } finally {
      setCargandoImagen(false); 
    }
  };

  // Guardar cambios y cerrar modo edición
  const manejarGuardarCambios = () => {
    // Aquí puedes meter tu fetch real al backend para actualizar texto si lo requieres
    Alert.alert(
      "Perfil Actualizado", 
      "Los cambios en tu perfil público han sido vinculados a tu cuenta de Cuida+.",
      [{ 
        text: "Entendido",
        onPress: () => setEditando(false) // Volvemos al modo lectura
      }]
    );
  };

  // Cancelar edición y revertir cambios locales
  const manejarCancelarEdicion = () => {
    restaurarDatosOriginales(); // Revertimos los inputs al estado original del contexto
    setEditando(false); // Salimos del modo edición
  };

  if (!usuario) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#345195" />
        <Text style={{ marginTop: 10, fontFamily: 'Montserrat', color: '#64748B' }}>Cargando perfil...</Text>
      </SafeAreaView>
    );
  }

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

      {/* Selector de Pestañas Superiores */}
      <View style={styles.tabSegmentContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, pestanaActiva === 'datos' && styles.tabButtonActive]}
          onPress={() => setPestanaActiva('datos')}
        >
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
          <View style={{ gap: 20 }}>
            
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeaderRow}>
                <Ionicons name="create-outline" size={18} color="#345195" />
                <Text style={styles.sectionBlockTitle}>Perfil Público</Text>
              </View>
              <Text style={styles.sectionSubtitle}>Esta información será visible para tus pacientes en Cuida+.</Text>

              {/* Contenedor de Foto de Perfil Dinámica */}
              <View style={styles.avatarContainerShadow}>
                <TouchableOpacity 
                  style={[styles.avatarPlaceholder, !editando && { opacity: 0.8 }]} 
                  onPress={seleccionarImagen} 
                  disabled={cargandoImagen || !editando} // Bloqueada si no está editando
                  activeOpacity={0.8}
                >
                  {cargandoImagen ? (
                    <ActivityIndicator size="small" color="#345195" />
                  ) : usuario?.fotoPerfil ? (
                    <Image source={{ uri: usuario.fotoPerfil }} style={styles.avatarImage} />
                  ) : (
                    <Ionicons name="person" size={40} color="#94A3B8" />
                  )}
                  
                  {/* El indicador de la cámara sólo resalta si está en edición */}
                  <View style={[styles.badgeEditPhoto, { backgroundColor: editando ? '#3FB099' : '#94A3B8' }]}>
                    <Ionicons name={editando ? "camera" : "lock-closed"} size={12} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>
                <Text style={styles.avatarHelpText}>
                  {editando ? "Toca la foto para cambiarla" : "Modo lectura activo"}
                </Text>
              </View>

              {/* Input: Nombre */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nombre Comercial / Profesional</Text>
                <View style={[styles.inputIconWrapper, !editando && styles.inputWrapperDisabled]}>
                  <Ionicons name="person-outline" size={16} color="#64748B" style={styles.inputContextIcon} />
                  <TextInput 
                    style={[styles.inputEditable, !editando && styles.inputTextDisabled]} 
                    value={nombre} 
                    onChangeText={setNombre} 
                    placeholder="Ej. Dr. Juan Pérez"
                    editable={editando} // 🔥 CONTROLADO POR ESTADO
                  />
                </View>
              </View>

              {/* Input: Descripción */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Breve Descripción Profesional</Text>
                <TextInput 
                  style={[
                    styles.inputEditable, 
                    styles.textAreaEditable, 
                    !editando && styles.inputWrapperDisabled,
                    !editando && styles.inputTextDisabled
                  ]} 
                  value={descripcion} 
                  onChangeText={setDescripcion} 
                  multiline={true}
                  numberOfLines={4}
                  placeholder="Cuéntale a tus pacientes sobre tu enfoque o trayectoria médica..."
                  textAlignVertical="top"
                  editable={editando} // 🔥 CONTROLADO POR ESTADO
                />
              </View>

              {/* Inputs: Redes Sociales */}
              <Text style={[styles.inputLabel, { marginTop: 4, marginBottom: 8 }]}>Redes Sociales</Text>
              
              <View style={styles.socialInputRow}>
                <View style={[styles.inputIconWrapper, { flex: 1 }, !editando && styles.inputWrapperDisabled]}>
                  <Ionicons name="logo-instagram" size={16} color={editando ? "#E1306C" : "#94A3B8"} style={styles.inputContextIcon} />
                  <TextInput 
                    style={[styles.inputEditable, !editando && styles.inputTextDisabled]} 
                    value={instagram} 
                    onChangeText={setInstagram} 
                    placeholder="@tu.usuario"
                    autoCapitalize="none"
                    editable={editando} // 🔥 CONTROLADO POR ESTADO
                  />
                </View>
              </View>

              <View style={[styles.socialInputRow, { marginTop: 10 }]}>
                <View style={[styles.inputIconWrapper, { flex: 1 }, !editando && styles.inputWrapperDisabled]}>
                  <Ionicons name="logo-tiktok" size={16} color={editando ? "#000000" : "#94A3B8"} style={styles.inputContextIcon} />
                  <TextInput 
                    style={[styles.inputEditable, !editando && styles.inputTextDisabled]} 
                    value={tiktok} 
                    onChangeText={setTiktok} 
                    placeholder="@tu.medicina"
                    autoCapitalize="none"
                    editable={editando} // 🔥 CONTROLADO POR ESTADO
                  />
                </View>
              </View>

              {/* 🔥 SECCIÓN DE BOTONES DINÁMICOS */}
              {!editando ? (
                // Botón único para activar la edición
                <TouchableOpacity 
                  style={styles.btnEditarPerfil} 
                  activeOpacity={0.8}
                  onPress={() => setEditando(true)}
                >
                  <Ionicons name="create-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.btnGuardarPerfilText}>Editar Perfil Público</Text>
                </TouchableOpacity>
              ) : (
                // Fila de botones cuando está editando (Guardar y Cancelar)
                <View style={styles.actionButtonsRow}>
                  <TouchableOpacity 
                    style={styles.btnCancelarPerfil} 
                    activeOpacity={0.8}
                    onPress={manejarCancelarEdicion}
                  >
                    <Text style={styles.btnCancelarPerfilText}>Cancelar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.btnGuardarPerfilDinámico} 
                    activeOpacity={0.8}
                    onPress={manejarGuardarCambios}
                  >
                    <Text style={styles.btnGuardarPerfilText}>Guardar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* SECCIÓN BLOQUEADA: DATOS VERIFICADOS */}
            <View style={[styles.sectionContainer, styles.sectionReadOnlyBorder]}>
              <View style={styles.sectionHeaderRow}>
                <Ionicons name="lock-closed" size={16} color="#64748B" />
                <Text style={[styles.sectionBlockTitle, { color: '#475569' }]}>Datos Verificados</Text>
                <View style={styles.adminBadge}>
                  <Text style={styles.adminBadgeText}>Administrador</Text>
                </View>
              </View>
              <Text style={styles.sectionSubtitle}>Información oficial e institucional regulada. Para modificaciones, contacta a soporte.</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Cédula Profesional</Text>
                <TextInput style={styles.inputReadOnly} value={usuario?.cedula || "No registrada"} editable={false} />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Especialidad Médica</Text>
                <TextInput style={styles.inputReadOnly} value={usuario?.especialidad || "No registrada"} editable={false} />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Institución de Egreso</Text>
                <TextInput style={styles.inputReadOnly} value={usuario?.egreso || "No registrada"} editable={false} />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Correo de Contacto</Text>
                <TextInput style={styles.inputReadOnly} value={usuario?.correo || "No registrado"} editable={false} />
              </View>
            </View>

          </View>
        )}

        {/* ================= CONTENIDO: CONSULTORIO Y RENTAS ================= */}
        {pestanaActiva === 'renta' && (
          <View>
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
  
  tabSegmentContainer: { flexDirection: 'row', backgroundColor: '#E2E8F0', padding: 4, borderRadius: 12, marginHorizontal: 20, marginTop: 15 },
  tabButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 10 },
  tabButtonActive: { backgroundColor: '#345195' },
  tabButtonText: { marginLeft: 6, fontSize: 13, fontFamily: 'Montserrat', fontWeight: '600', color: '#64748B' },
  tabButtonTextActive: { color: '#FFFFFF' },

  sectionContainer: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0' },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  sectionBlockTitle: { fontSize: 15, fontFamily: 'Montserrat', fontWeight: '700', color: '#345195', marginLeft: 8 },
  sectionReadOnlyBorder: { backgroundColor: '#FAFAFA', borderColor: '#E2E8F0', borderStyle: 'dashed' },
  adminBadge: { marginLeft: 'auto', backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, borderWidth: 1, borderColor: '#E2E8F0' },
  adminBadgeText: { fontSize: 10, fontFamily: 'Montserrat', fontWeight: '600', color: '#64748B' },
  sectionSubtitle: { fontSize: 12, fontFamily: 'Montserrat', color: '#64748B', marginBottom: 18, lineHeight: 16 },
  
  avatarContainerShadow: { alignItems: 'center', marginBottom: 20 },
  avatarPlaceholder: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#CBD5E1', justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden' },
  avatarImage: { width: '100%', height: '100%', borderRadius: 40 },
  badgeEditPhoto: { position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFFFFF', zIndex: 10 },
  avatarHelpText: { fontSize: 11, fontFamily: 'Montserrat', color: '#94A3B8', marginTop: 8 },

  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 13, fontFamily: 'Montserrat', fontWeight: '600', color: '#475569', marginBottom: 6 },
  inputIconWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 10, paddingHorizontal: 12 },
  inputWrapperDisabled: { backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' },
  inputContextIcon: { marginRight: 8 },
  inputEditable: { flex: 1, paddingVertical: 10, fontSize: 14, fontFamily: 'Montserrat', color: '#1E293B' },
  inputTextDisabled: { color: '#64748B' },
  textAreaEditable: { minHeight: 80, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
  socialInputRow: { flexDirection: 'row', alignItems: 'center' },
  inputReadOnly: { backgroundColor: '#F1F5F9', padding: 12, borderRadius: 10, fontSize: 14, fontFamily: 'Montserrat', color: '#1E293B', borderWidth: 1, borderColor: '#E2E8F0' },
  
  // ESTILOS DE LOS BOTONES DINÁMICOS
  btnEditarPerfil: { backgroundColor: '#345195', paddingVertical: 13, borderRadius: 12, alignItems: 'center', marginTop: 10, flexDirection: 'row', justifyContent: 'center' },
  actionButtonsRow: { flexDirection: 'row', gap: 12, marginTop: 10 },
  btnCancelarPerfil: { flex: 1, backgroundColor: '#F1F5F9', paddingVertical: 13, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#CBD5E1' },
  btnCancelarPerfilText: { fontSize: 14, fontFamily: 'Montserrat', fontWeight: '700', color: '#475569' },
  btnGuardarPerfilDinámico: { flex: 2, backgroundColor: '#3FB099', paddingVertical: 13, borderRadius: 12, alignItems: 'center' },
  btnGuardarPerfilText: { fontSize: 14, fontFamily: 'Montserrat', fontWeight: '700', color: '#FFFFFF' },

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