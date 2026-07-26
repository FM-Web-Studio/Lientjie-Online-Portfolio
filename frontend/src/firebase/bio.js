import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from './app'

const COL = 'portfolio_bio'

export async function getBioProfile() {
  const snap = await getDoc(doc(db, COL, 'profile'))
  return snap.exists() ? snap.data() : null
}

export async function getBioSection(section) {
  const snap = await getDoc(doc(db, COL, section))
  return snap.exists() ? snap.data() : null
}

export async function updateBioSection(section, data) {
  return setDoc(doc(db, COL, section), data, { merge: true })
}
