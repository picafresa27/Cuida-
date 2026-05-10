import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function MetodosPagoScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabecera idéntica a la de Datos Personales */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>{"< Volver"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Métodos de Pago</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.instrucciones}>
          Administra tus tarjetas guardadas para agilizar el pago de tus consultas y anticipos.
        </Text>

        {/* Tarjeta Guardada 1 */}
        <View style={styles.tarjeta}>
          <View style={styles.tarjetaHeader}>
            <Text style={styles.tipoTarjeta}>Visa</Text>
            <TouchableOpacity>
              <Text style={styles.textoEliminar}>Eliminar</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.numeroTarjeta}>**** **** **** 4242</Text>
          <Text style={styles.expiracion}>Expira: 12/28</Text>
        </View>

        {/* Tarjeta Guardada 2 */}
        <View style={styles.tarjeta}>
          <View style={styles.tarjetaHeader}>
            <Text style={styles.tipoTarjeta}>Mastercard</Text>
            <TouchableOpacity>
              <Text style={styles.textoEliminar}>Eliminar</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.numeroTarjeta}>**** **** **** 8899</Text>
          <Text style={styles.expiracion}>Expira: 05/27</Text>
        </View>

        {/* Botón para agregar nueva tarjeta */}
        <TouchableOpacity style={styles.botonAgregar}>
          <Text style={styles.textoAzul}>+ Agregar nueva tarjeta</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8", 
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  backButton: {
    padding: 5,
    width: 60,
  },
  backText: {
    color: "#345195",
    fontSize: 16,
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A202C",
  },
  scrollContent: {
    padding: 20,
  },
  instrucciones: {
    fontSize: 14,
    color: "#718096",
    marginBottom: 25,
    lineHeight: 20,
  },
  tarjeta: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tarjetaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  tipoTarjeta: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#345195",
  },
  textoEliminar: {
    fontSize: 14,
    color: "#E53E3E", // Rojo para indicar una acción destructiva
    fontWeight: "600",
  },
  numeroTarjeta: {
    fontSize: 18,
    letterSpacing: 2,
    color: "#2D3748",
    marginBottom: 10,
  },
  expiracion: {
    fontSize: 14,
    color: "#A0AEC0",
  },
  botonAgregar: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "#345195",
    borderStyle: "dashed",
    marginTop: 10,
  },
  textoAzul: {
    color: "#345195",
    fontSize: 16,
    fontWeight: "700",
  },
});