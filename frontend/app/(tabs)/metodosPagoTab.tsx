import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert, // Para mensajes rápidos en Android
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MetodosPagoScreen() {
  const router = useRouter();

  // --- ESTADOS ---
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);
  const [tarjetas, setTarjetas] = useState([
    { id: '1', tipo: 'Visa', numero: '**** **** **** 4242', exp: '12/28' },
    { id: '2', tipo: 'Mastercard', numero: '**** **** **** 8899', exp: '05/27' }
  ]);

  // Estados del formulario
  const [numeroTarjeta, setNumeroTarjeta] = useState("");
  const [nombre, setNombre] = useState("");
  const [vencimiento, setVencimiento] = useState("");
  const [cvv, setCvv] = useState("");

  // --- LÓGICA DE ICONOS ---
  const obtenerIconoTarjeta = (numero: string) => {
    const limpio = numero.replace(/\D/g, "");
    if (limpio.startsWith('4')) return <FontAwesome name="cc-visa" size={24} color="#1A1F71" />;
    if (limpio.startsWith('5') || limpio.startsWith('2')) return <FontAwesome name="cc-mastercard" size={24} color="#EB001B" />;
    if (limpio.startsWith('34') || limpio.startsWith('37')) return <FontAwesome name="cc-amex" size={24} color="#2E77BB" />;
    return <Ionicons name="card-outline" size={24} color="#A0AEC0" />;
  };

  // --- MANEJO DE ELIMINACIÓN ---
  const mostrarMensaje = (msg: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert("Aviso", msg);
    }
  };

  const confirmarEliminacion = (id: string) => {
    Alert.alert(
      "Eliminar Tarjeta",
      "¿Estás seguro de que deseas eliminar esta tarjeta?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive", 
          onPress: () => {
            setTarjetas(prev => prev.filter(t => t.id !== id));
            mostrarMensaje("Tarjeta eliminada correctamente");
          } 
        }
      ]
    );
  };

  // --- LÓGICA DE GUARDADO ---
  const formatearTarjeta = (texto: string) => {
    const soloNumeros = texto.replace(/\D/g, "");
    const formateado = soloNumeros.replace(/(\d{4})(?=\d)/g, "$1 ");
    setNumeroTarjeta(formateado.substring(0, 19));
  };

  const formatearVencimiento = (t: string) => {
    const v = t.replace(/\D/g, "");
    if (v.length <= 2) setVencimiento(v);
    else setVencimiento(`${v.slice(0, 2)}/${v.slice(2, 4)}`);
  };

  const guardarNuevaTarjeta = () => {
    const digitosReales = numeroTarjeta.replace(/\D/g, "");
    if (!nombre || !vencimiento || !cvv || digitosReales.length !== 16) {
      Alert.alert("Error", "Por favor, completa todos los campos correctamente.");
      return;
    }

    const nueva = {
      id: Date.now().toString(),
      tipo: numeroTarjeta.startsWith('4') ? 'Visa' : 'Mastercard',
      numero: `**** **** **** ${digitosReales.slice(-4)}`,
      exp: vencimiento
    };

    setTarjetas([...tarjetas, nueva]);
    setMostrandoFormulario(false);
    setNumeroTarjeta(""); setNombre(""); setVencimiento(""); setCvv("");
    mostrarMensaje("Tarjeta agregada con éxito");
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
        {!mostrandoFormulario ? (
          <>
            <Text style={styles.instrucciones}>
              Administra tus tarjetas guardadas para agilizar el pago de tus consultas y anticipos.
            </Text>

            {tarjetas.length > 0 ? (
              tarjetas.map((item) => (
                <View key={item.id} style={styles.tarjeta}>
                  <View style={styles.tarjetaHeader}>
                    <View style={styles.row}>
                      {obtenerIconoTarjeta(item.tipo === 'Visa' ? '4' : '5')}
                      <Text style={[styles.tipoTarjeta, { marginLeft: 8 }]}>{item.tipo}</Text>
                    </View>
                    <TouchableOpacity onPress={() => confirmarEliminacion(item.id)}>
                      <Text style={styles.textoEliminar}>Eliminar</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.numeroTarjeta}>{item.numero}</Text>
                  <Text style={styles.expiracion}>Expira: {item.exp}</Text>
                </View>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="card-outline" size={60} color="#CBD5E0" />
                <Text style={styles.emptyText}>No hay tarjetas guardadas</Text>
              </View>
            )}

            <TouchableOpacity style={styles.botonAgregar} onPress={() => setMostrandoFormulario(true)}>
              <Text style={styles.textoAzul}>+ Agregar nueva tarjeta</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.formCard}>
            <Text style={styles.formTitulo}>Nueva Tarjeta</Text>

            <Text style={styles.label}>Nombre del Titular</Text>
            <TextInput
              style={styles.inputSimple}
              placeholder="Ej: JUAN PÉREZ"
              autoCapitalize="characters"
              value={nombre}
              onChangeText={setNombre}
            />

            <Text style={styles.label}>Número de Tarjeta</Text>
            <View style={styles.inputConIcono}>
              <View style={styles.iconoInput}>
                {obtenerIconoTarjeta(numeroTarjeta)}
              </View>
              <TextInput
                style={styles.inputLimpio}
                placeholder="0000 0000 0000 0000"
                keyboardType="numeric"
                value={numeroTarjeta}
                onChangeText={formatearTarjeta}
                maxLength={19}
              />
            </View>

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.label}>Vencimiento</Text>
                <TextInput
                  style={styles.inputSimple}
                  placeholder="MM/AA"
                  keyboardType="numeric"
                  maxLength={5}
                  value={vencimiento}
                  onChangeText={formatearVencimiento}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.label}>CVV</Text>
                <TextInput
                  style={styles.inputSimple}
                  placeholder="123"
                  keyboardType="numeric"
                  maxLength={3}
                  secureTextEntry
                  value={cvv}
                  onChangeText={setCvv}
                />
              </View>
            </View>

            <View style={[styles.row, { marginTop: 10 }]}>
              <TouchableOpacity style={styles.btnSecundario} onPress={() => setMostrandoFormulario(false)}>
                <Text style={styles.btnTxtNegro}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnPrimario} onPress={guardarNuevaTarjeta}>
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
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: 'center' },
  formCard: { backgroundColor: "#FFF", padding: 20, borderRadius: 16, borderWidth: 1, borderColor: "#E2E8F0" },
  formTitulo: { fontSize: 18, fontWeight: "bold", marginBottom: 20, color: "#1A202C" },
  label: { fontSize: 12, color: "#718096", marginBottom: 8, fontWeight: "600" },
  btnPrimario: { backgroundColor: "#345195", padding: 15, borderRadius: 10, flex: 1, marginLeft: 10, alignItems: "center" },
  btnSecundario: { backgroundColor: "#EDF2F7", padding: 15, borderRadius: 10, flex: 1, marginRight: 10, alignItems: "center" },
  btnTxtBlanco: { color: "#FFF", fontWeight: "bold" },
  btnTxtNegro: { color: "#4A5568", fontWeight: "bold" },
  inputSimple: {
    backgroundColor: "#F7FAFC", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 12, padding: 15, fontSize: 16, color: "#2D3748", marginBottom: 20,
  },
  inputConIcono: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: "#F7FAFC", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 12, paddingHorizontal: 15, marginBottom: 20,
  },
  iconoInput: { marginRight: 10 },
  inputLimpio: { flex: 1, height: 55, fontSize: 18, color: "#2D3748", letterSpacing: 1 },
  emptyContainer: { alignItems: 'center', marginVertical: 40 },
  emptyText: { color: '#A0AEC0', marginTop: 10, fontSize: 16 }
});