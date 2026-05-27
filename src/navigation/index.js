// src/navigation/index.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { COLORS } from '../styles/colors';

// Importar pantallas principales de la aplicación
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import ReportScreen from '../screens/ReportScreen';
import DetailScreen from '../screens/DetailScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.background,
        },
        headerTintColor: COLORS.primary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        cardStyle: { backgroundColor: COLORS.background }, // Estilo de fondo uniforme para todas las pantallas
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ headerShown: false }} // Home no muestra la barra superior
      />
      <Stack.Screen 
        name="Map" 
        component={MapScreen} 
        options={{ title: 'Mapa de Reportes' }}
      />
      <Stack.Screen 
        name="Report" 
        component={ReportScreen} 
        options={{ title: 'Reportar Denuncia' }}
      />
      <Stack.Screen 
        name="Detail" 
        component={DetailScreen} 
        options={{ title: 'Detalles' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;