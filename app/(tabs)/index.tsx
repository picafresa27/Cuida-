import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>¡Cuida+ está en marcha!</Text>
      <Text>Aquí empezaremos a crear las interfaces.</Text>
    </View>
  );
} //hola

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2b5a9e',
  },
});