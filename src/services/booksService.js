import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../../firebaseConfig';

// Estrutura utilizada no Firestore (conforme pedido no enunciado do CP5):
//
// usuarios (collection)
//   └── {uid} (documento implícito - identificado apenas pelo caminho)
//         └── livros (subcollection)
//               ├── {livroId}
//               ├── {livroId}
//               └── {livroId}
//
// Cada registro de livro só existe dentro do caminho "usuarios/{uid}/livros",
// então um usuário nunca consegue ler ou escrever nos livros de outro usuário
// (ver regras de segurança em firestore.rules).

function livrosRef(uid) {
  return collection(db, 'usuarios', uid, 'livros');
}

/**
 * Escuta em tempo real a lista de livros do usuário autenticado.
 * Retorna a função de "unsubscribe" (chame no cleanup do useEffect).
 */
export function subscribeToBooks(uid, onChange, onError) {
  const q = query(livrosRef(uid), orderBy('criadoEm', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const livros = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      onChange(livros);
    },
    (error) => {
      if (onError) onError(error);
    }
  );
}

export async function createBook(uid, data) {
  const now = Date.now();
  await addDoc(livrosRef(uid), {
    ...data,
    criadoEm: now,
    atualizadoEm: now,
  });
}

export async function updateBook(uid, bookId, data) {
  const bookDoc = doc(db, 'usuarios', uid, 'livros', bookId);
  await updateDoc(bookDoc, {
    ...data,
    atualizadoEm: Date.now(),
  });
}

export async function deleteBook(uid, bookId) {
  const bookDoc = doc(db, 'usuarios', uid, 'livros', bookId);
  await deleteDoc(bookDoc);
}
