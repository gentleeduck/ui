import type { onAuthenticatePayload } from '@hocuspocus/server'
import { engine } from '../lib/access'

export async function onAuthenticate(data: onAuthenticatePayload) {
  const { token, documentName } = data

  if (!token) {
    throw new Error('No token provided')
  }

  let parsed: { userId: string; workspaceId: string }
  try {
    parsed = JSON.parse(token)
  } catch {
    throw new Error('Invalid token')
  }

  const { userId, workspaceId } = parsed
  if (!userId || !workspaceId) {
    throw new Error('Missing userId or workspaceId')
  }

  console.log(`[hocuspocus] Auth: user=${userId} doc=${documentName} workspace=${workspaceId}`)

  // Check if user can read this document (basic access)
  const canRead = await engine.can(
    userId,
    'read',
    { type: 'document', id: documentName, attributes: {} },
    undefined,
    workspaceId,
  )

  if (!canRead) {
    console.log(`[hocuspocus] Denied read for ${userId} on ${documentName}`)
    throw new Error('Forbidden: cannot read document')
  }

  // Check if user can update (determines edit mode)
  const canEdit = await engine.can(
    userId,
    'update',
    { type: 'document', id: documentName, attributes: {} },
    undefined,
    workspaceId,
  )

  console.log(`[hocuspocus] Authorized: user=${userId} canEdit=${canEdit}`)

  return {
    user: { userId, workspaceId, readOnly: !canEdit },
  }
}
