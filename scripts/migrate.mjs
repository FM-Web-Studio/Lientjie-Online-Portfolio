/**
 * One-time, NON-DESTRUCTIVE Firestore migration for the portfolio.
 *
 * Copies the old unprefixed collections to their new app-prefixed names so the
 * portfolio no longer collides (namespace-wise) with the petsitting app in the
 * shared `lientjie-project`. Originals are LEFT IN PLACE as a backup - delete
 * them yourself once you have verified the new site.
 *
 *   projects  -> portfolio_projects
 *   bio       -> portfolio_bio
 *   memories  -> portfolio_memories
 *   messages  -> portfolio_messages
 *
 * Document IDs are preserved, so re-running is idempotent (it overwrites the
 * copies with the originals again). Run this BEFORE deploying the new frontend.
 *
 * Usage:
 *   cd scripts
 *   npm install
 *   node migrate.mjs ./serviceAccountKey.json
 *   # or: GOOGLE_APPLICATION_CREDENTIALS=/path/key.json node migrate.mjs
 */
import { readFileSync } from 'node:fs'
import { initializeApp, cert, applicationDefault } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const keyPath = process.argv[2] || process.env.GOOGLE_APPLICATION_CREDENTIALS

initializeApp({
  credential: keyPath
    ? cert(JSON.parse(readFileSync(keyPath, 'utf8')))
    : applicationDefault(),
})

const db = getFirestore()

const MAP = {
  projects: 'portfolio_projects',
  bio:      'portfolio_bio',
  memories: 'portfolio_memories',
  messages: 'portfolio_messages',
}

async function copyCollection(from, to) {
  const snap = await db.collection(from).get()
  if (snap.empty) { console.log(`  (${from}: empty, nothing to copy)`); return 0 }
  let count = 0
  // Batch in chunks of 400 (Firestore limit is 500 writes/batch).
  const docs = snap.docs
  for (let i = 0; i < docs.length; i += 400) {
    const batch = db.batch()
    for (const d of docs.slice(i, i + 400)) {
      batch.set(db.collection(to).doc(d.id), d.data())
      count++
    }
    await batch.commit()
  }
  return count
}

async function main() {
  console.log('Migrating portfolio collections (non-destructive)…\n')
  for (const [from, to] of Object.entries(MAP)) {
    const n = await copyCollection(from, to)
    console.log(`✓ ${from} -> ${to}: ${n} doc(s) copied`)
  }
  console.log('\nDone. Originals left in place as backup. Deploy the new frontend, verify, then delete the old collections when ready.')
  process.exit(0)
}

main().catch(err => { console.error('Migration failed:', err); process.exit(1) })
