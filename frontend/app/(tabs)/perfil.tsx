import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, Image, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PerfilScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header de Perfil */}
        <View style={styles.header}>
          <Text style={styles.title}>Mi Perfil</Text>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={50} color="#345195" />
            </View>
            <Pressable style={styles.editBadge}>
              <Ionicons name="camera" size={18} color="white" />
            </Pressable>
          </View>
          <Text style={styles.userName}>Ale Lomeli</Text>
          <Text style={styles.userEmail}>ale.lomeli@ejemplo.com</Text>
        </View>

        {/* Opciones de Configuración */}
        <View style={styles.menuContainer}>
          <MenuOption icon="person-outline" label="Datos Personales" />
          <MenuOption icon="card-outline" label="Métodos de Pago" />
          <MenuOption icon="notifications-outline" label="Notificaciones" />
          <MenuOption icon="shield-checkmark-outline" label="Seguridad" />
          <MenuOption icon="help-circle-outline" label="Ayuda y Soporte" />
          
          <Pressable style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={22} color="#FF4B4B" />
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </Pressable>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// Componente pequeño para las filas del menú
function MenuOption({ icon, label }: { icon: any, label: string }) {
  return (
    <Pressable style={styles.menuOption}>
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
});