import {
  collection, doc, getDocs, addDoc, updateDoc, deleteDoc,
  query, orderBy, serverTimestamp,
} from 'firebase/firestore'
import { db } from './app'

const COL = 'portfolio_memories'

export async function getMemories() {
  const q = query(collection(db, COL), orderBy('order', 'asc'))
  const snap = await getDocs(q)
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter(m => m.active !== false)
}

export async function getAllMemories() {
  const q = query(collection(db, COL), orderBy('order', 'asc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function createMemory(data) {
  return addDoc(collection(db, COL), {
    ...data,
    active: true,
    createdAt: serverTimestamp(),
  })
}

export async function updateMemory(id, data) {
  return updateDoc(doc(db, COL, id), data)
}

export async function deleteMemory(id) {
  return deleteDoc(doc(db, COL, id))
}
