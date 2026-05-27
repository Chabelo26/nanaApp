// src/screens/MapScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../styles/colors';

// IMPORTACIONES DE FIREBASE
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

const MapScreen = ({ navigation }) => {
  const [region, setRegion] = useState(null); // Región inicial del mapa
  const [reports, setReports] = useState([]); // Reportes cargados desde Firestore

  useEffect(() => {
    // Pedir permisos y establecer la región inicial del usuario
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Se necesitan permisos de ubicación.');
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

    // Escuchar cambios en la colección de reportes en Firebase
    const unsubscribe = onSnapshot(collection(db, 'reports'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReports(data);
    });

    return () => unsubscribe(); // Limpiar listener al salir
  }, []);

  // Determina el color del pin según el estado del reporte
  const getMarkerColor = (state) => {
    switch (state) {
      case 'No Seguro': return 'red';
      case 'En Proceso': return 'orange';
      case 'Seguro': return 'green';
      default: return 'gray';
    }
  };

  return (
    <View style={styles.container}>
      {region ? (
        <MapView provider={PROVIDER_GOOGLE} style={styles.map} region={region}>
          {/* Mostrar cada reporte como marcador en el mapa */}
          {reports.map(report => (
            <Marker
              key={report.id}
              coordinate={{ latitude: report.latitude, longitude: report.longitude }}
              pinColor={getMarkerColor(report.status)}
            >
              {/* Callout se muestra cuando el usuario toca el pin */}
              <Callout onPress={() => navigation.navigate('Detail', { report })}>
                <View style={{ padding: 5, alignItems: 'center' }}>
                  <Text style={{ fontWeight: 'bold' }}>{report.status}</Text>
                  <Text style={{ fontSize: 12 }}>Toca para ver detalles</Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      ) : (
        <View style={styles.loadingContainer}><Text>Cargando mapa...</Text></View>
      )}

      {/* Botón flotante para crear un nuevo reporte */}
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
  container: { flex: 1 },
  map: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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