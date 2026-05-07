import { View, Text, StyleSheet } from "react-native";
import React from "react";

export default function AgendaScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Agenda Médica</Text>
      <Text>Aquí conectaremos el calendario en tiempo real</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7FAFC",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#345195",
    marginBottom: 10,
  }
});