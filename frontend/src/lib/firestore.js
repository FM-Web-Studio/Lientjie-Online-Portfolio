import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import { db } from './firebase'

// ── Projects ────────────────────────────────────────────────────────────────

export async function getProjects() {
  const q = query(collection(db, 'projects'), orderBy('order', 'asc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function getFeaturedProjects() {
  const q = query(
    collection(db, 'projects'),
    where('featured', '==', true),
    orderBy('order', 'asc')
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
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

// ── Bio ─────────────────────────────────────────────────────────────────────

export async function getBioProfile() {
  const snap = await getDoc(doc(db, 'bio', 'profile'))
  return snap.exists() ? snap.data() : null
}

export async function getBioSection(section) {
  const snap = await getDoc(doc(db, 'bio', section))
  return snap.exists() ? snap.data() : null
}

export async function updateBioSection(section, data) {
  return setDoc(doc(db, 'bio', section), data, { merge: true })
}

// ── Settings ────────────────────────────────────────────────────────────────

export async function getSettings(docId) {
  const snap = await getDoc(doc(db, 'settings', docId))
  return snap.exists() ? snap.data() : null
}

export async function updateSettings(docId, data) {
  return setDoc(doc(db, 'settings', docId), data, { merge: true })
}

export async function isAdminEmail(email) {
  try {
    const settings = await getSettings('admins')
    return Array.isArray(settings?.emails) && settings.emails.includes(email)
  } catch {
    return false
  }
}

// ── Messages (contact form) ──────────────────────────────────────────────────

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
