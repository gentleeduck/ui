import type { onLoadDocumentPayload, onStoreDocumentPayload } from '@hocuspocus/server'
import { eq } from 'drizzle-orm'
import * as Y from 'yjs'
import { db } from '../lib/db'
import { documents } from '../lib/db/schema'

export async function onLoadDocument(data: onLoadDocumentPayload) {
  const { documentName, document } = data

  console.log(`[hocuspocus] Loading document: ${documentName}`)

  const [doc] = await db
    .select({ content: documents.content })
    .from(documents)
    .where(eq(documents.id, documentName))
    .limit(1)

  if (doc?.content) {
    const update = new Uint8Array(doc.content)
    Y.applyUpdate(document, update)
    console.log(`[hocuspocus] Loaded ${update.byteLength} bytes for ${documentName}`)
  } else {
    console.log(`[hocuspocus] No stored content for ${documentName}`)
  }

  return document
}

export async function onStoreDocument(data: onStoreDocumentPayload) {
  const { documentName, document } = data
  const state = Y.encodeStateAsUpdate(document)
  const buffer = Buffer.from(state)

  console.log(`[hocuspocus] Storing ${buffer.byteLength} bytes for ${documentName}`)

  await db.update(documents).set({ content: buffer, updatedAt: new Date() }).where(eq(documents.id, documentName))
}
