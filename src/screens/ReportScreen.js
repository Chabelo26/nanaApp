// src/screens/ReportScreen.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Image, TouchableOpacity, Text, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

export default function ReportScreen() {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handleSubmit = async () => {
    // Aquí conectarás con src/services/database.js para:
    // 1. Subir imagen a Firebase Storage y obtener URL.
    // 2. Guardar URL + Descripción + Coordenadas en Firestore.
    console.log("Enviando reporte...");
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20, backgroundColor: '#F8F9FA' }}>
      <TouchableOpacity onPress={pickImage} style={styles.photoBox}>
        {image ? <Image source={{ uri: image }} style={styles.preview} /> : <Text>Subir Foto</Text>}
      </TouchableOpacity>

      <TextInput 
        placeholder="Dirección (Opcional si usas GPS)" 
        style={styles.input} 
        multiline
      />
      
      <TextInput 
        placeholder="Descripción detallada" 
        style={[styles.input, { height: 100 }]} 
        multiline
        onChangeText={setDescription}
      />

      <TouchableOpacity style={styles.sendButton} onPress={handleSubmit}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>ENVIAR REPORTE ANÓNIMO</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = {
  photoBox: { height: 200, backgroundColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center', borderRadius: 10, marginBottom: 20 },
  preview: { width: '100%', height: '100%', borderRadius: 10 },
  input: { backgroundColor: '#FFF', padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#DDD' },
  sendButton: { backgroundColor: '#D32F2F', padding: 20, borderRadius: 10, alignItems: 'center' }
};