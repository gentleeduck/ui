'use server'

import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { engine } from '@/lib/access'
import { db } from '@/lib/db'
import { accessAssignments, workspaceMembers, workspaces } from '@/lib/db/schema'
import { createWorkspaceSchema, inviteMemberSchema } from '@/lib/validations'
import { requireSession } from './auth'

export async function getWorkspaces() {
  const session = await requireSession()
  const memberships = await db
    .select({
      workspace: workspaces,
      role: workspaceMembers.role,
    })
    .from(workspaceMembers)
    .innerJoin(workspaces, eq(workspaces.id, workspaceMembers.workspaceId))
    .where(eq(workspaceMembers.userId, session.user.id))

  return memberships
}

export async function getWorkspaceBySlug(slug: string) {
  const [workspace] = await db.select().from(workspaces).where(eq(workspaces.slug, slug)).limit(1)
  return workspace ?? null
}

export async function getWorkspaceMembership(workspaceId: string, userId: string) {
  const [member] = await db
    .select()
    .from(workspaceMembers)
    .where(and(eq(workspaceMembers.workspaceId, workspaceId), eq(workspaceMembers.userId, userId)))
    .limit(1)
  return member ?? null
}

export async function getWorkspaceMembers(workspaceId: string) {
  const session = await requireSession()
  const allowed = await engine.can(session.user.id, 'read', { type: 'member', attributes: {} }, undefined, workspaceId)
  if (!allowed) throw new Error('Forbidden')

  const members = await db.query.workspaceMembers.findMany({
    where: eq(workspaceMembers.workspaceId, workspaceId),
  })

  // Get user details for each member
  const { users } = await import('@/lib/db/schema')
  const userRows = await db.select().from(users)
  const userMap = Object.fromEntries(userRows.map((u) => [u.id, u]))

  return members.map((m) => ({
    ...m,
    user: userMap[m.userId],
  }))
}

export async function createWorkspace(formData: FormData) {
  const session = await requireSession()
  const parsed = createWorkspaceSchema.safeParse({
    name: formData.get('name'),
    slug: formData.get('slug'),
  })
  if (!parsed.success) throw new Error(parsed.error.issues[0].message)

  const { name } = parsed.data
  const slug = parsed.data.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-')

  const id = `ws-${crypto.randomUUID().slice(0, 8)}`

  await db.insert(workspaces).values({
    id,
    name,
    slug,
    ownerId: session.user.id,
  })

  // Add creator as owner member
  await db.insert(workspaceMembers).values({
    id: `wm-${crypto.randomUUID().slice(0, 8)}`,
    workspaceId: id,
    userId: session.user.id,
    role: 'owner',
  })

  // Assign IAM owner role scoped to this workspace
  await engine.admin.assignRole(session.user.id, 'owner', id)

  redirect(`/workspaces/${slug}`)
}

export async function inviteMember(workspaceId: string, email: string, role: string) {
  const session = await requireSession()

  const parsed = inviteMemberSchema.safeParse({ email, role })
  if (!parsed.success) throw new Error(parsed.error.issues[0].message)

  const allowed = await engine.can(
    session.user.id,
    'manage',
    { type: 'member', attributes: {} },
    undefined,
    workspaceId,
  )
  if (!allowed) throw new Error('Forbidden')

  // Find user by email
  const { users } = await import('@/lib/db/schema')
  const [user] = await db.select().from(users).where(eq(users.email, parsed.data.email)).limit(1)
  if (!user) throw new Error('User not found')

  // Check if already a member
  const existing = await getWorkspaceMembership(workspaceId, user.id)
  if (existing) throw new Error('User is already a member')

  await db.insert(workspaceMembers).values({
    id: `wm-${crypto.randomUUID().slice(0, 8)}`,
    workspaceId,
    userId: user.id,
    role: parsed.data.role,
  })

  await engine.admin.assignRole(user.id, parsed.data.role, workspaceId)

  revalidatePath(`/workspaces`)
}

export async function updateMemberRole(workspaceId: string, memberId: string, newRole: string) {
  const session = await requireSession()

  const allowed = await engine.can(
    session.user.id,
    'manage',
    { type: 'member', attributes: {} },
    undefined,
    workspaceId,
  )
  if (!allowed) throw new Error('Forbidden')

  const [member] = await db.select().from(workspaceMembers).where(eq(workspaceMembers.id, memberId)).limit(1)
  if (!member) throw new Error('Member not found')

  // Revoke old role, assign new one
  await engine.admin.revokeRole(member.userId, member.role, workspaceId)
  await engine.admin.assignRole(member.userId, newRole, workspaceId)

  await db.update(workspaceMembers).set({ role: newRole }).where(eq(workspaceMembers.id, memberId))

  revalidatePath(`/workspaces`)
}

export async function removeMember(workspaceId: string, memberId: string) {
  const session = await requireSession()

  const allowed = await engine.can(
    session.user.id,
    'manage',
    { type: 'member', attributes: {} },
    undefined,
    workspaceId,
  )
  if (!allowed) throw new Error('Forbidden')

  const [member] = await db.select().from(workspaceMembers).where(eq(workspaceMembers.id, memberId)).limit(1)
  if (!member) throw new Error('Member not found')

  await engine.admin.revokeRole(member.userId, member.role, workspaceId)
  await db.delete(workspaceMembers).where(eq(workspaceMembers.id, memberId))

  revalidatePath(`/workspaces`)
}

export async function deleteWorkspace(workspaceId: string) {
  const session = await requireSession()

  const allowed = await engine.can(
    session.user.id,
    'delete',
    { type: 'workspace', id: workspaceId, attributes: {} },
    undefined,
    workspaceId,
  )
  if (!allowed) throw new Error('Forbidden')

  // Clean up IAM assignments for all members
  await db.delete(accessAssignments).where(eq(accessAssignments.scope, workspaceId))
  await db.delete(workspaces).where(eq(workspaces.id, workspaceId))

  redirect('/workspaces')
}
