import {
  collection, doc, getDocs, addDoc, updateDoc,
  query, orderBy, serverTimestamp,
} from 'firebase/firestore'
import { db } from './app'

export async function createMessage(data) {
  return addDoc(collection(db, 'messages'), {
    ...data,
    createdAt: serverTimestamp(),
    read: false,
  })
}

export async function getMessages() {
  const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function markMessageRead(id) {
  return updateDoc(doc(db, 'messages', id), { read: true })
}
