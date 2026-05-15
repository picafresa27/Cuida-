import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
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
  const params = useLocalSearchParams();
  
  const idCita = params.idCita || "0";
  const montoAnticipo = params.montoAnticipo || "400";
  const montoTotal = params.montoTotal || "800";

  // --- ESTADOS ---
  const [metodo, setMetodo] = useState("Tarjeta"); 
  const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState("1");
  const [nuevaTarjeta, setNuevaTarjeta] = useState(false);
  
  // Wallet simulada
  const [misTarjetas] = useState([
    { id: '1', tipo: 'Visa', numero: '**** **** **** 4242', exp: '12/28' },
    { id: '2', tipo: 'Mastercard', numero: '**** **** **** 8899', exp: '05/27' }
  ]);

  const [numeroTarjeta, setNumeroTarjeta] = useState("");
  const [titular, setTitular] = useState("");
  const [vencimiento, setVencimiento] = useState("");
  const [cvv, setCvv] = useState("");

  const obtenerIconoTarjeta = (numero: string) => {
    if (numero.includes('4242') || numero.startsWith('4')) return <FontAwesome name="cc-visa" size={20} color="#1A1F71" />;
    if (numero.includes('8899') || numero.startsWith('5')) return <FontAwesome name="cc-mastercard" size={20} color="#EB001B" />;
    return <Ionicons name="card-outline" size={20} color="#A0AEC0" />;
  };

  const pagarAnticipo = async () => {
    try {
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
      Alert.alert("Simulación de Pago", "Cita agendada con éxito (Modo Desarrollo).", [
        { text: "Aceptar", onPress: () => router.back() }
      ]);
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

        {/* BOTÓN TARJETA */}
        <TouchableOpacity
          style={[styles.methodButton, metodo === "Tarjeta" && styles.methodSelected]}
          onPress={() => { setMetodo("Tarjeta"); setNuevaTarjeta(false); }}
        >
          <View>
            <Text style={styles.methodTitle}>Tarjeta</Text>
            <Text style={styles.methodSubtitle}>Visa · Mastercard · Débito</Text>
          </View>
          {metodo === "Tarjeta" && <View style={styles.circleSelected} />}
        </TouchableOpacity>

        {metodo === "Tarjeta" && (
          <View style={styles.walletContainer}>
            <Text style={styles.walletSectionTitle}>Tus tarjetas guardadas:</Text>
            
            {misTarjetas.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.walletCard, tarjetaSeleccionada === item.id && !nuevaTarjeta && styles.walletCardSelected]}
                onPress={() => { setTarjetaSeleccionada(item.id); setNuevaTarjeta(false); }}
              >
                <View style={styles.row}>
                  {obtenerIconoTarjeta(item.numero)}
                  <Text style={styles.walletCardNumber}>{item.numero} ({item.tipo})</Text>
                </View>
                <View style={tarjetaSeleccionada === item.id && !nuevaTarjeta ? styles.radioOn : styles.radioOff} />
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[styles.walletCard, nuevaTarjeta && styles.walletCardSelected]}
              onPress={() => setNuevaTarjeta(true)}
            >
              <View style={styles.row}>
                <Ionicons name="add-circle-outline" size={20} color="#345195" />
                <Text style={[styles.walletCardNumber, { color: "#345195", fontWeight: "bold" }]}>Usar otra tarjeta nueva</Text>
              </View>
              <View style={nuevaTarjeta ? styles.radioOn : styles.radioOff} />
            </TouchableOpacity>
          </View>
        )}

        {metodo === "Tarjeta" && nuevaTarjeta && (
          <View style={styles.formContainer}>
            <Text style={styles.inputLabel}>Número de tarjeta</Text>
            <TextInput
              style={styles.input}
              placeholder="0000 0000 0000 0000"
              value={numeroTarjeta}
              onChangeText={(texto) => setNumeroTarjeta(texto.replace(/\D/g, "").replace(/(\d{4})(?=\d)/g, "$1 ").substring(0, 19))}
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

            <View style={styles.rowBetween}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.inputLabel}>Vencimiento</Text>
                <TextInput
                  style={styles.input}
                  placeholder="MM/YY"
                  value={vencimiento}
                  onChangeText={(t) => setVencimiento(t.replace(/\D/g, "").replace(/(\d{2})(?=\d)/g, "$1/").substring(0, 5))}
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>CVV</Text>
                <TextInput
                  style={styles.input}
                  placeholder="123"
                  value={cvv}
                  onChangeText={(t) => setCvv(t.replace(/\D/g, ""))}
                  keyboardType="numeric"
                  maxLength={3}
                  secureTextEntry
                />
              </View>
            </View>
          </View>
        )}

        {/* BOTÓN TRANSFERENCIA */}
        <TouchableOpacity
          style={[styles.methodButton, metodo === "Transferencia" && styles.methodSelected, { marginTop: 12 }]}
          onPress={() => setMetodo("Transferencia")}
        >
          <View>
            <Text style={styles.methodTitle}>Transferencia</Text>
            <Text style={styles.methodSubtitle}>CLABE interbancaria</Text>
          </View>
          {metodo === "Transferencia" && <View style={styles.circleSelected} />}
        </TouchableOpacity>

        {metodo === "Transferencia" && (
          <View style={styles.transferCard}>
            <MaterialCommunityIcons name="bank-outline" size={32} color="#345195" />
            <Text style={styles.transferTitle}>Datos de Cuenta Cuida+</Text>
            <Text style={styles.transferValue}>Banco: BBVA Bancomer</Text>
            <Text style={styles.transferValue}>CLABE: 0123 4567 8901 2345 67</Text>
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
  methodButton: { backgroundColor: "#FFF", borderRadius: 15, padding: 16, borderWidth: 1, borderColor: "#E5E7EB", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  methodSelected: { borderColor: "#345195", borderWidth: 2 },
  methodTitle: { fontWeight: "bold", color: "#1F2937", marginBottom: 3 },
  methodSubtitle: { color: "#9CA3AF", fontSize: 12 },
  circleSelected: { width: 18, height: 18, borderRadius: 9, backgroundColor: "#345195" },
  walletContainer: { marginTop: 15, paddingHorizontal: 5 },
  walletSectionTitle: { fontSize: 13, color: "#4B5563", fontWeight: "600", marginBottom: 10 },
  walletCard: { backgroundColor: "#FFF", padding: 14, borderRadius: 12, marginBottom: 8, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 1, borderColor: "#E5E7EB" },
  walletCardSelected: { borderColor: "#345195", backgroundColor: "#F0F4FF" },
  row: { flexDirection: "row", alignItems: "center" },
  walletCardNumber: { marginLeft: 10, fontSize: 14, color: "#1F2937", fontWeight: "500" },
  radioOn: { width: 16, height: 16, borderRadius: 8, backgroundColor: "#345195", borderWidth: 3, borderColor: "#FFF", elevation: 1 },
  radioOff: { width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: "#CBD5E1" },
  formContainer: { marginTop: 15, backgroundColor: "#FFF", padding: 15, borderRadius: 15, borderWidth: 1, borderColor: "#E5E7EB" },
  inputLabel: { marginTop: 10, marginBottom: 6, color: "#4B5563", fontWeight: "600", fontSize: 13 },
  input: { backgroundColor: "#F9FAFB", padding: 14, borderRadius: 10, borderWidth: 1, borderColor: "#E5E7EB", fontSize: 15 },
  transferCard: { backgroundColor: '#FFF', padding: 16, borderRadius: 15, alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', marginTop: 12 },
  transferTitle: { fontSize: 15, fontWeight: 'bold', color: '#1F2937', marginVertical: 8 },
  transferValue: { fontSize: 14, color: '#4B5563', marginBottom: 4 },
  payButton: { marginTop: 30, backgroundColor: "#345195", paddingVertical: 18, borderRadius: 15, alignItems: "center" },
  payButtonText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
});