import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function App() {
  const [metodo, setMetodo] = useState('correo');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        {/* Header */}
        <Text style={styles.logo}>Cuida+</Text>
        <Text style={styles.title}>Crear cuenta</Text>
        <Text style={styles.subtitle}>
          Completa tus datos para acceder a citas, pagos y seguimiento médico.
        </Text>

        {/* Inputs */}
        <Text style={styles.label}>Nombre completo</Text>
        <TextInput style={styles.input} placeholder="Ejem. Edgar López" placeholderTextColor="#A0AEC0"/>
        
        <Text style={styles.label}>Correo</Text>
        <TextInput style={styles.input} placeholder="correo@email.com" placeholderTextColor="#A0AEC0"/>

        <Text style={styles.label}>Teléfono</Text>
        <TextInput style={styles.input} placeholder="667 123 4567" placeholderTextColor="#A0AEC0"/>

        <Text style={styles.label}>Contraseña</Text>
        <TextInput style={styles.input} secureTextEntry placeholder="********" placeholderTextColor="#A0AEC0"/>

        <Text style={styles.label}>Confirmar</Text>
        <TextInput style={styles.input} secureTextEntry placeholder="********" placeholderTextColor="#A0AEC0"/>

        {/* Método */}
        <Text style={styles.label}>Método de registro</Text>
        <View style={styles.methodContainer}>
          <TouchableOpacity
            style={[
              styles.methodBtn,
              metodo === 'correo' && styles.methodActive
            ]}
            onPress={() => setMetodo('correo')}
          >
            <Text style={metodo === 'correo' ? styles.methodTextActive : styles.methodText}>
              Correo electrónico
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.methodBtn,
              metodo === 'telefono' && styles.methodActiveAlt
            ]}
            onPress={() => setMetodo('telefono')}
          >
            <Text style={styles.methodText}>
              Número telefónico
            </Text>
          </TouchableOpacity>
        </View>

        {/* Botón */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Crear cuenta</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8'
  },
  content: {
    padding: 20
  },
  logo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3A5BA0',
    marginBottom: 10
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold'
  },
  subtitle: {
    color: '#6b7280',
    marginBottom: 20
  },
  label: {
    marginTop: 10,
    marginBottom: 5,
    color: '#4a5568',
    fontWeight: '600'
  },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#6b7280'
  },
  methodContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 5
  },
  methodBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#E5E7EB'
  },
  methodActive: {
    backgroundColor: '#3A5BA0'
  },
  methodActiveAlt: {
    backgroundColor: '#A7D8D8'
  },
  methodText: {
    color: '#374151',
    fontWeight: '600'
  },
  methodTextActive: {
    color: '#fff',
    fontWeight: '600'
  },
  button: {
    marginTop: 25,
    backgroundColor: '#3A5BA0',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});