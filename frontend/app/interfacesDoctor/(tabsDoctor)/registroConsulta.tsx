import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegistroConsulta() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const [formulario, setFormulario] = useState({
    Motivo: '',
    Peso: '',
    Estatura: '',
    Presion: '',
    Temperatura: '',
    FrecuenciaCardiaca: '',
    FrecuenciaRespiratoria: '',
    Sintomas: '',
    ExploracionFisica: '',
    Diagnostico: '',
    Pronostico: '',
    Medicamentos: '',
    Dosis: '',
    IdCita: route.params?.cita || 0,
    NumeroExpediente: route.params?.expediente || 0
  });

  const handleChange = (name: string, value: string) => {
    setFormulario({ ...formulario, [name]: value });
  };

  const guardarConsulta = () => {
    Alert.alert('Éxito', 'Consulta guardada correctamente', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Registro NOM-004</Text>
        <View style={{ width: 24 }} />
      </View>

      <Text style={styles.seccionTitulo}>Datos Básicos</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Motivo de consulta" 
        value={formulario.Motivo} 
        onChangeText={(t) => handleChange('Motivo', t)} 
      />

      <Text style={styles.seccionTitulo}>Signos Vitales</Text>
      <View style={styles.row}>
        <TextInput style={[styles.input, styles.halfInput]} placeholder="Peso (kg)" keyboardType="numeric" value={formulario.Peso} onChangeText={(t) => handleChange('Peso', t)} />
        <TextInput style={[styles.input, styles.halfInput]} placeholder="Estatura (m)" keyboardType="numeric" value={formulario.Estatura} onChangeText={(t) => handleChange('Estatura', t)} />
      </View>
      <View style={styles.row}>
        <TextInput style={[styles.input, styles.halfInput]} placeholder="Temp (°C)" keyboardType="numeric" value={formulario.Temperatura} onChangeText={(t) => handleChange('Temperatura', t)} />
        <TextInput style={[styles.input, styles.halfInput]} placeholder="Presión (120/80)" value={formulario.Presion} onChangeText={(t) => handleChange('Presion', t)} />
      </View>
      <View style={styles.row}>
        <TextInput style={[styles.input, styles.halfInput]} placeholder="Frec. Cardíaca" keyboardType="numeric" value={formulario.FrecuenciaCardiaca} onChangeText={(t) => handleChange('FrecuenciaCardiaca', t)} />
        <TextInput style={[styles.input, styles.halfInput]} placeholder="Frec. Respiratoria" keyboardType="numeric" value={formulario.FrecuenciaRespiratoria} onChangeText={(t) => handleChange('FrecuenciaRespiratoria', t)} />
      </View>

      <Text style={styles.seccionTitulo}>Evaluación Clínica</Text>
      <TextInput style={styles.textArea} placeholder="Síntomas" multiline value={formulario.Sintomas} onChangeText={(t) => handleChange('Sintomas', t)} />
      <TextInput style={styles.textArea} placeholder="Exploración Física" multiline value={formulario.ExploracionFisica} onChangeText={(t) => handleChange('ExploracionFisica', t)} />
      <TextInput style={styles.textArea} placeholder="Diagnóstico" multiline value={formulario.Diagnostico} onChangeText={(t) => handleChange('Diagnostico', t)} />
      <TextInput style={styles.input} placeholder="Pronóstico" value={formulario.Pronostico} onChangeText={(t) => handleChange('Pronostico', t)} />

      <Text style={styles.seccionTitulo}>Receta Médica</Text>
      <TextInput style={styles.textArea} placeholder="Medicamentos" multiline value={formulario.Medicamentos} onChangeText={(t) => handleChange('Medicamentos', t)} />
      <TextInput style={styles.input} placeholder="Indicaciones y Dosis" value={formulario.Dosis} onChangeText={(t) => handleChange('Dosis', t)} />

      <TouchableOpacity style={styles.botonGuardar} onPress={guardarConsulta}>
        <Text style={styles.botonTexto}>Finalizar Consulta</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', paddingHorizontal: 20, paddingTop: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  titulo: { fontSize: 20, fontWeight: '700', color: '#1F2937' },
  seccionTitulo: { fontSize: 16, fontWeight: '700', color: '#345195', marginTop: 15, marginBottom: 10 },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, padding: 12, marginBottom: 12, fontSize: 14 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  halfInput: { width: '48%' },
  textArea: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, padding: 12, marginBottom: 12, fontSize: 14, minHeight: 80, textAlignVertical: 'top' },
  botonGuardar: { backgroundColor: '#3FB099', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  botonTexto: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' }
});