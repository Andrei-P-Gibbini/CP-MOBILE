import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  deleteUser,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../../firebaseConfig';

// Chave usada para guardar localmente os dados (NÃO sensíveis) da sessão ativa.
// Nunca guarda a senha do usuário aqui.
const SESSION_KEY = '@CP4:session';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // onAuthStateChanged dispara automaticamente ao abrir o app, pois o Firebase restaura a sessão persistida pelo AsyncStorage(configurado em firebaseConfig.js via getReactNativePersistence).
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await AsyncStorage.setItem(
          SESSION_KEY,
          JSON.stringify({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            nome: firebaseUser.displayName || '',
          })
        );
      } else {
        setUser(null);
        await AsyncStorage.removeItem(SESSION_KEY);
      }
      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  async function signUp({ nome, email, senha }) {
    const credential = await createUserWithEmailAndPassword(auth, email, senha);
    if (nome) {
      await updateProfile(credential.user, { displayName: nome });
    }
    return credential.user;
  }

  async function signIn({ email, senha }) {
    const credential = await signInWithEmailAndPassword(auth, email, senha);
    return credential.user;
  }

  async function signOutUser() {
    await firebaseSignOut(auth);
    await AsyncStorage.removeItem(SESSION_KEY);
  }

  async function resetPassword(email) {
    await sendPasswordResetEmail(auth, email);
  }

  async function deleteAccount() {
    if (!auth.currentUser) return;
    await deleteUser(auth.currentUser);
    await AsyncStorage.removeItem(SESSION_KEY);
  }

  const value = {
    user,
    initializing,
    signUp,
    signIn,
    signOut: signOutUser,
    resetPassword,
    deleteAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
