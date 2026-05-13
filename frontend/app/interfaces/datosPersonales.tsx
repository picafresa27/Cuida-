import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView, Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View
} from "react-native";
import { UserContext } from "../../context/userContext";

export default function DatosPersonales() {
  const router = useRouter();
  const { usuario, setUsuario } = useContext(UserContext);
  
  const [editando, setEditando] = useState(false);
  const [verPassword, setVerPassword] = useState(false);

  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (usuario) {
      const u = usuario as any;
      setNombre(u.nombres || u.Nombres || "");
      setApellidos(u.apellidos || u.Apellidos || "");
      setTelefono(u.telefono || u.Telefono || "");
      setCorreo(u.correo || u.Correo || "");
      setPassword(u.password || u.Password || "");
    }
  }, [usuario]);

  // --- LÓGICA DE NAVEGACIÓN CORREGIDA ---
  const volverAlPerfil = () => {
    // Forzamos la redirección a la pestaña de perfil para evitar bucles
    router.replace("/(tabs)/perfil"); 
  };

  const seleccionarImagen = async () => {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permiso.granted) {
      Alert.alert("Permiso denegado", "Necesitamos acceso a tus fotos.");
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (resultado.canceled) return;

    const imagen = resultado.assets[0];
    const formData = new FormData();
    formData.append('file', {
      uri: imagen.uri,
      type: 'image/jpeg',
      name: 'perfil.jpg',
    } as any);
    formData.append('upload_preset', 'cuida+');

    try {
      const resCloudinary = await fetch('https://fuzzy-doodle-wr5qq4wjqwqg35jqx-3000.app.github.dev/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await resCloudinary.json();

      if (data.secure_url) {
        const resBackend = await fetch('https://fuzzy-doodle-wr5qq4wjqwqg35jqx-3000.app.github.dev/actualizarFotoPerfil', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            idPaciente: usuario?.id,
            fotoPerfil: data.secure_url,
          }),
        });

        if (resBackend.ok) {
          setUsuario({ ...usuario!, fotoPerfil: data.secure_url });
          Alert.alert("Éxito", "Foto de perfil actualizada.");
        }
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo subir la imagen.");
    }
  };

  const guardarCambiosTexto = async () => {
    try {
      const u = usuario as any;
      const URL = `https://fuzzy-doodle-wr5qq4wjqwqg35jqx-3000.app.github.dev/actualizar-perfil/${u.id || u.IdPaciente}`;
      
      const res = await fetch(URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, apellidos, telefono, correo, password }),
      });

      if (res.ok) {
        setUsuario({ ...usuario, nombres: nombre, apellidos, telefono, correo, password } as any);
        setEditando(false);
        Alert.alert("Éxito", "Datos actualizados.");
      } else {
        Alert.alert("Error", "No se pudieron guardar los cambios.");
      }
    } catch (error) {
      Alert.alert("Error", "Problema de conexión.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <TouchableOpacity style={styles.backButton} onPress={volverAlPerfil}>
            <Ionicons name="arrow-back" size={26} color="#345195" />
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarPlaceholder}>
                {usuario?.fotoPerfil ? (
                  <Image source={{ uri: usuario.fotoPerfil }} style={styles.avatarImage}/>
                ) : (
                  <Ionicons name="person" size={50} color="#345195" />
                )}
              </View>
              <Pressable style={styles.editBadge} onPress={seleccionarImagen}>
                <Ionicons name="camera" size={18} color="white" />
              </Pressable>
            </View>
            <Text style={styles.title}>Datos Personales</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Nombre(s)</Text>
            <TextInput style={[styles.input, !editando && styles.disabled]} value={nombre} onChangeText={setNombre} editable={editando} />

            <Text style={styles.label}>Apellidos</Text>
            <TextInput style={[styles.input, !editando && styles.disabled]} value={apellidos} onChangeText={setApellidos} editable={editando} />

            <Text style={styles.label}>Correo Electrónico</Text>
            <TextInput style={[styles.input, !editando && styles.disabled]} value={correo} onChangeText={setCorreo} editable={editando} autoCapitalize="none" />

            <Text style={styles.label}>Teléfono</Text>
            <TextInput style={[styles.input, !editando && styles.disabled]} value={telefono} onChangeText={setTelefono} editable={editando} keyboardType="numeric" />

            <Text style={styles.label}>Contraseña</Text>
            <View style={[styles.passWrapper, !editando && styles.disabled]}>
              <TextInput 
                style={{ flex: 1, fontSize: 16 }} 
                value={password} 
                onChangeText={setPassword} 
                editable={editando} 
                secureTextEntry={!verPassword} 
              />
              <TouchableOpacity onPress={() => setVerPassword(!verPassword)}>
                <Ionicons name={verPassword ? "eye-off" : "eye"} size={20} color="#A0AEC0" />
              </TouchableOpacity>
            </View>
          </View>

          {!editando ? (
            <TouchableOpacity style={styles.btnPrimary} onPress={() => setEditando(true)}>
              <Text style={styles.btnText}>Modificar Datos</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.row}>
              <TouchableOpacity style={[styles.btn, styles.btnSave]} onPress={guardarCambiosTexto}>
                <Text style={styles.btnText}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.btnCancel]} onPress={() => setEditando(false)}>
                <Text style={styles.btnText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  scrollContent: { padding: 25 },
  backButton: { marginTop: 40, marginBottom: 10 },
  header: { alignItems: 'center', marginBottom: 30 },
  avatarContainer: { position: 'relative', marginBottom: 15 },
  avatarPlaceholder: { width: 110, height: 110, borderRadius: 55, backgroundColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#345195' },
  avatarImage: { width: '100%', height: '100%', borderRadius: 55 },
  editBadge: { position: 'absolute', bottom: 5, right: 5, backgroundColor: '#345195', width: 34, height: 34, borderRadius: 17, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'white' },
  title: { fontSize: 24, fontWeight: "bold", color: "#345195" },
  form: { marginBottom: 20 },
  label: { fontSize: 12, fontWeight: "700", color: "#4A5568", marginBottom: 5, textTransform: 'uppercase' },
  input: { backgroundColor: "#FFF", padding: 15, borderRadius: 12, borderWidth: 1, borderColor: "#E2E8F0", marginBottom: 15, fontSize: 16 },
  disabled: { backgroundColor: "#EDF2F7", color: "#718096" },
  passWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: "#FFF", paddingHorizontal: 15, borderRadius: 12, borderWidth: 1, borderColor: "#E2E8F0", height: 55, marginBottom: 15 },
  btnPrimary: { backgroundColor: "#345195", padding: 18, borderRadius: 15, alignItems: "center" },
  btnText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  btn: { padding: 18, borderRadius: 15, alignItems: "center", width: '48%' },
  btnSave: { backgroundColor: "#22C55E" },
  btnCancel: { backgroundColor: "#EF4444" }
});