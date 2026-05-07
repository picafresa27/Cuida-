import { Link } from "expo-router";
import React from "react";
import {
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo y Nombre - RUTA CORREGIDA */}
        <Image
          source={require("./img/logo_cuida+.jpg")}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Eslogan y Descripción */}
        <Text style={styles.titulo}>Mucho más que salud.</Text>
        <Text style={styles.descripcion}>
          Agenda citas, administra consultorios y da seguimiento médico desde
          una sola app.
        </Text>

        {/* Botones */}
        <View style={styles.buttonContainer}>
          <Link href="/interfaces/inicioSesion" asChild>
            <TouchableOpacity style={styles.botonPrimario}>
              <Text style={styles.textoBlanco}>Iniciar sesión</Text>
            </TouchableOpacity>
          </Link>
          {/*@ts-ignore*/}
          <Link href="/interfaces/registro" asChild>
            <TouchableOpacity style={styles.botonSecundario}>
              <Text style={styles.textoAzul}>Crear cuenta</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Texto al pie */}
        <Text style={styles.pieDePagina}>
          Consulta especialidades, reserva con anticipo y recibe recordatorios
          de tu cita.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7fafc", 
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 10,
  },
  descripcion: {
    fontSize: 14,
    color: "#7D7D7D",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 40,
  },
  buttonContainer: {
    width: "100%",
    gap: 15,
    marginBottom: 40,
  },
  botonPrimario: {
    backgroundColor: "#345195", 
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  botonSecundario: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  textoBlanco: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  textoAzul: {
    color: "#1A1A1A",
    fontSize: 16,
    fontWeight: "600",
  },
  pieDePagina: {
    fontSize: 12,
    color: "#9A9A9A",
    textAlign: "center",
    paddingHorizontal: 20,
  },
});