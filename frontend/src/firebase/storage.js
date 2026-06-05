import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from './app'

export async function uploadFile(file, path) {
  const storageRef = ref(storage, `${path}/${file.name}`)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

export async function uploadMultiple(files, path) {
  return Promise.all(Array.from(files).map(f => uploadFile(f, path)))
}
