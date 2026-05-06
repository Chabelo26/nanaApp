// src/screens/ReportScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import MyButton from '../components/MyButton';
import { COLORS } from '../styles/colors';

const ReportScreen = ({ route, navigation }) => {
  // Estado para los datos del reporte
  const [image, setImage] = useState(null);
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('No Seguro'); // Valor por defecto
  const [location, setLocation] = useState(route.params?.initialLocation || null);

  // Intentar obtener la ubicación si no fue pasada
  useEffect(() => {
    if (!location) {
      (async () => {
        let { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
        if (locationStatus === 'granted') {
          let loc = await Location.getCurrentPositionAsync({});
          setLocation(loc.coords);
        }
      })();
    }
  }, [location]);

  // Función para tomar/seleccionar foto
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5, // Calidad media para no saturar
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Función simulada de envío (a Firestore/Storage)
  const handleSubmitReport = () => {
    if (!image || !address || !description) {
      Alert.alert('Error', 'Por favor, completa todos los campos y añade una foto.');
      return;
    }

    // AQUI ES DONDE EN EL FUTURO CONECTAREMOS CON FIREBASE
    // const mockReportData = {
    //   imageUrl: image, // En Firebase, esto sería la URL de Storage
    //   address,
    //   description,
    //   status,
    //   location: {
    //     latitude: location.latitude,
    //     longitude: location.longitude,
    //   },
    //   timestamp: new Date().toISOString(),
    // };
    // console.log('Enviando reporte simulado:', mockReportData);

    Alert.alert(
      'Reporte Enviado',
      'Tu reporte ha sido recibido de forma anónima.',
      [
        { text: 'OK', onPress: () => navigation.popToTop() } // Regresar al home
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>NUEVA DENUNCIA ANÓNIMA</Text>

      {/* Sección de Foto */}
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="camera" size={50} color={COLORS.inactive} />
            <Text style={styles.placeholderText}>Añadir Foto</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Ubicación (Información) */}
      <View style={styles.locationInfo}>
        <Ionicons name="pin" size={20} color={COLORS.secondary} />
        <Text style={styles.locationText}>
          {location 
            ? `Ubicación: (${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)})` 
            : 'Ubicación no obtenida.'}
        </Text>
      </View>

      {/* Input de Dirección (Manual) */}
      <TextInput
        style={styles.input}
        placeholder="Dirección aproximada..."
        value={address}
        onChangeText={setAddress}
        placeholderTextColor={COLORS.inactive}
      />

      {/* Input de Descripción */}
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Descripción detallada (qué observaste, cuántas personas, etc.)..."
        value={description}
        onChangeText={setDescription}
        multiline={true}
        numberOfLines={6}
        placeholderTextColor={COLORS.inactive}
      />

      {/* Selector de Estado (Simulado con botones simples por ahora) */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Estado del Lugar:</Text>
        <View style={styles.statusButtons}>
          {['No Seguro', 'En Proceso', 'Seguro'].map(s => (
            <TouchableOpacity 
              key={s}
              style={[
                styles.statusButton, 
                status === s && { backgroundColor: getStatusColor(s) }
              ]}
              onPress={() => setStatus(s)}
            >
              <Text style={[styles.statusButtonText, status === s && { color: '#FFFFFF' }]}>
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Botón de Enviar */}
      <MyButton 
        title="Enviar Reporte" 
        onPress={handleSubmitReport} 
        style={styles.submitButton}
      />
    </ScrollView>
  );
};

// Función auxiliar para colores de estado
const getStatusColor = (state) => {
  switch (state) {
    case 'No Seguro': return COLORS.error;
    case 'En Proceso': return 'orange';
    case 'Seguro': return 'green';
    default: return 'gray';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
    gap: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  imagePicker: {
    width: '100%',
    height: 200,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: COLORS.inactive,
    marginTop: 8,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: 10,
    borderRadius: 8,
    gap: 8,
  },
  locationText: {
    color: COLORS.secondary,
    fontSize: 14,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: COLORS.text,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  statusContainer: {
    marginTop: 10,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginBottom: 8,
  },
  statusButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  statusButton: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  statusButtonText: {
    color: COLORS.secondary,
    fontWeight: '500',
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
  },
});

export default ReportScreen;