# CP5 – Cadastro de Livros (React Native + Firebase Auth + Firestore)

## Integrantes
- Andrei de Paiva Gibbini - RM 563061

## Tema do aplicativo
**Cadastro de livros** — um app para registrar os livros que o usuário leu e
o que achou de cada um deles.

## Descrição do projeto
Este projeto é a evolução do **CP4** (que implementava apenas o fluxo de
autenticação com Firebase Authentication). No CP5, o app passa a usar também
o **Cloud Firestore** para que cada usuário autenticado cadastre, consulte,
edite e exclua seus próprios registros de livros.

Continuam funcionando, herdados do CP4:
- Cadastro de usuário (nome, e-mail, senha e confirmação)
- Login com e-mail e senha
- Persistência da sessão via AsyncStorage
- Logout
- Recuperação de senha ("Esqueci minha senha")
- Exclusão da conta

Novidades do CP5 (Cloud Firestore):
- Cadastro de livros (nome, autor, editora, ano de publicação, gênero e opinião)
- Listagem dos livros cadastrados pelo usuário, carregada em tempo real do Firestore
- Edição de um livro existente
- Exclusão de um livro, com confirmação
- Cada usuário só vê e só altera os próprios registros

## Campos do formulário de livro
| Campo               | Tipo                              |
|----------------------|------------------------------------|
| Nome do livro         | texto (obrigatório)                |
| Autor                | texto (obrigatório)                |
| Editora              | texto (obrigatório)                |
| Ano de publicação    | numérico, 4 dígitos (obrigatório)  |
| Gênero               | seleção entre opções pré-definidas (obrigatório) |
| Opinião              | texto livre / multilinha (obrigatório) |

## Tecnologias utilizadas
- [React Native](https://reactnative.dev/) 0.86 com [Expo](https://expo.dev/) SDK 57
- [Firebase Authentication](https://firebase.google.com/docs/auth) (SDK JS modular v12)
- [Cloud Firestore](https://firebase.google.com/docs/firestore) (SDK JS modular v12)
- [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/) 2.x
  — persistência da sessão do Firebase Auth
- [React Navigation](https://reactnavigation.org/) (native-stack)

## Estrutura de dados no Firestore
```
usuarios (collection)
 └── {uid}                     ← identificado pelo caminho (uid do Firebase Auth)
      └── livros (subcollection)
           ├── {livroId}
           │     titulo: string
           │     autor: string
           │     editora: string
           │     anoPublicacao: number
           │     genero: string
           │     opiniao: string
           │     criadoEm: number (timestamp)
           │     atualizadoEm: number (timestamp)
           ├── {livroId}
           └── {livroId}
```
Cada livro fica dentro da subcoleção `livros` do próprio usuário
(`usuarios/{uid}/livros`), o que naturalmente relaciona cada registro ao seu
dono e evita que um usuário acesse os livros de outro.

## Estrutura do projeto
```
CP5-Mobile/
├── App.js
├── firebaseConfig.js          # Inicialização do Firebase (Auth + Firestore)
├── firestore.rules            # Regras de segurança do Cloud Firestore
├── metro.config.js
├── src/
│   ├── context/
│   │   └── AuthContext.js     # Autenticação (herdado do CP4)
│   ├── services/
│   │   └── booksService.js    # CRUD de livros no Firestore (novo no CP5)
│   ├── navigation/
│   │   ├── AppNavigator.js    # Decide entre área autenticada e não autenticada
│   │   ├── AuthStack.js       # Login, Cadastro, Esqueci a senha
│   │   └── AppStack.js        # Home, Meus livros, Novo/Editar livro, Perfil
│   ├── screens/
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   ├── ForgotPasswordScreen.js
│   │   ├── HomeScreen.js       # Painel inicial com atalhos
│   │   ├── BooksListScreen.js  # Listagem dos livros (novo no CP5)
│   │   ├── BookFormScreen.js   # Cadastro/edição de livro (novo no CP5)
│   │   └── ProfileScreen.js    # Dados do usuário, logout, excluir conta
│   ├── components/
│   │   ├── Input.js
│   │   ├── Button.js
│   │   └── GenreSelect.js      # Seletor de gênero em chips (novo no CP5)
│   └── utils/
│       ├── validation.js       # Validações de login/cadastro e erros do Firebase
│       └── bookValidation.js   # Validação do formulário de livro (novo no CP5)
```

## Configuração do Firebase (obrigatório antes de rodar)

1. Acesse o [Firebase Console](https://console.firebase.google.com/) e use o
   mesmo projeto do CP4 (ou crie um novo).
2. Em **Build > Authentication > Sign-in method**, mantenha habilitado o
   provedor **E-mail/senha**.
3. Em **Build > Firestore Database**, clique em **Criar banco de dados** e
   inicie em modo de produção (as regras deste repositório cuidam da segurança).
4. Publique as regras do arquivo `firestore.rules` deste repositório:
   - pela aba **Regras** do Firestore no console (copie e cole o conteúdo), ou
   - via [Firebase CLI](https://firebase.google.com/docs/cli):
     ```bash
     firebase deploy --only firestore:rules
     ```
5. Confirme que `firebaseConfig.js` na raiz do projeto contém as credenciais
   do seu projeto Firebase (mesmas usadas no CP4):
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
npx expo start -c
```

Após rodar `npx expo start`, escaneie o QR Code exibido no terminal com o app
**Expo Go** (Android) ou pela câmera (iOS), ou pressione `a` / `i` no terminal
para abrir em um emulador Android/iOS.

### Observação sobre o `metro.config.js`
A partir do Expo SDK 53+, o Metro Bundler passou a seguir estritamente o
campo `"exports"` do `package.json` de cada pacote instalado. O arquivo
`metro.config.js` na raiz do projeto desativa esse comportamento
(`unstable_enablePackageExports = false`) para evitar conflitos de resolução
de módulos com dependências mais antigas.

### Observação sobre a versão do Firebase
O Expo (SDK usado neste projeto) só é compatível com `firebase@12.0.0` ou
superior — o mesmo pacote `firebase` já traz os módulos `firebase/auth` e
`firebase/firestore` usados neste projeto, sem dependências extras.

### Se o emulador Android não conectar ao Metro
Em algumas máquinas, o redirecionamento de porta entre o emulador e o Metro
Bundler (porta 8081) não é feito automaticamente. Se a tela do Expo Go ficar
travada carregando ou mostrar `Failed to connect to /127.0.0.1:8081`, rode
em outro terminal, com o emulador já ligado:
```bash
adb reverse tcp:8081 tcp:8081
```
e recarregue o app (tecla `r` no terminal do Expo, ou o botão de recarregar
na tela de erro do Expo Go). Esse comando precisa ser repetido sempre que o
emulador for reiniciado.

## Fluxos implementados (conforme roteiro de apresentação do CP5)
1. Cadastro de uma nova conta (Firebase Authentication)
2. Login com o usuário criado
3. Cadastro de pelo menos 2 livros no Firestore, com nome, autor, editora,
   ano de publicação, gênero e opinião
4. Consulta: os livros cadastrados são carregados em tempo real a partir do
   Firestore, na tela "Meus livros"
5. Atualização: seleção de um livro e alteração de suas informações
6. Exclusão: remoção de um livro com confirmação, e atualização imediata da lista
7. Isolamento dos dados: os registros de um usuário não aparecem para outro
   usuário (garantido pela estrutura `usuarios/{uid}/livros` e pelas regras
   do Firestore)
8. Logout, com retorno para a área de autenticação
9. Persistência da sessão ao fechar e reabrir o app

## Observações técnicas
- A senha do usuário **nunca** é armazenada no Firestore nem no AsyncStorage.
- Usuários não autenticados não conseguem acessar a área autenticada nem os
  dados do Firestore — a navegação é decidida pelo estado de autenticação do
  Firebase, e as regras do Firestore (`firestore.rules`) bloqueiam qualquer
  leitura/escrita fora do caminho `usuarios/{uid próprio}/livros`.
- A listagem usa `onSnapshot` do Firestore, então a interface é atualizada
  automaticamente após qualquer cadastro, edição ou exclusão, sem precisar de
  um botão de "atualizar" manual.
- Erros são tratados e exibidos como mensagens amigáveis em português.

## Link do vídeo demonstrativo
https://youtu.be/JyID5_IaLQ0
