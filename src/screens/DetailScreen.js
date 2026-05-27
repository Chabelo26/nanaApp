// src/screens/DetailScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { COLORS } from '../styles/colors';
import MyButton from '../components/MyButton';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

// Pantalla de detalles que muestra información de un reporte y permite actualizar su estado.
const DetailScreen = ({ route, navigation }) => {
  const { report } = route.params; 
  // Estado local para actualizar el color en pantalla instantáneamente
  const [currentStatus, setCurrentStatus] = useState(report.status);

  // Función para actualizar en Firebase
  // Actualiza el estado del reporte en Firebase y en la pantalla
  const handleUpdateStatus = async (newStatus) => {
    setCurrentStatus(newStatus); // Actualiza la pantalla rápido
    try {
      const reportRef = doc(db, 'reports', report.id);
      await updateDoc(reportRef, {
        status: newStatus
      });
      Alert.alert('Actualizado', 'El estado del reporte ha cambiado.');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo actualizar el estado.');
      setCurrentStatus(report.status); // Si falla, regresa al estado original
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {report.imageUrl ? (
        <Image source={{ uri: report.imageUrl }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}><Text>Sin imagen</Text></View>
      )}

      {/* AQUÍ ESTÁN LOS BOTONES PARA CAMBIAR EL ESTADO */}
      <View style={styles.statusContainer}>
        <Text style={styles.label}>Actualizar Estado:</Text>
        <View style={styles.statusButtons}>
          {['No Seguro', 'En Proceso', 'Seguro'].map(s => (
            <TouchableOpacity 
              key={s}
              style={[
                styles.statusButton, 
                currentStatus === s && { backgroundColor: getStatusColor(s) }
              ]}
              onPress={() => handleUpdateStatus(s)}
            >
              <Text style={[styles.statusButtonText, currentStatus === s && { color: '#FFFFFF' }]}>
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.label}>Dirección:</Text>
        <Text style={styles.text}>{report.address}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.label}>Detalles de Evidencia:</Text>
        <Text style={styles.text}>{report.description}</Text>
      </View>

      <MyButton title="Regresar" onPress={() => navigation.goBack()} style={{ marginTop: 20 }} />
    </ScrollView>
  );
};

// Asigna colores a los botones según el estado del reporte
const getStatusColor = (state) => {
  switch (state) {
    case 'No Seguro': return COLORS.error;
    case 'En Proceso': return 'orange';
    case 'Seguro': return 'green';
    default: return 'gray';
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 20 },
  image: { width: '100%', height: 250, borderRadius: 12, marginBottom: 15 },
  placeholder: { width: '100%', height: 250, backgroundColor: COLORS.border, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  infoCard: { backgroundColor: COLORS.card, padding: 15, borderRadius: 8, marginBottom: 15 },
  label: { fontSize: 14, color: COLORS.inactive, marginBottom: 5 },
  text: { fontSize: 16, color: COLORS.text },
  statusContainer: { backgroundColor: COLORS.card, padding: 15, borderRadius: 8, marginBottom: 15 },
  statusButtons: { flexDirection: 'row', justifyContent: 'space-between', gap: 5 },
  statusButton: { flex: 1, borderWidth: 1, borderColor: COLORS.border, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  statusButtonText: { color: COLORS.secondary, fontWeight: '500', fontSize: 12, textAlign: 'center' },
});

export default DetailScreen;