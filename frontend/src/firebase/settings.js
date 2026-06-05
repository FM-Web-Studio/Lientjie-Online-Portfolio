import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from './app'

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
