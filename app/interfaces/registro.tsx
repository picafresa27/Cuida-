import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';

export default function Registro() {

  // Estados
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [edad, setEdad] = useState("");
  const [genero, setGenero] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");

  // Función para crear usuario
  const crearUsuario = async () => {

    // Validaciones
    if (!nombre || !correo || !password || !telefono || !edad || !genero) {
      Alert.alert("Error", "Completa los campos obligatorios");
      return;
    }

    if (password !== confirmar) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await fetch("https://special-xylophone-695xxpjwwp45hrw74-3000.app.github.dev/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nombre,
          correo,
          telefono,
          edad,
          genero,
          password
        })
      });

      //const data = await res.json();
      const text = await res.text();
      console.log("RESPUESTA RAW:", text);

      const data = text ? JSON.parse(text) : {};

      console.log(data);
      Alert.alert("Éxito", "Usuario creado correctamente");

      router.replace({
        pathname: '/interfaces/inicioPaciente',
        params: { nombre: nombre }
      });

      // Limpiar campos
      setNombre("");
      setCorreo("");
      setTelefono("");
      setEdad("");
      setGenero("");
      setPassword("");
      setConfirmar("");

    } catch (error) {
      console.log(error);
      Alert.alert("Error", "No se pudo conectar al servidor");
    }
  };

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
        <TextInput style={styles.input} placeholder="Ejem. Edgar López" placeholderTextColor="#A0AEC0" value={nombre} onChangeText={setNombre}/>
        
        <Text style={styles.label}>Correo</Text>
        <TextInput style={styles.input} placeholder="correo@email.com" placeholderTextColor="#A0AEC0" value={correo} onChangeText={setCorreo}/>

        <Text style={styles.label}>Teléfono</Text>
        <TextInput style={styles.input} placeholder="667 123 4567" placeholderTextColor="#A0AEC0" value={telefono} onChangeText={setTelefono}/>

        <Text style={styles.label}>Edad</Text>
        <TextInput style={styles.input} placeholder="20" placeholderTextColor="#A0AEC0" value={edad} onChangeText={setEdad}/>

        <Text style={styles.label}>Género</Text>
        <TextInput style={styles.input} placeholder="Hombre/Mujer" placeholderTextColor="#A0AEC0" value={genero} onChangeText={setGenero}/>

        <Text style={styles.label}>Contraseña</Text>
        <TextInput style={styles.input} secureTextEntry placeholder="********" placeholderTextColor="#A0AEC0" value={password} onChangeText={setPassword}/>

        <Text style={styles.label}>Confirmar</Text>
        <TextInput style={styles.input} secureTextEntry placeholder="********" placeholderTextColor="#A0AEC0" value={confirmar} onChangeText={setConfirmar}/>

        {/* Botón */}
        <TouchableOpacity style={styles.button} onPress={crearUsuario}>
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