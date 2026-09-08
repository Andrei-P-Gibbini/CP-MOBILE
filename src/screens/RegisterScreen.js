import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { validateRegisterForm, translateFirebaseError } from '../utils/validation';

export default function RegisterScreen({ navigation }) {
  const { signUp } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  async function handleRegister() {
    setFormError(null);
    const validationError = validateRegisterForm({ nome, email, senha, confirmarSenha });
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setLoading(true);
    try {
      await signUp({ nome: nome.trim(), email: email.trim(), senha });
      
    } catch (error) {
      setFormError(translateFirebaseError(error));
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
        <Text style={styles.title}>Criar conta</Text>
        <Text style={styles.subtitle}>Preencha os dados para se cadastrar</Text>

        <Input label="Nome" placeholder="Seu nome completo" value={nome} onChangeText={setNome} />
        <Input
          label="E-mail"
          placeholder="seuemail@exemplo.com"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <Input
          label="Senha"
          placeholder="Mínimo de 6 caracteres"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />
        <Input
          label="Confirmação de senha"
          placeholder="Repita a senha"
          secureTextEntry
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
        />

        {formError ? <Text style={styles.errorBanner}>{formError}</Text> : null}

        <Button title="Cadastrar" onPress={handleRegister} loading={loading} />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Já tem uma conta?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerLink}> Entrar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#f5f7fa' },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2933',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#616e7c',
    marginBottom: 24,
  },
  errorBanner: {
    color: '#e5484d',
    backgroundColor: '#fdecea',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 13,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 28,
  },
  footerText: {
    color: '#616e7c',
    fontSize: 14,
  },
  footerLink: {
    color: '#2b6cb0',
    fontSize: 14,
    fontWeight: '700',
  },
});
