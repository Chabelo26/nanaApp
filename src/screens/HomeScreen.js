// src/screens/HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet, Image, ImageBackground } from 'react-native';
import MyButton from '../components/MyButton';
import { COLORS } from '../styles/colors';
import * as Location from 'expo-location';

// Pantalla principal de la aplicación. Desde aquí el usuario puede ver el mapa o iniciar un reporte rápido.
const HomeScreen = ({ navigation }) => {
  const handleDirectReport = async () => {
    // 1. Solicitar permiso de ubicación
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Se necesitan permisos de ubicación para reportar directamente.');
      return;
    }

    // 2. Obtener ubicación actual
    let location = await Location.getCurrentPositionAsync({});
    console.log('Ubicación obtenida:', location.coords);

    // 3. Navegar a la pantalla de reportar, pasando la ubicación
    navigation.navigate('Report', { initialLocation: location.coords });
  };

return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../assets/icon.png')}
          style={styles.logo} 
          resizeMode="contain"
          // --- ACCESIBILIDAD PARA LA IMAGEN ---
          accessible={true}
          accessibilityRole="image"
          accessibilityLabel="Logotipo de la aplicación Denuncia Ciudadana" 
        />
        <Text 
          style={styles.appName}
          // --- ACCESIBILIDAD PARA EL TÍTULO ---
          accessibilityRole="header"
        >
          DENUNCIA CIUDADANA
        </Text>
      </View>
      
<View style={styles.buttonContainer}>
        <MyButton 
          title="Ver Mapa" 
          onPress={() => navigation.navigate('Map')} 
          style={styles.mainButton}
          accessibilityHint="Abre un mapa mostrando todos los reportes de tu zona"
        />
        <MyButton 
          title="Reportar Ahora" 
          onPress={handleDirectReport} 
          style={styles.directButton}
          accessibilityHint="Inicia una nueva denuncia usando tu ubicación actual de GPS"
        />
      </View>
    </View>
  );
}; // <-- 1. AQUÍ CERRAMOS EL COMPONENTE HomeScreen CORRECTAMENTE

// 2. LOS ESTILOS QUEDAN TOTALMENTE AFUERA DE LA FUNCIÓN
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
    justifyContent: 'space-between',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    tintColor: COLORS.primary,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 20,
  },
  buttonContainer: {
    paddingBottom: 30,
    gap: 15,
  },
  mainButton: {
    backgroundColor: COLORS.secondary,
  },
  directButton: {
    backgroundColor: COLORS.primary,
  },
}); 

export default HomeScreen;