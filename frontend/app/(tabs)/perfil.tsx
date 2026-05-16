import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useContext, useState } from 'react';
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import API_URL from "../../config/api";
import { UserContext } from "../../context/userContext";

export default function PerfilScreen() {
  const { usuario, setUsuario } = useContext(UserContext);
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);
  const router = useRouter();

  const seleccionarImagen = async () => {
  //console.log("1. Entró a seleccionarImagen");
  const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permiso.granted) {
    alert("Permiso denegado");
    return;
  }

  const resultado = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  //console.log("2. Resultado:", resultado);

  if (resultado.canceled) return;

  const imagen = resultado.assets[0];

  //console.log("3. Imagen:", imagen);

  const formData = new FormData();

  formData.append('file', {
    uri: imagen.uri,
    type: 'image/jpeg',
    name: 'perfil.jpg',
  } as any);

  formData.append('upload_preset', 'cuida+');

  try {

    //console.log("4. Subiendo a Cloudinary");

    const resCloudinary = await fetch(
      "https://api.cloudinary.com/v1_1/dji2j4zdz/image/upload",
      {
        method: 'POST',
        body: formData,
      }
    );

    //console.log("5. Status Cloudinary:", resCloudinary.status);

    const data = await resCloudinary.json();

    console.log("URL CLOUDINARY:", data.secure_url);
    //console.log("6. Data Cloudinary:", data);

    if (!data.secure_url) {
      alert("Cloudinary no devolvió URL");
      return;
    }

    //console.log("7. URL:", data.secure_url);

    const resBackend = await fetch(
      `${API_URL}/actualizarFotoPerfil`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      idPaciente: usuario?.id,
      fotoPerfil: data.secure_url,
    }),
  }
);

console.log("STATUS BACKEND:", resBackend.status);

const backendData = await resBackend.json();

console.log("RESPUESTA BACKEND:", backendData);
    
    //console.log("8. Guardado en SQL");

    setUsuario({
      ...usuario!,
      fotoPerfil: data.secure_url,
    });

    //console.log("9. Context actualizado");

    alert("Foto actualizada");

  } catch (error) {

    console.log("ERROR:", error);

    alert("Error subiendo imagen");
  }
};

const cerrarSesion = () => {

  // Limpiar usuario
  setUsuario(null);

  // Ir al login
  router.replace("../inicioSesion");
};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header de Perfil */}
        <View style={styles.header}>
          <Text style={styles.title}>Mi Perfil</Text>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              {usuario?.fotoPerfil ? (<Image source={{ uri: usuario.fotoPerfil }} style={styles.avatarImage}/>) : (<Ionicons name="person" size={50} color="#345195" />)}
            </View>
            <Pressable style={styles.editBadge}onPress={seleccionarImagen}>
              <Ionicons name="camera" size={18} color="white" />
            </Pressable>
          </View>
          <Text style={styles.userName}>{usuario?.nombres} {usuario?.apellidos} </Text>
          <Text style={styles.userEmail}>{usuario?.correo}</Text>
        </View>

        {/* Opciones de Configuración */}
        <View style={styles.menuContainer}>
          <MenuOption 
            icon="person-outline" 
            label="Datos Personales" 
            onPress={() => router.push("../interfaces/datosPersonales")} 
        />

        <MenuOption 
            icon="card-outline" 
            label="Métodos de Pago" 
            onPress={() => router.push("../metodosPagoTab")} 
        />
        <MenuOption icon="notifications-outline" label="Notificaciones" />
          <MenuOption 
            icon="shield-checkmark-outline" 
            label="Seguridad" 
            onPress={() => router.push("../interfaces/seguridad")} 
          />
          <MenuOption 
            icon="help-circle-outline" 
            label="Ayuda y Soporte" 
            onPress={() => router.push("../interfaces/ayudaSoporte")}
          />
          
          <Pressable style={styles.logoutButton} onPress={cerrarSesion}>
            <Ionicons name="log-out-outline" size={22} color="#FF4B4B" />
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </Pressable>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

function MenuOption({ icon, label, onPress }: { icon: any, label: string, onPress?: () => void }) {
  return (
    <Pressable style={styles.menuOption} onPress={onPress}>
      <View style={styles.menuLeft}>
        <Ionicons name={icon} size={22} color="#345195" />
        <Text style={styles.menuLabel}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // Gris muy claro de fondo
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Montserrat',
    fontWeight: '700',
    color: '#345195',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#345195',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#345195',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  userName: {
    fontSize: 22,
    fontFamily: 'Montserrat',
    fontWeight: '700',
    color: '#1E293B',
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Montserrat',
    color: '#64748B',
    marginTop: 4,
  },
  menuContainer: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 15,
    marginBottom: 12,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuLabel: {
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Montserrat',
    fontWeight: '500',
    color: '#334155',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    padding: 15,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Montserrat',
    fontWeight: '600',
    color: '#FF4B4B',
  },
  avatarImage: {
  width: '100%',
  height: '100%',
  borderRadius: 50,
  },
});