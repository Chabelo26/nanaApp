// src/screens/ReportScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../styles/colors';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';

// Pantalla donde el usuario crea un nuevo reporte de denuncia.
const ReportScreen = ({ route, navigation }) => {
  const [image, setImage] = useState(null); // URI de la imagen tomada
  const [address, setAddress] = useState(''); // Dirección del reporte
  const [description, setDescription] = useState(''); // Descripción del incidente
  const [status, setStatus] = useState('No Seguro'); // Estado de seguridad seleccionado
  const [location, setLocation] = useState(route.params?.initialLocation || null); // Coordenadas iniciales si vienen desde Home

  const [locationMode, setLocationMode] = useState('gps'); // Modo de ubicación: gps o manual
  const [isSubmitting, setIsSubmitting] = useState(false); // Indicador de carga al enviar

  useEffect(() => {
    // Si el usuario elige GPS y aún no hay ubicación, pedir la ubicación actual
    if (locationMode === 'gps' && !location) {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          let loc = await Location.getCurrentPositionAsync({});
          setLocation(loc.coords);

          // Intentar autocompletar la dirección con geocodificación inversa
          try {
            let geocode = await Location.reverseGeocodeAsync(loc.coords);
            if (geocode.length > 0) {
              setAddress(`${geocode[0].street || ''} ${geocode[0].streetNumber || ''}, ${geocode[0].city || ''}`.trim());
            }
          } catch (e) {
            console.log('No se pudo autocompletar');
          }
        } else {
          Alert.alert('Permiso denegado', 'No podemos usar tu GPS. Escribe la dirección manualmente.');
          setLocationMode('manual');
        }
      })();
    }
  }, [locationMode]);

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permiso denegado', 'Se requieren permisos de cámara para tomar fotos.');
      return;
    }
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmitReport = async () => {
    if (!image || !description) {
      Alert.alert('Error', 'Por favor añade una foto y una descripción.');
      return;
    }

    if (!address.trim()) {
      Alert.alert('Error', 'La dirección es obligatoria.');
      return;
    }

    setIsSubmitting(true);

    try {
      let finalCoords = location;

      // Si el usuario ingresa la dirección manualmente, obtener lat/lng de la dirección
      if (locationMode === 'manual') {
        const geocoded = await Location.geocodeAsync(address);
        if (geocoded.length > 0) {
          finalCoords = {
            latitude: geocoded[0].latitude,
            longitude: geocoded[0].longitude,
          };
        } else {
          Alert.alert('Error', 'No pudimos encontrar esta dirección en el mapa. Sé más específico (ej. Calle, Número, Ciudad).');
          setIsSubmitting(false);
          return;
        }
      }

      if (!finalCoords) {
        Alert.alert('Error', 'Aún no tenemos coordenadas para poner el pin en el mapa.');
        setIsSubmitting(false);
        return;
      }

      // Subir la foto a Firebase Storage
      const response = await fetch(image);
      const blob = await response.blob();
      const filename = `reports/${Date.now()}.jpg`;
      const storageRef = ref(storage, filename);
      await uploadBytes(storageRef, blob);
      const imageUrl = await getDownloadURL(storageRef);

      // Guardar el reporte en Firestore
      await addDoc(collection(db, 'reports'), {
        imageUrl,
        address,
        description,
        status,
        latitude: finalCoords.latitude,
        longitude: finalCoords.longitude,
        createdAt: serverTimestamp(),
      });

      Alert.alert('Éxito', 'Tu reporte ha sido recibido.', [
        { text: 'OK', onPress: () => navigation.popToTop() },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Hubo un problema al enviar el reporte.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>NUEVA DENUNCIA ANÓNIMA</Text>

      <TouchableOpacity
        style={styles.imagePicker}
        onPress={takePhoto}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={image ? 'Foto de evidencia tomada. Toca para tomar otra.' : 'Tomar foto de evidencia'}
      >
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="camera" size={50} color={COLORS.inactive} />
            <Text style={styles.placeholderText}>Tomar Foto</Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.modeContainer}>
        <TouchableOpacity
          style={[styles.modeButton, locationMode === 'gps' && styles.modeButtonActive]}
          onPress={() => setLocationMode('gps')}
        >
          <Ionicons name="location" size={18} color={locationMode === 'gps' ? '#FFF' : COLORS.secondary} />
          <Text style={[styles.modeText, locationMode === 'gps' && { color: '#FFF' }]}>Usar GPS</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeButton, locationMode === 'manual' && styles.modeButtonActive]}
          onPress={() => {
            setLocationMode('manual');
            setLocation(null);
          }}
        >
          <Ionicons name="pencil" size={18} color={locationMode === 'manual' ? '#FFF' : COLORS.secondary} />
          <Text style={[styles.modeText, locationMode === 'manual' && { color: '#FFF' }]}>Escribir Dirección</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder={locationMode === 'gps' ? 'Confirma o edita la dirección...' : 'Escribe la dirección exacta para el mapa...'}
        value={address}
        onChangeText={setAddress}
        placeholderTextColor={COLORS.inactive}
        accessibilityLabel="Campo de texto para la dirección del reporte"
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Descripción detallada (qué observaste, personas, etc.)..."
        value={description}
        onChangeText={setDescription}
        multiline={true}
        numberOfLines={6}
        placeholderTextColor={COLORS.inactive}
        accessibilityLabel="Campo de texto para la descripción detallada"
      />

      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Estado del Lugar:</Text>
        <View style={styles.statusButtons}>
          {['No Seguro', 'En Proceso', 'Seguro'].map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.statusButton, status === s && { backgroundColor: getStatusColor(s) }]}
              onPress={() => setStatus(s)}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`Estado del lugar: ${s}`}
              accessibilityState={{ selected: status === s }}
            >
              <Text style={[styles.statusButtonText, status === s && { color: '#FFFFFF' }]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.submitButton, isSubmitting && { opacity: 0.7 }]}
        onPress={handleSubmitReport}
        disabled={isSubmitting}
      >
        {isSubmitting ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitButtonText}>Enviar Reporte</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
};

const getStatusColor = (state) => {
  switch (state) {
    case 'No Seguro':
      return COLORS.error;
    case 'En Proceso':
      return 'orange';
    case 'Seguro':
      return 'green';
    default:
      return 'gray';
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 20, gap: 15 },
  title: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary, textAlign: 'center', marginBottom: 10 },
  imagePicker: { width: '100%', height: 200, backgroundColor: COLORS.card, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  image: { width: '100%', height: '100%' },
  placeholder: { justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: COLORS.inactive, marginTop: 8 },
  modeContainer: { flexDirection: 'row', backgroundColor: COLORS.card, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
  modeButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, gap: 5 },
  modeButtonActive: { backgroundColor: COLORS.primary },
  modeText: { color: COLORS.secondary, fontWeight: '600', fontSize: 14 },
  input: { backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: 15, fontSize: 16, color: COLORS.text },
  textArea: { height: 120, textAlignVertical: 'top' },
  statusContainer: { marginTop: 10 },
  statusLabel: { fontSize: 16, fontWeight: 'bold', color: COLORS.secondary, marginBottom: 8 },
  statusButtons: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  statusButton: { flex: 1, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  statusButtonText: { color: COLORS.secondary, fontWeight: '500' },
  submitButton: { marginTop: 20, backgroundColor: COLORS.primary, paddingVertical: 15, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  submitButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});

export default ReportScreen;