import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { useSegments, useRouter, useRootNavigationState } from "expo-router";

export default function DoctorTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#345195', // Tu azul de Cuida+
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontFamily: 'Montserrat',
          fontSize: 11,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="inicioDoctor"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="agenda"
        options={{
          title: 'Agenda',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "calendar" : "calendar-outline"} size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="pacientes"
        options={{
          title: 'Pacientes',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "people" : "people-outline"} size={22} color={color} />
          ),
        }}
      />

      {/* 👈 CORREGIDO: Ahora dice "perfilDoc" para que coincida con tu archivo */}
      <Tabs.Screen
        name="perfilDoc"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={22} color={color} />
          ),
        }}
      />

      {/* 👈 NUEVO: Registra la pantalla de consulta pero la oculta del menú de abajo */}
      <Tabs.Screen
        name="registroConsulta"
        options={{
          href: null, // Esto hace que no salga el botón en la barra
        }}
      />

      <Tabs.Screen
        name="expedientePaciente"
        options={{
          href: null, // Lo oculta de la barra de navegación inferior
        }}
      />
    </Tabs>
  );

  <Tabs.Screen
        name="expedientePaciente"
        options={{
          href: null, // Lo oculta de la barra de navegación inferior
        }}
      />
}