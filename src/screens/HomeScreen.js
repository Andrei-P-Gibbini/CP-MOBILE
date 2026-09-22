import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Olá, {user?.displayName || user?.email}!</Text>
      <Text style={styles.subtitle}>O que você achou do último livro que leu?</Text>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('BooksList')}
        activeOpacity={0.85}
      >
        <Text style={styles.cardTitle}>📚 Meus livros</Text>
        <Text style={styles.cardText}>Veja, edite ou exclua os livros que você cadastrou.</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('BookForm')}
        activeOpacity={0.85}
      >
        <Text style={styles.cardTitle}>➕ Novo livro</Text>
        <Text style={styles.cardText}>Cadastre um novo livro e registre sua opinião.</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Profile')}
        activeOpacity={0.85}
      >
        <Text style={styles.cardTitle}>👤 Perfil</Text>
        <Text style={styles.cardText}>Veja seus dados, saia ou exclua sua conta.</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 32,
    backgroundColor: '#f5f7fa',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2933',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#616e7c',
    marginBottom: 28,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e4e7eb',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2933',
    marginBottom: 4,
  },
  cardText: {
    fontSize: 13,
    color: '#616e7c',
  },
});
