# CP4 – Mobile Auth (React Native + Firebase Authentication)

## Integrantes
- Andrei de Paiva Gibbini - RM 563061

## Descrição do projeto
Aplicativo mobile desenvolvido em **React Native** (Expo) com **Firebase Authentication**, implementando um fluxo completo de autenticação:

- Cadastro de usuário (nome, e-mail, senha e confirmação de senha)
- Login com e-mail e senha
- Persistência da sessão utilizando **AsyncStorage** (o usuário continua logado mesmo após fechar e reabrir o app)
- Logout, com remoção dos dados de sessão do AsyncStorage
- Recuperação de senha ("Esqueci minha senha") via Firebase Authentication
- Exclusão de conta, com confirmação e remoção da sessão local

Não é utilizado Firestore neste projeto — apenas Firebase Authentication.

## Tecnologias utilizadas
- [React Native](https://reactnative.dev/) com [Expo](https://expo.dev/)
- [Firebase Authentication](https://firebase.google.com/docs/auth) (SDK JS modular v10)
- [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/)
  — usado tanto pela persistência interna do Firebase Auth quanto para guardar um registro local (não sensível) da sessão ativa
- [React Navigation](https://reactnavigation.org/) (native-stack)

## Estrutura do projeto
```
CP4-Mobile-Auth/
├── App.js                     # Componente raiz
├── firebaseConfig.js          # Configuração e inicialização do Firebase
├── src/
│   ├── context/
│   │   └── AuthContext.js     # Lógica de autenticação (cadastro, login, logout, etc.)
│   ├── navigation/
│   │   ├── AppNavigator.js    # Decide entre área autenticada e não autenticada
│   │   ├── AuthStack.js       # Rotas: Login, Cadastro, Esqueci a senha
│   │   └── AppStack.js        # Rotas: área autenticada (Minha conta)
│   ├── screens/
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   ├── ForgotPasswordScreen.js
│   │   └── HomeScreen.js      # Tela "Minha conta" (perfil, logout, excluir conta)
│   ├── components/
│   │   ├── Input.js
│   │   └── Button.js
│   └── utils/
│       └── validation.js      # Validações de formulário e tradução de erros do Firebase
```

## Configuração do Firebase (obrigatório antes de rodar)

1. Acesse o [Firebase Console](https://console.firebase.google.com/) e crie um novo projeto
   (ou use um projeto existente).
2. Em **Build > Authentication > Sign-in method**, habilite o provedor **E-mail/senha**.
3. Em **Configurações do projeto > Seus apps**, crie um app do tipo **Web** (ícone `</>`)
   e copie as credenciais geradas (`apiKey`, `authDomain`, `projectId`, etc.).
4. Abra o arquivo `firebaseConfig.js` na raiz do projeto e substitua os valores de exemplo
   pelas credenciais do seu projeto:

```js
const firebaseConfig = {
  apiKey: 'SUA_API_KEY',
  authDomain: 'SEU_PROJETO.firebaseapp.com',
  projectId: 'SEU_PROJETO',
  storageBucket: 'SEU_PROJETO.appspot.com',
  messagingSenderId: 'SEU_SENDER_ID',
  appId: 'SEU_APP_ID',
};
```

## Instalação e execução

Pré-requisitos: [Node.js](https://nodejs.org/) instalado e o app **Expo Go**
instalado no celular (Android/iOS), ou um emulador configurado.

```bash
# 1. Instalar as dependências
npm install

# 2. Rodar o projeto
npx expo start
```

Após rodar `npx expo start`, escaneie o QR Code exibido no terminal com o app
**Expo Go** (Android) ou pela câmera (iOS), ou pressione `a` / `i` no terminal
para abrir em um emulador Android/iOS.

## Fluxos implementados (conforme roteiro de apresentação)
1. Criar uma conta (tela de Cadastro)
2. Realizar login (tela de Login)
3. Fechar e reabrir o app, demonstrando a persistência da sessão via AsyncStorage
4. Realizar logout (tela Minha conta)
5. Solicitar recuperação de senha (tela "Esqueci minha senha")
6. Excluir a conta, com tela de confirmação (tela Minha conta)

## Observações técnicas
- A senha do usuário **nunca** é armazenada no AsyncStorage — apenas dados não
  sensíveis (uid, e-mail e nome) usados para identificar rapidamente que existe
  uma sessão ativa.
- Usuários não autenticados não conseguem acessar as telas da área autenticada:
  a navegação (`AppNavigator.js`) é decidida em tempo real com base no estado de
  autenticação do Firebase.
- Erros do Firebase (e-mail já cadastrado, credenciais inválidas, senha fraca, etc.)
  são traduzidos para mensagens amigáveis em português (`src/utils/validation.js`).
