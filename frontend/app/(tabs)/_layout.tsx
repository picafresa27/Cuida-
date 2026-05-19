import { FontAwesome5 } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#345195',
        tabBarInactiveTintColor: '#A0AEC0',
        headerShown: false,
        tabBarStyle: {
          height: 65,
          paddingBottom: 10,
          paddingTop: 5,
          backgroundColor: '#FFFFFF',
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <FontAwesome5 name="home" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="buscarMedico"
        options={{
          title: 'Buscar',
          tabBarIcon: ({ color }) => <FontAwesome5 name="search" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="misCitas"
        options={{
          title: 'Mis Citas',
          tabBarIcon: ({ color }) => <FontAwesome5 name="calendar-alt" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <FontAwesome5 name="user-alt" size={20} color={color} />,
        }}
      />
      <Tabs.Screen name="cancelarCita" options={{ href: null }} />
      <Tabs.Screen name="detalleCita" options={{ href: null }} />
      <Tabs.Screen name="agenda" options={{ href: null }} />
      <Tabs.Screen name="agendarCita" options={{ href: null }} />
      <Tabs.Screen name="especialidades" options={{ href: null }} />
      <Tabs.Screen name="metodoPago" options={{ href: null }} />
      <Tabs.Screen name="metodosPagoTab" options={{ href: null }} />
      <Tabs.Screen name="reagendarCita" options={{ href: null }} />
    </Tabs>
  );
}