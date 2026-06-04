import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { auth } from './firebase'

const provider = new GoogleAuthProvider()

export async function signInWithGoogle() {
  return signInWithPopup(auth, provider)
}

export async function logOut() {
  return signOut(auth)
}
