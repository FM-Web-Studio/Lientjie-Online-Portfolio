import {
  collection, doc, getDocs, addDoc, updateDoc, deleteDoc,
  query, orderBy, where, serverTimestamp,
} from 'firebase/firestore'
import { db } from './app'

export async function getMemories() {
  const q = query(collection(db, 'memories'), orderBy('order', 'asc'))
  const snap = await getDocs(q)
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter(m => m.active !== false)
}

export async function getAllMemories() {
  const q = query(collection(db, 'memories'), orderBy('order', 'asc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function createMemory(data) {
  return addDoc(collection(db, 'memories'), {
    ...data,
    active: true,
    createdAt: serverTimestamp(),
  })
}

export async function updateMemory(id, data) {
  return updateDoc(doc(db, 'memories', id), data)
}

export async function deleteMemory(id) {
  return deleteDoc(doc(db, 'memories', id))
}
