import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from './app'

// Unique, collision-proof filename: <timestamp>_<random>_<sanitised original>.
// Fixes the old bug where same-named uploads overwrote each other.
function uniqueName(file) {
  const safe = (file.name || 'file').replace(/\s+/g, '_').replace(/[^\w.-]/g, '')
  return `${Date.now()}_${Math.round(Math.random() * 1e6)}_${safe}`
}

export async function uploadFile(file, path) {
  const storageRef = ref(storage, `${path}/${uniqueName(file)}`)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

export async function uploadMultiple(files, path) {
  return Promise.all(Array.from(files).map(f => uploadFile(f, path)))
}
