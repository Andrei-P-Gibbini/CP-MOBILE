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

function livrosRef(uid) {
  return collection(db, 'usuarios', uid, 'livros');
}

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
