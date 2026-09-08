export function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(String(email).trim());
}

export function validateRegisterForm({ nome, email, senha, confirmarSenha }) {
  if (!nome || !nome.trim()) {
    return 'Informe seu nome.';
  }
  if (!email || !email.trim()) {
    return 'Informe seu e-mail.';
  }
  if (!isValidEmail(email)) {
    return 'Informe um e-mail em um formato válido.';
  }
  if (!senha) {
    return 'Informe uma senha.';
  }
  if (senha.length < 6) {
    return 'A senha deve ter pelo menos 6 caracteres.';
  }
  if (!confirmarSenha) {
    return 'Confirme sua senha.';
  }
  if (senha !== confirmarSenha) {
    return 'As senhas não coincidem.';
  }
  return null;
}

export function validateLoginForm({ email, senha }) {
  if (!email || !email.trim()) {
    return 'Informe seu e-mail.';
  }
  if (!isValidEmail(email)) {
    return 'Informe um e-mail em um formato válido.';
  }
  if (!senha) {
    return 'Informe sua senha.';
  }
  return null;
}

export function translateFirebaseError(error) {
  const code = error?.code || '';
  const map = {
    'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
    'auth/invalid-email': 'Formato de e-mail inválido.',
    'auth/weak-password': 'A senha é muito fraca. Use pelo menos 6 caracteres.',
    'auth/user-not-found': 'E-mail ou senha inválidos.',
    'auth/wrong-password': 'E-mail ou senha inválidos.',
    'auth/invalid-credential': 'E-mail ou senha inválidos.',
    'auth/too-many-requests': 'Muitas tentativas. Tente novamente em instantes.',
    'auth/requires-recent-login':
      'Por segurança, faça login novamente antes de excluir sua conta.',
    'auth/network-request-failed': 'Falha de conexão. Verifique sua internet.',
  };
  return map[code] || 'Ocorreu um erro. Tente novamente.';
}
