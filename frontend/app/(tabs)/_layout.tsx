import { Ionicons } from '@expo/vector-icons'; // Importante para los iconos
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#345195', // Tu azul de marca
        headerShown: false,
        tabBarLabelStyle: { 
          fontFamily: 'Montserrat', // Tipografía Montserrat de Cuida+
          fontWeight: '600' 
        },
      }}
    >
      {/* PANTALLAS VISIBLES */}
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Inicio',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
          ),
        }} 
      />
      
      <Tabs.Screen 
        name="buscarMedico" 
        options={{ 
          title: 'Buscar',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'search' : 'search-outline'} size={24} color={color} />
          ),
        }} 
      />

      {/* AQUÍ AÑADIMOS PERFIL */}
      <Tabs.Screen 
        name="perfil" 
        options={{ 
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
          ),
        }} 
      />

      {/* PANTALLAS OCULTAS (href: null) */}
      <Tabs.Screen name="agenda" options={{ href: null }} />
      <Tabs.Screen name="metodoPago" options={{ href: null }} />
      <Tabs.Screen name="misCitas" options={{ href: null }} />
      <Tabs.Screen name="agendarCita" options={{ href: null }} />
      <Tabs.Screen name="detalleCita" options={{ href: null }} />
      <Tabs.Screen name="especialidades" options={{ href: null }} />
      <Tabs.Screen name="reagendarCita" options={{ href: null }} />
    </Tabs>
  );
}