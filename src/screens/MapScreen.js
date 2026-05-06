import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons'; // Iconos de Expo

export default function MapScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [reports, setReports] = useState([]); // Aquí guardarás los datos de Firestore
  const [loading, setLoading] = useState(true);

  // 1. Obtener ubicación actual al cargar
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Se requiere permiso de ubicación para ver el mapa');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.05, // Zoom
        longitudeDelta: 0.05,
      });
      setLoading(false);
    })();

    // AQUÍ DEBERÍAS LLAMAR A TU FUNCIÓN DE FIRESTORE:
    // fetchReportsFromFirestore().then(data => setReports(data));
    // Ejemplo de dato dummy:
    setReports([
      { id: '1', lat: 20.5888, lng: -100.3899, status: 'No Seguro', title: 'Rancho Izaguirre' }
    ]);
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#D32F2F" />
        <Text>Cargando Mapa...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE} // Recomendado para mejor estilo
        style={styles.map}
        initialRegion={location}
        showsUserLocation={true}
      >
        {/* Renderizar los pines de la base de datos */}
        {reports.map((report) => (
          <Marker
            key={report.id}
            coordinate={{ latitude: report.lat, longitude: report.lng }}
            title={report.title}
            description={report.status}
            pinColor={report.status === 'No Seguro' ? '#D32F2F' : '#4CAF50'}
            onCalloutPress={() => navigation.navigate('Detail', { reportId: report.id })}
          />
        ))}
      </MapView>

      {/* Botón Flotante para Reportar (El "+" del Figma) */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('Report', { coords: location })}
      >
        <Ionicons name="add" size={35} color="white" />
      </TouchableOpacity>

      {/* Botón de regreso (Opcional, si no usas Header) */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="home" size={24} color="#455A64" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFillObject },
  map: { ...StyleSheet.absoluteFillObject },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#D32F2F',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    bottom: 30,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 30,
    elevation: 4,
  }
});