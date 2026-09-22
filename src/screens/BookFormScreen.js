import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import GenreSelect from '../components/GenreSelect';
import { useAuth } from '../context/AuthContext';
import { createBook, updateBook } from '../services/booksService';
import { validateBookForm } from '../utils/bookValidation';

export default function BookFormScreen({ navigation, route }) {
  const { user } = useAuth();
  const livroExistente = route.params?.livro || null;
  const isEditing = !!livroExistente;

  const [titulo, setTitulo] = useState(livroExistente?.titulo || '');
  const [autor, setAutor] = useState(livroExistente?.autor || '');
  const [editora, setEditora] = useState(livroExistente?.editora || '');
  const [anoPublicacao, setAnoPublicacao] = useState(
    livroExistente?.anoPublicacao ? String(livroExistente.anoPublicacao) : ''
  );
  const [genero, setGenero] = useState(livroExistente?.genero || '');
  const [opiniao, setOpiniao] = useState(livroExistente?.opiniao || '');

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  async function handleSave() {
    setFormError(null);

    const dados = { titulo, autor, editora, anoPublicacao, genero, opiniao };
    const validationError = validateBookForm(dados);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        titulo: titulo.trim(),
        autor: autor.trim(),
        editora: editora.trim(),
        anoPublicacao: Number(anoPublicacao),
        genero,
        opiniao: opiniao.trim(),
      };

      if (isEditing) {
        await updateBook(user.uid, livroExistente.id, payload);
      } else {
        await createBook(user.uid, payload);
      }

      Alert.alert(
        'Sucesso',
        isEditing ? 'Livro atualizado com sucesso!' : 'Livro cadastrado com sucesso!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      setFormError('Não foi possível salvar o registro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{isEditing ? 'Editar livro' : 'Novo livro'}</Text>
        <Text style={styles.subtitle}>
          {isEditing
            ? 'Atualize as informações do registro.'
            : 'Registre o que você achou de um livro que leu.'}
        </Text>

        <Input
          label="Nome do livro"
          placeholder="Ex: Dom Casmurro"
          value={titulo}
          onChangeText={setTitulo}
        />
        <Input
          label="Autor"
          placeholder="Ex: Machado de Assis"
          value={autor}
          onChangeText={setAutor}
        />
        <Input
          label="Editora"
          placeholder="Ex: Companhia das Letras"
          value={editora}
          onChangeText={setEditora}
        />
        <Input
          label="Ano de publicação"
          placeholder="Ex: 1899"
          keyboardType="numeric"
          maxLength={4}
          value={anoPublicacao}
          onChangeText={setAnoPublicacao}
        />

        <GenreSelect value={genero} onChange={setGenero} />

        <Input
          label="Sua opinião"
          placeholder="O que você achou do livro?"
          value={opiniao}
          onChangeText={setOpiniao}
          multiline
          numberOfLines={4}
          style={styles.textArea}
        />

        {formError ? <Text style={styles.errorBanner}>{formError}</Text> : null}

        <Button
          title={isEditing ? 'Salvar alterações' : 'Cadastrar livro'}
          onPress={handleSave}
          loading={loading}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#f5f7fa' },
  container: {
    flexGrow: 1,
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1f2933',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#616e7c',
    marginBottom: 24,
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  errorBanner: {
    color: '#e5484d',
    backgroundColor: '#fdecea',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 13,
  },
});
