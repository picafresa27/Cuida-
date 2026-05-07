import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#345195",
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index" // Esta es tu HomePaciente
        options={{
          title: "Inicio",
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="agenda"
        options={{
          title: "Agenda",
          tabBarIcon: ({ color }) => <Ionicons name="calendar" size={24} color={color} />,
        }}
      />
      {/* Si aquí había uno llamado "explore", ya no debe estar */}
    </Tabs>
  );
}