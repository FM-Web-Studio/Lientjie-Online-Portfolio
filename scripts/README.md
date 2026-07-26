# Portfolio data migration

The portfolio's Firestore collections were renamed to app-prefixed names so they
no longer collide with the petsitting app in the shared `lientjie-project`:

| Old        | New                  |
|------------|----------------------|
| `projects` | `portfolio_projects` |
| `bio`      | `portfolio_bio`      |
| `memories` | `portfolio_memories` |
| `messages` | `portfolio_messages` |

Contact details moved from `settings/contact` into `settings/portfolio_content`
(the `contact` group) - just re-enter them once in the admin under **Contact Info**;
no script needed for that.

## Run the migration BEFORE deploying the new frontend

The new frontend reads the new collection names, so copy the data first (this is
non-destructive - originals stay as a backup):

```bash
cd scripts
npm install
node migrate.mjs ./serviceAccountKey.json
```

`serviceAccountKey.json` is a Firebase Admin service-account key for
`lientjie-project` (Firebase console -> Project settings -> Service accounts ->
Generate new private key). Alternatively set `GOOGLE_APPLICATION_CREDENTIALS` to
its path and omit the argument.

It is idempotent - safe to run more than once. After you deploy the new site and
confirm everything shows correctly, you can delete the old `projects` / `bio` /
`memories` / `messages` collections from the Firebase console.
