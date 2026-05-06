// src/navigation/index.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { COLORS } from '../styles/colors';

// Importar pantallas
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import ReportScreen from '../screens/ReportScreen';

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
        cardStyle: { backgroundColor: COLORS.background }, // Fondo global claro
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ headerShown: false }} // Ocultar header en Home
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
    </Stack.Navigator>
  );
};

export default AppNavigator;