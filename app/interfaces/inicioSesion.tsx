import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  // Estados para guardar lo que el usuario escribe
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      {/* KeyboardAvoidingView evita que el teclado tape los inputs al escribir */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          {/* Logo */}
          <Image 
            source={require('../img/logo_cuida+.jpg')} 
            style={styles.logo}
            resizeMode="contain"
          />

          {/* Encabezado */}
          <Text style={styles.titulo}>Iniciar sesión</Text>
          <Text style={styles.subtitulo}>
            Accede a tu cuenta para gestionar citas, consultas y seguimiento médico.
          </Text>

          {/* Formulario */}
          <View style={styles.form}>
            
            {/* Input Correo */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Correo electrónico</Text>
              <TextInput 
                style={styles.input}
                placeholder="example@gmail.com"
                placeholderTextColor="#A0AEC0"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Input Contraseña */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contraseña</Text>
              <TextInput 
                style={styles.input}
                placeholder=".........."
                placeholderTextColor="#A0AEC0"
                secureTextEntry={true} // Oculta el texto con bolitas
                value={password}
                onChangeText={setPassword}
              />
            </View>

            {/* Botones */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.botonPrimario}>
                <Text style={styles.textoBlanco}>Entrar</Text>
              </TouchableOpacity>

              {/* Enlace a la otra pantalla si ya tienes el archivo registro.tsx */}
              {/*@ts-ignore*/}
              <Link href="/interfaces/registro" asChild>
                <TouchableOpacity style={styles.botonSecundario}>
                  <Text style={styles.textoAzul}>Crear cuenta</Text>
                </TouchableOpacity>
              </Link>
            </View>

            {/* Link de Olvidé contraseña */}
            <TouchableOpacity style={styles.forgotPass}>
              <Text style={styles.textoForgot}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Blanco puro
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 10,
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A202C',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 35,
    paddingHorizontal: 10,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#2D3748',
  },
  buttonContainer: {
    marginTop: 10,
    gap: 15,
  },
  botonPrimario: {
    backgroundColor: '#345195', // Azul Cuida+
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  botonSecundario: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  textoBlanco: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  textoAzul: {
    color: '#2D3748',
    fontSize: 18,
    fontWeight: '700',
  },
  forgotPass: {
    marginTop: 30,
    alignItems: 'center',
  },
  textoForgot: {
    color: '#41A69A', // El verde turquesa de tu logo para el link
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});