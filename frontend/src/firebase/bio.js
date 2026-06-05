import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from './app'

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
