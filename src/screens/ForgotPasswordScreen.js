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
import { isValidEmail, translateFirebaseError } from '../utils/validation';

export default function ForgotPasswordScreen({ navigation }) {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  async function handleResetPassword() {
    setFormError(null);
    setSuccessMessage(null);

    if (!email || !email.trim()) {
      setFormError('Informe seu e-mail.');
      return;
    }
    if (!isValidEmail(email)) {
      setFormError('Informe um e-mail em um formato válido.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email.trim());
      
      setSuccessMessage(
        'Se o e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha.'
      );
    } catch (error) {
      
      if (error?.code === 'auth/user-not-found') {
        setSuccessMessage(
          'Se o e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha.'
        );
      } else {
        setFormError(translateFirebaseError(error));
      }
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
        <Text style={styles.title}>Esqueci minha senha</Text>
        <Text style={styles.subtitle}>
          Informe o e-mail cadastrado para receber as instruções de redefinição de senha.
        </Text>

        <Input
          label="E-mail"
          placeholder="seuemail@exemplo.com"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        {formError ? <Text style={styles.errorBanner}>{formError}</Text> : null}
        {successMessage ? <Text style={styles.successBanner}>{successMessage}</Text> : null}

        <Button title="Enviar instruções" onPress={handleResetPassword} loading={loading} />

        <TouchableOpacity style={styles.linkWrapper} onPress={() => navigation.goBack()}>
          <Text style={styles.link}>Voltar para o login</Text>
        </TouchableOpacity>
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
  errorBanner: {
    color: '#e5484d',
    backgroundColor: '#fdecea',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 13,
  },
  successBanner: {
    color: '#276749',
    backgroundColor: '#e6f4ea',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 13,
  },
  linkWrapper: {
    marginTop: 20,
    alignItems: 'center',
  },
  link: {
    color: '#2b6cb0',
    fontSize: 14,
    fontWeight: '600',
  },
});
