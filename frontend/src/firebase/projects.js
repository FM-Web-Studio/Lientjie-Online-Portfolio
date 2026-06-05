import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  query, orderBy, where, serverTimestamp,
} from 'firebase/firestore'
import { db } from './app'

export async function getProjects() {
  const q = query(collection(db, 'projects'), orderBy('order', 'asc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function getFeaturedProjects() {
  // Filter client-side to avoid composite index requirement
  const all = await getProjects()
  return all.filter(p => p.featured === true)
}

export async function getProject(id) {
  const snap = await getDoc(doc(db, 'projects', id))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export async function createProject(data) {
  return addDoc(collection(db, 'projects'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function updateProject(id, data) {
  return updateDoc(doc(db, 'projects', id), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteProject(id) {
  return deleteDoc(doc(db, 'projects', id))
}
