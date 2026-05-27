// src/App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/index';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Componente principal de la aplicación. Aquí se configura la navegación y el área segura.
export default function AppMain() {
  return (
    <SafeAreaProvider>
      {/* NavigationContainer es el contenedor global de React Navigation */}
      <NavigationContainer>
        {/* AppNavigator define las pantallas y la lógica de navegación */}
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}