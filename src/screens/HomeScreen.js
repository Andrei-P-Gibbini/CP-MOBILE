import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { translateFirebaseError } from '../utils/validation';

export default function HomeScreen() {
  const { user, signOut, deleteAccount } = useAuth();
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  async function handleLogout() {
    setErrorMessage(null);
    setLoadingLogout(true);
    try {
      await signOut();
    } catch (error) {
      setErrorMessage(translateFirebaseError(error));
    } finally {
      setLoadingLogout(false);
    }
  }

  function confirmDeleteAccount() {
    Alert.alert(
      'Excluir conta',
      'Tem certeza que deseja excluir sua conta? Essa ação não poderá ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: handleDeleteAccount },
      ]
    );
  }

  async function handleDeleteAccount() {
    setErrorMessage(null);
    setLoadingDelete(true);
    try {
      await deleteAccount();
    } catch (error) {
      setErrorMessage(translateFirebaseError(error));
    } finally {
      setLoadingDelete(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {(user?.displayName || user?.email || '?').charAt(0).toUpperCase()}
        </Text>
      </View>

      <Text style={styles.title}>Minha conta</Text>

      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Nome</Text>
        <Text style={styles.infoValue}>{user?.displayName || '—'}</Text>

        <Text style={[styles.infoLabel, styles.infoLabelSpaced]}>E-mail</Text>
        <Text style={styles.infoValue}>{user?.email}</Text>
      </View>

      {errorMessage ? <Text style={styles.errorBanner}>{errorMessage}</Text> : null}

      <Button
        title="Sair (Logout)"
        variant="secondary"
        onPress={handleLogout}
        loading={loadingLogout}
      />

      <Button
        title="Excluir conta"
        variant="danger"
        onPress={confirmDeleteAccount}
        loading={loadingDelete}
        style={styles.deleteButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 24,
    paddingTop: 48,
    backgroundColor: '#f5f7fa',
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#2b6cb0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '700',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2933',
    marginBottom: 24,
  },
  infoCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e4e7eb',
  },
  infoLabel: {
    fontSize: 12,
    color: '#9aa5b1',
    textTransform: 'uppercase',
  },
  infoLabelSpaced: {
    marginTop: 12,
  },
  infoValue: {
    fontSize: 16,
    color: '#1f2933',
    marginTop: 2,
  },
  errorBanner: {
    width: '100%',
    color: '#e5484d',
    backgroundColor: '#fdecea',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 13,
    textAlign: 'center',
  },
  deleteButton: {
    marginTop: 12,
  },
});
