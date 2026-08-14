import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  query, orderBy, onSnapshot, serverTimestamp,
} from 'firebase/firestore'
import { db } from './app'

const COL = 'portfolio_projects'

const mapDoc = d => ({ id: d.id, ...d.data() })

export async function getProjects() {
  const q = query(collection(db, COL), orderBy('order', 'asc'))
  const snap = await getDocs(q)
  return snap.docs.map(mapDoc)
}

export async function getFeaturedProjects() {
  // Filter client-side to avoid composite index requirement
  const all = await getProjects()
  return all.filter(p => p.featured === true)
}

/**
 * Live project list, ordered by `order`.
 *
 * Public pages subscribe rather than fetch once so an edit in the admin panel
 * appears on the site immediately instead of on the visitor's next reload.
 * Returns the Firestore unsubscribe function - callers MUST return it from
 * their effect cleanup, or the listener outlives the component and keeps an
 * open channel for the rest of the session.
 */
export function subscribeProjects(onData, onError) {
  return onSnapshot(
    query(collection(db, COL), orderBy('order', 'asc')),
    snap => onData(snap.docs.map(mapDoc)),
    onError,
  )
}

/**
 * Live featured projects, falling back to the first `fallbackCount` of the
 * full list when nothing is flagged featured.
 *
 * `featured` is filtered in memory off the same ordered query rather than
 * added as a `where` clause: combining it with orderBy('order') would need a
 * composite index, and the collection is a handful of documents.
 */
export function subscribeFeaturedProjects(onData, onError, fallbackCount = 6) {
  return subscribeProjects(
    all => {
      const featured = all.filter(p => p.featured === true)
      onData(featured.length > 0 ? featured : all.slice(0, fallbackCount))
    },
    onError,
  )
}

export async function getProject(id) {
  const snap = await getDoc(doc(db, COL, id))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export async function createProject(data) {
  return addDoc(collection(db, COL), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function updateProject(id, data) {
  return updateDoc(doc(db, COL, id), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteProject(id) {
  return deleteDoc(doc(db, COL, id))
}
