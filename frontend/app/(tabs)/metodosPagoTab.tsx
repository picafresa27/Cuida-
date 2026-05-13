import { useRouter } from "expo-router";
import React, { useState } from "react"; // Añadimos useState
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MetodosPagoScreen() {
  const router = useRouter();

  // --- ESTADOS PARA LA LÓGICA ---
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);
  const [numeroTarjeta, setNumeroTarjeta] = useState("");

  // 1. Lógica para acomodar cada 4 caracteres y limpiar letras
 const formatearTarjeta = (texto: string) => {
  // Solo números
  const soloNumeros = texto.replace(/\D/g, "");
  // Ponemos espacios cada 4, pero solo si hay más de 4 números
  const formateado = soloNumeros.replace(/(\d{4})(?=\d)/g, "$1 ");
  setNumeroTarjeta(formateado.substring(0, 19)); 
};
  // 2. Lógica para validar la cantidad requerida (16)
  const guardarNuevaTarjeta = () => {
    const digitosReales = numeroTarjeta.replace(/\D/g, "");
    
    if (digitosReales.length !== 16) {
      Alert.alert("Error", "La tarjeta debe tener exactamente 16 dígitos.");
      return;
    }

    Alert.alert("Éxito", "Tarjeta guardada correctamente", [
      { text: "OK", onPress: () => {
        setMostrandoFormulario(false);
        setNumeroTarjeta("");
        // Aquí podrías agregar la lógica para guardar en la base de datos después
      }}
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>{"←"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Métodos de Pago</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Si NO estamos agregando, mostramos tu lista original */}
        {!mostrandoFormulario ? (
          <>
            <Text style={styles.instrucciones}>
              Administra tus tarjetas guardadas para agilizar el pago de tus consultas y anticipos.
            </Text>

            <View style={styles.tarjeta}>
              <View style={styles.tarjetaHeader}>
                <Text style={styles.tipoTarjeta}>Visa</Text>
                <TouchableOpacity><Text style={styles.textoEliminar}>Eliminar</Text></TouchableOpacity>
              </View>
              <Text style={styles.numeroTarjeta}>**** **** **** 4242</Text>
              <Text style={styles.expiracion}>Expira: 12/28</Text>
            </View>

            <View style={styles.tarjeta}>
              <View style={styles.tarjetaHeader}>
                <Text style={styles.tipoTarjeta}>Mastercard</Text>
                <TouchableOpacity><Text style={styles.textoEliminar}>Eliminar</Text></TouchableOpacity>
              </View>
              <Text style={styles.numeroTarjeta}>**** **** **** 8899</Text>
              <Text style={styles.expiracion}>Expira: 05/27</Text>
            </View>

            <TouchableOpacity 
              style={styles.botonAgregar}
              onPress={() => setMostrandoFormulario(true)} // Cambia al formulario
            >
              <Text style={styles.textoAzul}>+ Agregar nueva tarjeta</Text>
            </TouchableOpacity>
          </>
        ) : (
          /* NUEVO: FORMULARIO DE ENTRADA */
          <View style={styles.formCard}>
            <Text style={styles.formTitulo}>Nueva Tarjeta</Text>
            
            <Text style={styles.label}>Número de Tarjeta</Text>
            <TextInput
              style={styles.input}
              placeholder="0000 0000 0000 0000"
              keyboardType="numeric"
              value={numeroTarjeta}
              onChangeText={formatearTarjeta}
            />

            <View style={styles.row}>
              <TouchableOpacity 
                style={styles.btnSecundario} 
                onPress={() => setMostrandoFormulario(false)}
              >
                <Text style={styles.btnTxtNegro}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.btnPrimario} 
                onPress={guardarNuevaTarjeta}
              >
                <Text style={styles.btnTxtBlanco}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6F8" },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingVertical: 15, backgroundColor: "#FFFFFF",
    borderBottomWidth: 1, borderBottomColor: "#E2E8F0",
  },
  backButton: { padding: 5, width: 60 },
  backText: { color: "#345195", fontSize: 25, fontWeight: "900" },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#1A202C" },
  scrollContent: { padding: 20 },
  instrucciones: { fontSize: 14, color: "#718096", marginBottom: 25, lineHeight: 20 },
  tarjeta: {
    backgroundColor: "#FFFFFF", borderRadius: 16, padding: 20, marginBottom: 15,
    borderWidth: 1, borderColor: "#E2E8F0", elevation: 2,
  },
  tarjetaHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  tipoTarjeta: { fontSize: 16, fontWeight: "bold", color: "#345195" },
  textoEliminar: { fontSize: 14, color: "#E53E3E", fontWeight: "600" },
  numeroTarjeta: { fontSize: 18, letterSpacing: 2, color: "#2D3748", marginBottom: 10 },
  expiracion: { fontSize: 14, color: "#A0AEC0" },
  botonAgregar: {
    backgroundColor: "#FFFFFF", paddingVertical: 18, borderRadius: 12,
    alignItems: "center", width: "100%", borderWidth: 1, borderColor: "#345195",
    borderStyle: "dashed", marginTop: 10,
  },
  textoAzul: { color: "#345195", fontSize: 16, fontWeight: "700" },
  
  // ESTILOS DEL FORMULARIO
  formCard: { backgroundColor: "#FFF", padding: 20, borderRadius: 16, borderWidth: 1, borderColor: "#E2E8F0" },
  formTitulo: { fontSize: 18, fontWeight: "bold", marginBottom: 20, color: "#1A202C" },
  label: { fontSize: 12, color: "#718096", marginBottom: 8, fontWeight: "600" },
  input: { 
    backgroundColor: "#F7FAFC", borderWidth: 1, borderColor: "#E2E8F0", 
    padding: 15, borderRadius: 10, fontSize: 18, marginBottom: 20, letterSpacing: 1 
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  btnPrimario: { backgroundColor: "#345195", padding: 15, borderRadius: 10, flex: 1, marginLeft: 10, alignItems: "center" },
  btnSecundario: { backgroundColor: "#EDF2F7", padding: 15, borderRadius: 10, flex: 1, marginRight: 10, alignItems: "center" },
  btnTxtBlanco: { color: "#FFF", fontWeight: "bold" },
  btnTxtNegro: { color: "#4A5568", fontWeight: "bold" },
});