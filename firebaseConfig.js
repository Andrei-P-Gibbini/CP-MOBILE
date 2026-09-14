import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCii8aOHzqPcp-ZU9NqjapPublJJbfrMeo',
  authDomain: 'cp4-mobile-20613.firebaseapp.com',
  projectId: 'cp4-mobile-20613',
  storageBucket: 'cp4-mobile-20613.firebasestorage.app',
  messagingSenderId: '457375994025',
  appId: '1:457375994025:web:1e452009bd5f996acc99b8',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  // Em caso de hot-reload o initializeAuth pode já ter sido chamado antes
  auth = getAuth(app);
}

export { app, auth };