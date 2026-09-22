import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { subscribeToBooks, deleteBook } from '../services/booksService';

export default function BooksListScreen({ navigation }) {
  const { user } = useAuth();
  const [livros, setLivros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToBooks(
      user.uid,
      (livrosAtualizados) => {
        setLivros(livrosAtualizados);
        setLoading(false);
      },
      (error) => {
        setErrorMessage('Não foi possível carregar seus livros. Tente novamente.');
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [user]);

  function confirmDelete(livro) {
    Alert.alert(
      'Excluir registro',
      `Tem certeza que deseja excluir "${livro.titulo}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => handleDelete(livro),
        },
      ]
    );
  }

  async function handleDelete(livro) {
    setErrorMessage(null);
    setDeletingId(livro.id);
    try {
      await deleteBook(user.uid, livro.id);
      Alert.alert('Sucesso', 'Livro excluído com sucesso!');
    } catch (error) {
      setErrorMessage('Não foi possível excluir o registro. Tente novamente.');
    } finally {
      setDeletingId(null);
    }
  }

  function renderItem({ item }) {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.titulo}
          </Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.genero}</Text>
          </View>
        </View>

        <Text style={styles.cardSubtitle}>
          {item.autor} · {item.editora} · {item.anoPublicacao}
        </Text>

        {item.opiniao ? (
          <Text style={styles.cardOpinion} numberOfLines={3}>
            "{item.opiniao}"
          </Text>
        ) : null}

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('BookForm', { livro: item })}
          >
            <Text style={styles.actionText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => confirmDelete(item)}
            disabled={deletingId === item.id}
          >
            {deletingId === item.id ? (
              <ActivityIndicator size="small" color="#e5484d" />
            ) : (
              <Text style={[styles.actionText, styles.deleteText]}>Excluir</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2b6cb0" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {errorMessage ? <Text style={styles.errorBanner}>{errorMessage}</Text> : null}

      <FlatList
        data={livros}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={livros.length === 0 ? styles.emptyList : styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Nenhum registro encontrado.</Text>
            <Text style={styles.emptySubtext}>
              Toque em "Novo livro" para cadastrar sua primeira opinião.
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('BookForm')}
        activeOpacity={0.85}
      >
        <Text style={styles.fabText}>+ Novo livro</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f7fa',
  },
  list: {
    padding: 16,
    paddingBottom: 96,
  },
  emptyList: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 96,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2933',
    marginBottom: 6,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#616e7c',
    textAlign: 'center',
  },
  errorBanner: {
    color: '#e5484d',
    backgroundColor: '#fdecea',
    padding: 10,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    fontSize: 13,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e4e7eb',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1f2933',
    flex: 1,
    marginRight: 8,
  },
  badge: {
    backgroundColor: '#e8f1fb',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2b6cb0',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#616e7c',
    marginTop: 4,
  },
  cardOpinion: {
    fontSize: 13,
    color: '#3e4c59',
    fontStyle: 'italic',
    marginTop: 10,
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: 14,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2b6cb0',
    marginRight: 8,
  },
  deleteButton: {
    borderColor: '#e5484d',
    marginRight: 0,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2b6cb0',
  },
  deleteText: {
    color: '#e5484d',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 20,
    backgroundColor: '#2b6cb0',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  fabText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});
