/**
 * Seed memories: upload images from frontend/temp/ to Firebase Storage
 * and create Firestore documents in the 'memories' collection.
 *
 * Usage:  node scripts/seedMemories.js
 */

const admin  = require('firebase-admin')
const path   = require('path')
const fs     = require('fs')

// ── Load service account from .env ────────────────────────────
const envPath = path.join(__dirname, '..', 'frontend', '.env')
const envRaw  = fs.readFileSync(envPath, 'utf-8')

function parseEnv(raw) {
  const map = {}
  // Handle multi-line values like FIREBASE_SERVICE_ACCOUNT={...}
  const re = /^([A-Z_]+)=(.+)$/gm
  let m
  while ((m = re.exec(raw)) !== null) {
    map[m[1]] = m[2].replace(/^"|"$/g, '')
  }
  return map
}

const env     = parseEnv(envRaw)
const saMatch = envRaw.match(/FIREBASE_SERVICE_ACCOUNT=(\{[\s\S]*?\n\})/)
if (!saMatch) {
  console.error('Could not parse FIREBASE_SERVICE_ACCOUNT from .env')
  process.exit(1)
}

const serviceAccount = JSON.parse(saMatch[1])
const storageBucket  = env.VITE_FIREBASE_STORAGE_BUCKET

// ── Init ──────────────────────────────────────────────────────
admin.initializeApp({
  credential:    admin.credential.cert(serviceAccount),
  storageBucket: storageBucket,
})

const db      = admin.firestore()
const bucket  = admin.storage().bucket()

// ── Image metadata ────────────────────────────────────────────
const IMAGES = [
  { file: 'Family.jpg',           caption: 'Family', order: 1 },
  { file: 'In My Element.JPG',    caption: 'In My Element', order: 2 },
  { file: 'Matric Farewell.JPG',  caption: 'Matric Farewell', order: 3 },
  { file: 'Show With Brother.jpg', caption: 'Show With Brother', order: 4 },
]

const tempDir = path.join(__dirname, '..', 'frontend', 'temp')

async function uploadImage(filename) {
  const localPath    = path.join(tempDir, filename)
  const storagePath  = `memories/${filename}`
  const ext          = path.extname(filename).toLowerCase()
  const contentType  = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png'

  await bucket.upload(localPath, {
    destination: storagePath,
    metadata: { contentType },
  })

  const file = bucket.file(storagePath)
  await file.makePublic()
  const url = `https://storage.googleapis.com/${storageBucket}/${storagePath}`
  console.log(`  ✓ uploaded: ${filename}`)
  return url
}

async function run() {
  console.log('\n🌿 Seeding memories...\n')

  for (const img of IMAGES) {
    const url = await uploadImage(img.file)

    // Check if already exists
    const existing = await db.collection('memories')
      .where('filename', '==', img.file)
      .limit(1)
      .get()

    if (!existing.empty) {
      await existing.docs[0].ref.update({ url, caption: img.caption, order: img.order, active: true })
      console.log(`  ↻ updated Firestore doc for: ${img.file}`)
    } else {
      await db.collection('memories').add({
        filename:  img.file,
        caption:   img.caption,
        url,
        order:     img.order,
        active:    true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      })
      console.log(`  ✓ created Firestore doc for: ${img.file}`)
    }
  }

  console.log('\n✅ Done! Memories seeded successfully.\n')
  process.exit(0)
}

run().catch(err => {
  console.error('\n❌ Error:', err.message)
  process.exit(1)
})
