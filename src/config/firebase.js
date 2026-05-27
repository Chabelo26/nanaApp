// src/config/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuración de Firebase para este proyecto
const firebaseConfig = {
  apiKey: "AIzaSyDCILlZVkY45Xh8smQi-_Nf2TJIEAbMIGo",
  authDomain: "nana-4e3a8.firebaseapp.com",
  projectId: "nana-4e3a8",
  storageBucket: "nana-4e3a8.firebasestorage.app",
  messagingSenderId: "724079699254",
  appId: "1:724079699254:web:1d9d6479af89dab46d3f97",
  measurementId: "G-0EWY5RTT2T"
};

// Inicializar Firebase y habilitar servicios necesarios
const app = initializeApp(firebaseConfig);

// Exportar la instancia de Firestore para consultas de base de datos
export const db = getFirestore(app);

// Exportar la instancia de Storage para subir y descargar archivos
export const storage = getStorage(app);