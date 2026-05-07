import { useState } from "react";
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

export default function MetodoPago() {
  const [metodo, setMetodo] = useState("Tarjeta");
  const [numeroTarjeta, setNumeroTarjeta] = useState("");
  const [titular, setTitular] = useState("");
  const [vencimiento, setVencimiento] = useState("");

  const pagarAnticipo = () => {
    Alert.alert("Pago realizado", "El anticipo fue procesado correctamente.");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        {/* TITULO */}
        <Text style={styles.title}>Método de pago</Text>
        <Text style={styles.subtitle}>
          Selecciona cómo pagar el anticipo del 50% para confirmar la cita.
        </Text>

        {/* RESUMEN */}
        <View style={styles.card}>
          <Text style={styles.label}>Anticipo a pagar</Text>

          <View style={styles.rowBetween}>
            <Text style={styles.price}>$400 MXN</Text>
            <Text style={styles.total}>Consulta total $800</Text>
          </View>
        </View>

        {/* MÉTODOS */}
        <Text style={styles.sectionTitle}>Método de pago</Text>

        <TouchableOpacity
          style={[
            styles.methodButton,
            metodo === "Tarjeta" && styles.methodSelected
          ]}
          onPress={() => setMetodo("Tarjeta")}
        >
          <View>
            <Text style={styles.methodTitle}>Tarjeta</Text>
            <Text style={styles.methodSubtitle}>
              Visa · Mastercard · Débito
            </Text>
          </View>

          {metodo === "Tarjeta" && (
            <View style={styles.circleSelected} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.methodButton,
            metodo === "Transferencia" && styles.methodSelected
          ]}
          onPress={() => setMetodo("Transferencia")}
        >
          <View>
            <Text style={styles.methodTitle}>Transferencia</Text>
            <Text style={styles.methodSubtitle}>
              CLABE y referencia automática
            </Text>
          </View>

          {metodo === "Transferencia" && (
            <View style={styles.circleSelected} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.methodButton,
            metodo === "Recepcion" && styles.methodSelected
          ]}
          onPress={() => setMetodo("Recepcion")}
        >
          <View>
            <Text style={styles.methodTitle}>Pago en recepción</Text>
            <Text style={styles.methodSubtitle}>
              Apartado no disponible para paciente
            </Text>
          </View>

          {metodo === "Recepcion" && (
            <View style={styles.circleSelected} />
          )}
        </TouchableOpacity>

        {/* CAMPOS TARJETA */}
        {metodo === "Tarjeta" && (
          <>
            <Text style={styles.inputLabel}>Número de tarjeta</Text>
            <TextInput
              style={styles.input}
              placeholder="4111 1111 1111 1111"
              value={numeroTarjeta}
              onChangeText={setNumeroTarjeta}
              keyboardType="numeric"
            />

            <Text style={styles.inputLabel}>Titular</Text>
            <TextInput
              style={styles.input}
              placeholder="Edgar López"
              value={titular}
              onChangeText={setTitular}
            />

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Vencimiento</Text>
                <TextInput
                  style={styles.input}
                  placeholder="08/28"
                  value={vencimiento}
                  onChangeText={setVencimiento}
                />
              </View>
            </View>
          </>
        )}

        {/* BOTÓN */}
        <TouchableOpacity
          style={styles.payButton}
          onPress={pagarAnticipo}
        >
          <Text style={styles.payButtonText}>
            Pagar anticipo
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },

  content: {
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 5,
  },

  subtitle: {
    color: "#6B7280",
    marginBottom: 25,
    fontSize: 13,
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  label: {
    color: "#6B7280",
    marginBottom: 10,
    fontSize: 13,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  price: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#345195",
  },

  total: {
    color: "#9CA3AF",
    fontSize: 13,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#1F2937",
  },

  methodButton: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  methodSelected: {
    borderColor: "#345195",
    borderWidth: 2,
  },

  methodTitle: {
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 3,
  },

  methodSubtitle: {
    color: "#9CA3AF",
    fontSize: 12,
  },

  circleSelected: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#345195",
  },

  inputLabel: {
    marginTop: 12,
    marginBottom: 6,
    color: "#4B5563",
    fontWeight: "600",
  },

  input: {
    backgroundColor: "#fff", 
    padding: 14, 
    borderRadius: 10, 
    borderWidth: 1, 
    borderColor: "#cbd5e0"
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },

  payButton: {
    marginTop: 25,
    backgroundColor: "#345195",
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: "center",
  },

  payButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});