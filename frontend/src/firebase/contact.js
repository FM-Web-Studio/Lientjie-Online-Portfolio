import {
  collection, doc, getDocs, addDoc, updateDoc, deleteDoc,
  query, orderBy, serverTimestamp,
} from 'firebase/firestore'
import { db } from './app'

const COL = 'portfolio_messages'

export async function createMessage(data) {
  return addDoc(collection(db, COL), {
    ...data,
    createdAt: serverTimestamp(),
    read: false,
  })
}

export async function getMessages() {
  const q = query(collection(db, COL), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function markMessageRead(id, read = true) {
  return updateDoc(doc(db, COL, id), { read })
}

export async function deleteMessage(id) {
  return deleteDoc(doc(db, COL, id))
}
