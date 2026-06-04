import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from './firebase'

export async function uploadImage(file, folder) {
  const path = `images/${folder}/${Date.now()}-${file.name}`
  const storageRef = ref(storage, path)
  const snapshot = await uploadBytes(storageRef, file)
  return getDownloadURL(snapshot.ref)
}

export async function uploadMultiple(files, folder) {
  return Promise.all(Array.from(files).map(f => uploadImage(f, folder)))
}

export async function deleteImage(urlOrPath) {
  const imageRef = ref(storage, urlOrPath)
  return deleteObject(imageRef)
}
