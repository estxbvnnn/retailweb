import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateEmail,
  updateProfile,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { environment } from '../environments/environment';
// Firestore
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const app = initializeApp(environment.firebase);

// Analytics opcional en navegador; ignora errores si no está soportado
try {
  if (typeof window !== 'undefined' && environment.firebase?.measurementId) {
    getAnalytics(app);
  }
} catch {
  // ignore
}

// Instancia de Firestore
const db = getFirestore(app);

// Exporta helpers de Auth y Firestore para uso en servicios
export {
  app,
  db,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateEmail,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
  // Firestore
  getFirestore,
  doc,
  setDoc,
  serverTimestamp
};