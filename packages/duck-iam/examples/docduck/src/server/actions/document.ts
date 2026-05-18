'use server'

import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { engine } from '@/lib/access'
import { db } from '@/lib/db'
import { documents } from '@/lib/db/schema'
import { createDocumentSchema, updateDocumentTitleSchema } from '@/lib/validations'
import { requireSession } from './auth'

export async function getDocuments(workspaceId: string) {
  const session = await requireSession()

  const allowed = await engine.can(
    session.user.id,
    'read',
    { type: 'document', attributes: {} },
    undefined,
    workspaceId,
  )
  if (!allowed) throw new Error('Forbidden')

  return db
    .select({
      id: documents.id,
      title: documents.title,
      workspaceId: documents.workspaceId,
      ownerId: documents.ownerId,
      isPublic: documents.isPublic,
      createdAt: documents.createdAt,
      updatedAt: documents.updatedAt,
    })
    .from(documents)
    .where(eq(documents.workspaceId, workspaceId))
}

export async function getDocument(docId: string) {
  const [doc] = await db.select().from(documents).where(eq(documents.id, docId)).limit(1)
  return doc ?? null
}

export async function createDocument(workspaceId: string, title: string) {
  const session = await requireSession()

  const parsed = createDocumentSchema.safeParse({ title })
  if (!parsed.success) throw new Error(parsed.error.issues[0].message)

  const allowed = await engine.can(
    session.user.id,
    'create',
    { type: 'document', attributes: {} },
    undefined,
    workspaceId,
  )
  if (!allowed) throw new Error('Forbidden')

  const id = `doc-${crypto.randomUUID().slice(0, 8)}`

  await db.insert(documents).values({
    id,
    title: parsed.data.title,
    workspaceId,
    ownerId: session.user.id,
  })

  revalidatePath(`/workspaces`)
  return { id }
}

export async function updateDocumentTitle(docId: string, title: string) {
  const session = await requireSession()

  const parsed = updateDocumentTitleSchema.safeParse({ title })
  if (!parsed.success) throw new Error(parsed.error.issues[0].message)

  const doc = await getDocument(docId)
  if (!doc) throw new Error('Document not found')

  const allowed = await engine.can(
    session.user.id,
    'update',
    { type: 'document', id: docId, attributes: { ownerId: doc.ownerId, isPublic: doc.isPublic } },
    undefined,
    doc.workspaceId,
  )
  if (!allowed) throw new Error('Forbidden')

  await db.update(documents).set({ title: parsed.data.title, updatedAt: new Date() }).where(eq(documents.id, docId))

  revalidatePath(`/workspaces`)
}

export async function deleteDocument(docId: string) {
  const session = await requireSession()
  const doc = await getDocument(docId)
  if (!doc) throw new Error('Document not found')

  const allowed = await engine.can(
    session.user.id,
    'delete',
    { type: 'document', id: docId, attributes: { ownerId: doc.ownerId, isPublic: doc.isPublic } },
    undefined,
    doc.workspaceId,
  )
  if (!allowed) throw new Error('Forbidden')

  await db.delete(documents).where(eq(documents.id, docId))

  revalidatePath(`/workspaces`)
}

export async function toggleDocumentPublic(docId: string) {
  const session = await requireSession()
  const doc = await getDocument(docId)
  if (!doc) throw new Error('Document not found')

  const allowed = await engine.can(
    session.user.id,
    'share',
    { type: 'document', id: docId, attributes: { ownerId: doc.ownerId, isPublic: doc.isPublic } },
    undefined,
    doc.workspaceId,
  )
  if (!allowed) throw new Error('Forbidden')

  await db.update(documents).set({ isPublic: !doc.isPublic, updatedAt: new Date() }).where(eq(documents.id, docId))

  revalidatePath(`/workspaces`)
}
