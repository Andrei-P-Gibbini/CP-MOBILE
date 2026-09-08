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
import { validateLoginForm, translateFirebaseError } from '../utils/validation';

export default function LoginScreen({ navigation }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  async function handleLogin() {
    setFormError(null);
    const validationError = validateLoginForm({ email, senha });
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setLoading(true);
    try {
      await signIn({ email: email.trim(), senha });
      
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
        <Text style={styles.title}>Entrar</Text>
        <Text style={styles.subtitle}>Acesse sua conta para continuar</Text>

        <Input
          label="E-mail"
          placeholder="seuemail@exemplo.com"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <Input
          label="Senha"
          placeholder="Sua senha"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        {formError ? <Text style={styles.errorBanner}>{formError}</Text> : null}

        <Button title="Entrar" onPress={handleLogin} loading={loading} />

        <TouchableOpacity
          style={styles.linkWrapper}
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text style={styles.link}>Esqueci minha senha</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Ainda não tem conta?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.footerLink}> Cadastre-se</Text>
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
  linkWrapper: {
    marginTop: 16,
    alignItems: 'center',
  },
  link: {
    color: '#2b6cb0',
    fontSize: 14,
    fontWeight: '600',
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
