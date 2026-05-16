import { FontAwesome5 } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function RecepcionLayout() {
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
      {/* Primera pestaña: Inicio de Recepción */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <FontAwesome5 name="home" size={20} color={color} />,
        }}
      />
      
      {/* Segunda pestaña: Registro de Paciente (La pantalla del formulario) */}
      <Tabs.Screen
        name="registroPaciente"
        options={{
          title: 'Registrar',
          tabBarIcon: ({ color }) => <FontAwesome5 name="user-plus" size={20} color={color} />,
        }}
      />

      <Tabs.Screen
        name="consultorios"
        options={{
          title: 'Consultorios',
          tabBarIcon: ({ color }) => <FontAwesome5 name="consultorios" size={20} color={color} />,
        }}
      />
    </Tabs>
    
  );
}