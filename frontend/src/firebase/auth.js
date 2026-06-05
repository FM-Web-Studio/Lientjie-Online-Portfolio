import { GoogleAuthProvider, signInWithPopup, signOut as _signOut } from 'firebase/auth'
import { auth } from './app'

const provider = new GoogleAuthProvider()

export function signInWithGoogle() {
  return signInWithPopup(auth, provider)
}

export function signOut() {
  return _signOut(auth)
}
