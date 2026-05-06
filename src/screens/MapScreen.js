// src/screens/MapScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { COLORS } from '../styles/colors';
import { Ionicons } from '@expo/vector-icons'; // Para el icono de +

// Mock de datos: Estos datos vendrían de Firestore
const mockReports = [
  { id: '1', latitude: 19.4326, longitude: -99.1332, state: 'No Seguro' }, // CDMX
  { id: '2', latitude: 20.6597, longitude: -103.3496, state: 'En Proceso' }, // Guadalajara
  { id: '3', latitude: 25.6866, longitude: -100.3161, state: 'Seguro' }, // Monterrey
];

const MapScreen = ({ navigation }) => {
  const [region, setRegion] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Se necesitan permisos de ubicación para mostrar el mapa.');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  const getMarkerColor = (state) => {
    switch (state) {
      case 'No Seguro': return 'red';
      case 'En Proceso': return 'orange';
      case 'Seguro': return 'green';
      default: return 'gray';
    }
  };

  const handleMapPress = (e) => {
    // Al presionar en el mapa, podemos opcionalmente tomar esa ubicación
    // console.log('Coordenadas presionadas:', e.nativeEvent.coordinate);
  };

  return (
    <View style={styles.container}>
      {region ? (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={region}
          onLongPress={handleMapPress} // Ejemplo de long press
        >
          {mockReports.map(report => (
            <Marker
              key={report.id}
              coordinate={{ latitude: report.latitude, longitude: report.longitude }}
              title={report.state}
              pinColor={getMarkerColor(report.state)}
            />
          ))}
        </MapView>
      ) : (
        <View style={styles.loadingContainer}><Text>Cargando mapa...</Text></View>
      )}

      {/* Botón Flotante "+" */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate('Report', { initialLocation: null })}
      >
        <Ionicons name="add" size={30} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: COLORS.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default MapScreen;