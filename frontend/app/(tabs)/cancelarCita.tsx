import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import API_URL from "../../config/api";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CancelarCita() {
  const router = useRouter();
  const { idCita, doctor, fecha } = useLocalSearchParams();

  // En un entorno real, este anticipo vendría de la base de datos
  const anticipoPagado = 400; 

  const handleConfirmarCancelacion = async() => {
    Alert.alert(
      "Cancelación en proceso",
      "¿Estás seguro de que deseas cancelar esta cita definitivamente?",
      [
        { text: "No, mantener cita", style: "cancel" },
        { 
          text: "Sí, cancelar", 
          style: "destructive", 
          onPress: async() => {
            /*console.log("Ejecutando cancelación en BD para la cita:", idCita);
            // Aquí irá el fetch a tu backend
            Alert.alert("Cita cancelada", "Tu cita ha sido cancelada según la política de Cuida+.");
            router.push("/(tabs)/misCitas"); // Regresa a la agenda*/
            try {
  const res = await fetch(`${API_URL}/cancelar-cita/${idCita}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
});

  const data = await res.json();

  if (data.success) {
    Alert.alert("Cita cancelada", "Tu cita ha sido cancelada correctamente.");
    router.push("/(tabs)/misCitas");
  } else {
    Alert.alert("Error", "No se pudo cancelar la cita.");
  }
} catch (error) {
  console.log(error);
  Alert.alert("Error", "Error de conexión con el servidor.");
}
          } 
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Cabecera idéntica a tu imagen */}
        <View style={styles.header}>
          <Text style={styles.brand}>Cuida+</Text>
          <Text style={styles.title}>Cancelar cita</Text>
          <Text style={styles.subtitle}>
            Revisa tu política de reembolso antes de confirmar la cancelación.
          </Text>
        </View>

        {/* Tarjeta 1: Cita seleccionada */}
        <View style={styles.card}>
          <Text style={styles.cardHeaderTitle}>Cita seleccionada</Text>
          
          <Text style={styles.doctorText}>{doctor || "Dra. Ana Beltrán"}</Text>
          <Text style={styles.fechaText}>{fecha || "Miércoles 18 de marzo · 10:30 AM"}</Text>
          
          <Text style={styles.anticipoText}>Anticipo pagado: ${anticipoPagado}</Text>
          <Text style={styles.tiempoText}>Cancelación con 48 h de anticipación</Text>
        </View>

        {/* Tarjeta 2: Política de negocio */}
        <View style={styles.card}>
          <Text style={styles.cardHeaderTitle}>Política</Text>
          <Text style={styles.policyText}>
            Si cancelas con más de 24 horas, el anticipo se reembolsa. Dentro de ese plazo se retiene como penalización.
          </Text>
        </View>

        {/* Botones de acción inferiores */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.btnConfirmar}
            onPress={handleConfirmarCancelacion}
          >
            <Text style={styles.btnConfirmarText}>Confirmar cancelación</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.btnVolver}
            onPress={() => router.back()}
          >
            <Text style={styles.btnVolverText}>Volver</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F4F7FA" // Fondo gris muy claro
  },
  content: { 
    padding: 25,
    paddingTop: 40,
  },
  header: { 
    marginBottom: 30 
  },
  brand: { 
    fontSize: 20, 
    fontWeight: "800", 
    color: "#345195", 
    marginBottom: 10 
  },
  title: { 
    fontSize: 28, 
    fontWeight: "bold", 
    color: "#1A202C",
    marginBottom: 5
  },
  subtitle: { 
    fontSize: 13, 
    color: "#718096", 
    lineHeight: 18 
  },
  card: { 
    backgroundColor: "#FFFFFF", 
    borderRadius: 16, 
    padding: 20, 
    marginBottom: 20, 
    borderWidth: 1, 
    borderColor: "#E2E8F0" 
  },
  cardHeaderTitle: { 
    fontSize: 14, 
    fontWeight: "bold", 
    color: "#1A202C", 
    marginBottom: 15 
  },
  doctorText: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: "#1A202C", 
    marginBottom: 5 
  },
  fechaText: { 
    fontSize: 14, 
    fontWeight: "bold", 
    color: "#1A202C", 
    marginBottom: 15 
  },
  anticipoText: { 
    fontSize: 13, 
    color: "#718096", 
    marginBottom: 8 
  },
  tiempoText: { 
    fontSize: 13, 
    color: "#38A169", // Verde para destacar el tiempo a favor
    fontWeight: "500" 
  },
  policyText: { 
    fontSize: 14, 
    color: "#4A5568", 
    lineHeight: 22 
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 30,
  },
  btnConfirmar: { 
    backgroundColor: "#FFFFFF", 
    borderWidth: 1, 
    borderColor: "#E53E3E", // Borde rojo
    paddingVertical: 18, 
    borderRadius: 12, 
    alignItems: "center", 
    marginBottom: 15 
  },
  btnConfirmarText: { 
    color: "#C53030", // Texto rojo
    fontWeight: "bold", 
    fontSize: 16 
  },
  btnVolver: { 
    backgroundColor: "#345195", // Azul principal
    paddingVertical: 18, 
    borderRadius: 12, 
    alignItems: "center" 
  },
  btnVolverText: { 
    color: "#FFFFFF", 
    fontWeight: "bold", 
    fontSize: 16 
  },
});