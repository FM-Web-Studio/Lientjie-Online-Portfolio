import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from './app'
import downscaleImage from '../utils/downscaleImage'

// Unique, collision-proof filename: <timestamp>_<random>_<sanitised original>.
// Fixes the old bug where same-named uploads overwrote each other.
function uniqueName(file) {
  const safe = (file.name || 'file').replace(/\s+/g, '_').replace(/[^\w.-]/g, '')
  return `${Date.now()}_${Math.round(Math.random() * 1e6)}_${safe}`
}

// Every upload path in the admin funnels through here, so this is the one
// place that has to cap image size. Oversized originals stall the visitor's
// main thread on decode; see utils/downscaleImage.
export async function uploadFile(file, path) {
  const upload = await downscaleImage(file)
  const storageRef = ref(storage, `${path}/${uniqueName(upload)}`)
  await uploadBytes(storageRef, upload)
  return getDownloadURL(storageRef)
}

export async function uploadMultiple(files, path) {
  return Promise.all(Array.from(files).map(f => uploadFile(f, path)))
}
