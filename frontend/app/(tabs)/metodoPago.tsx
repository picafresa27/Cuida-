import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import API_URL from "../../config/api";

export default function MetodoPago() {
  const router = useRouter();
  
  // CAPTURA DE DATOS: Si no llegan, usamos valores por defecto (||)
  const params = useLocalSearchParams();
  const idCita = params.idCita || "0";
  const montoAnticipo = params.montoAnticipo || "400";
  const montoTotal = params.montoTotal || "800";

  const [metodo, setMetodo] = useState("Tarjeta");
  const [numeroTarjeta, setNumeroTarjeta] = useState("");
  const [titular, setTitular] = useState("");
  const [vencimiento, setVencimiento] = useState("");

  const manejarCambioTarjeta = (texto: string) => {
    const soloNumeros = texto.replace(/\D/g, "");
    const formateado = soloNumeros.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
    setNumeroTarjeta(formateado.substring(0, 19));
  };

  const manejarCambioVencimiento = (texto: string) => {
    const soloNumeros = texto.replace(/\D/g, "");
    const formateado = soloNumeros.replace(/(\d{2})(?=\d)/g, "$1/").trim();
    setVencimiento(formateado.substring(0, 5));
  };

  const pagarAnticipo = async () => {
    if (metodo === "Tarjeta") {
      const digitosReales = numeroTarjeta.replace(/\D/g, "");
      if (digitosReales.length !== 16) {
        Alert.alert("Datos incompletos", "El número de tarjeta debe tener 16 dígitos.");
        return;
      }
    }

    try {
      // RECUERDA: El puerto 3000 debe estar en PUBLIC en VS Code
      const response = await fetch(`${API_URL}/pagos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          monto: montoAnticipo,
          metodoPago: metodo,
          estatus: "Completado",
          tipoPago: "Anticipo",
          idCita: idCita
        }),
      });

      if (response.ok) {
        Alert.alert("Confirmación", "El pago del anticipo se ha registrado correctamente.", [
          { text: "Aceptar", onPress: () => router.back() }
        ]);
      } else {
        throw new Error("Error en el servidor");
      }
    } catch (error) {
      Alert.alert("Error de conexión", "Asegúrate de que el servidor esté encendido y el puerto 3000 sea Público.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Método de pago</Text>
        <Text style={styles.subtitle}>Confirma tu cita mediante el pago del anticipo.</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Anticipo a pagar</Text>
          <View style={styles.rowBetween}>
            <Text style={styles.price}>${montoAnticipo} MXN</Text>
            <Text style={styles.total}>Total consulta: ${montoTotal}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Selecciona método</Text>

        {/* BOTONES DE SELECCIÓN */}
        {["Tarjeta", "Transferencia"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.methodButton, metodo === item && styles.methodSelected]}
            onPress={() => setMetodo(item)}
          >
            <View>
              <Text style={styles.methodTitle}>{item}</Text>
              <Text style={styles.methodSubtitle}>
                {item === "Tarjeta" ? "Visa · Mastercard · Débito" : "CLABE interbancaria"}
              </Text>
            </View>
            {metodo === item && <View style={styles.circleSelected} />}
          </TouchableOpacity>
        ))}

        {/* INPUTS DE LA TARJETA */}
        {metodo === "Tarjeta" && (
          <View style={styles.formContainer}>
            <Text style={styles.inputLabel}>Número de tarjeta</Text>
            <TextInput
              style={styles.input}
              placeholder="0000 0000 0000 0000"
              value={numeroTarjeta}
              onChangeText={manejarCambioTarjeta}
              keyboardType="numeric"
              maxLength={19}
            />

            <Text style={styles.inputLabel}>Titular</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre en la tarjeta"
              value={titular}
              onChangeText={setTitular}
              autoCapitalize="characters"
            />

            <Text style={styles.inputLabel}>Vencimiento</Text>
            <TextInput
              style={styles.input}
              placeholder="MM/YY"
              value={vencimiento}
              onChangeText={manejarCambioVencimiento}
              keyboardType="numeric"
              maxLength={5}
            />
          </View>
        )}

        <TouchableOpacity style={styles.payButton} onPress={pagarAnticipo}>
          <Text style={styles.payButtonText}>Pagar anticipo ${montoAnticipo}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F7FB" },
  content: { padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", color: "#1F2937", marginBottom: 5 },
  subtitle: { color: "#6B7280", marginBottom: 25, fontSize: 13 },
  card: { backgroundColor: "#FFF", borderRadius: 18, padding: 18, marginBottom: 25, borderWidth: 1, borderColor: "#E5E7EB" },
  label: { color: "#6B7280", marginBottom: 10, fontSize: 13 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  price: { fontSize: 28, fontWeight: "bold", color: "#345195" },
  total: { color: "#9CA3AF", fontSize: 13 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 15, color: "#1F2937" },
  methodButton: { backgroundColor: "#FFF", borderRadius: 15, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: "#E5E7EB", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  methodSelected: { borderColor: "#345195", borderWidth: 2 },
  methodTitle: { fontWeight: "bold", color: "#1F2937", marginBottom: 3 },
  methodSubtitle: { color: "#9CA3AF", fontSize: 12 },
  circleSelected: { width: 18, height: 18, borderRadius: 9, backgroundColor: "#345195" },
  formContainer: { marginTop: 10 },
  inputLabel: { marginTop: 12, marginBottom: 6, color: "#4B5563", fontWeight: "600" },
  input: { backgroundColor: "#fff", padding: 14, borderRadius: 10, borderWidth: 1, borderColor: "#cbd5e0", fontSize: 16 },
  payButton: { marginTop: 25, backgroundColor: "#345195", paddingVertical: 18, borderRadius: 15, alignItems: "center" },
  payButtonText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
});