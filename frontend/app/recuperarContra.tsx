import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert, // Para cerrar el teclado al tocar fuera
    Keyboard,
    KeyboardAvoidingView, // 1. Importamos esto
    Platform,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput, // 2. Importamos esto para detectar si es iOS o Android
    TouchableWithoutFeedback,
    View
} from 'react-native';
import API_URL from '../config/api';

export default function RecuperarContraScreen() {
  const [email, setEmail] = useState('');
  const [cargando, setCargando] = useState(false);
  const router = useRouter();

  const handleEnviarInstrucciones = async () => {
    if (!email.trim()) {
      Alert.alert("Campo requerido", "Por favor, ingresa tu correo electrónico.");
      return;
    }
    setCargando(true);
    try {
      const response = await fetch(`${API_URL}/recuperarPassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: email }),
      });

      const data = await response.json();

      if (response.ok && data.ok) {
        Alert.alert(
          "¡Enviado!",
          "Se han enviado las indicaciones a tu correo electrónico.",
          [{ text: "OK", onPress: () => router.replace("/") }]
        );
      } else {
        Alert.alert("Error", data.error || "El correo ingresado no está registrado.");
      }
    } catch (error) {
      console.log("Error al conectar:", error);
      Alert.alert("Error de conexión", "No se pudo establecer comunicación con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* El KeyboardAvoidingView envuelve todo el contenido reactivo */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        {/* Esto permite que si el usuario pica en el fondo gris, el teclado se cierre solo */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            
            {/* Botón regresar */}
            <Pressable style={styles.btnRegresar} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#345195" />
            </Pressable>

            <View style={styles.content}>
              {/* Icono de Candado */}
              <View style={styles.iconContainer}>
                <Ionicons name="lock-open-outline" size={60} color="#345195" />
              </View>

              <Text style={styles.title}>Recuperar Contraseña</Text>
              <Text style={styles.subtitle}>
                Ingresa tu correo electrónico registrado para recibir las instrucciones de restauración.
              </Text>

              {/* Input de Correo */}
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Correo electrónico"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={email}
                  onChangeText={setEmail}
                  editable={!cargando}
                />
              </View>

              {/* Botón de Acción */}
              <Pressable 
                style={[styles.btnEnviar, cargando && styles.btnDeshabilitado]} 
                onPress={handleEnviarInstrucciones}
                disabled={cargando}
              >
                {cargando ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.btnTexto}>Enviar instrucciones</Text>
                )}
              </Pressable>
            </View>

          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', 
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
  },
  btnRegresar: {
    position: 'absolute',
    top: 20, // Lo bajamos un poquito considerando el nuevo contenedor interno
    left: 20,
    zIndex: 10,
    padding: 8,
  },
  content: {
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  iconContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Montserrat',
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Montserrat',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 35,
    paddingHorizontal: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 55,
    marginBottom: 25,
    width: '100%',
    elevation: 1,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Montserrat',
    color: '#1E293B',
    height: '100%',
  },
  btnEnviar: {
    backgroundColor: '#345195', 
    borderRadius: 15,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    elevation: 3,
  },
  btnDeshabilitado: {
    backgroundColor: '#94A3B8',
  },
  btnTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Montserrat',
    fontWeight: '600',
  },
});