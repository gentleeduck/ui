import type { Comment, Post, User } from './types'

/**
 * In-memory mock backend. Mimics REST/RPC latency so TanStack Query
 * caching, loading states, and revalidation behave like a real service.
 *
 * No persistence. Reload of the tab resets all state.
 */
const DELAY_MS = 220

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), DELAY_MS))
}

function clone<T>(value: T): T {
  return structuredClone(value)
}

function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}

const seedUsers: User[] = [
  { id: 'u-alice', name: 'Alice', email: 'alice@acme.dev', tier: 'pro', workspaceId: 'workspace-alpha' },
  { id: 'u-bob', name: 'Bob', email: 'bob@acme.dev', tier: 'free', workspaceId: 'workspace-alpha' },
  { id: 'u-cara', name: 'Cara', email: 'cara@beta.dev', tier: 'pro', workspaceId: 'workspace-beta' },
  { id: 'u-dan', name: 'Dan', email: 'dan@acme.dev', tier: 'free', workspaceId: 'workspace-alpha' },
]

const seedPosts: Post[] = [
  {
    id: 'p-1',
    title: 'Welcome to duck-iam',
    body: 'A typed, framework-agnostic ABAC + RBAC engine.',
    ownerId: 'u-alice',
    published: true,
    workspaceId: 'workspace-alpha',
    tags: ['intro', 'duck'],
    createdAt: Date.now() - 4 * 86_400_000,
  },
  {
    id: 'p-2',
    title: 'Drafting the publish rule',
    body: 'Editors only publish in business hours.',
    ownerId: 'u-bob',
    published: false,
    workspaceId: 'workspace-alpha',
    tags: ['policies'],
    createdAt: Date.now() - 86_400_000,
  },
  {
    id: 'p-3',
    title: 'Beta workspace post',
    body: 'Cross-workspace gate keeps this hidden from alpha.',
    ownerId: 'u-cara',
    published: true,
    workspaceId: 'workspace-beta',
    tags: ['workspace'],
    createdAt: Date.now() - 2 * 86_400_000,
  },
]

const seedComments: Comment[] = [
  { id: 'c-1', postId: 'p-1', body: 'Nice intro!', ownerId: 'u-bob', createdAt: Date.now() - 86_400_000 },
  { id: 'c-2', postId: 'p-1', body: 'Looking forward to more.', ownerId: 'u-cara', createdAt: Date.now() - 43_200_000 },
  { id: 'c-3', postId: 'p-3', body: 'Beta gating works.', ownerId: 'u-cara', createdAt: Date.now() - 3_600_000 },
]

const store = {
  users: new Map<string, User>(seedUsers.map((u) => [u.id, u])),
  posts: new Map<string, Post>(seedPosts.map((p) => [p.id, p])),
  comments: new Map<string, Comment>(seedComments.map((c) => [c.id, c])),
}

export const mockBackend = {
  async listUsers(): Promise<User[]> {
    return delay(Array.from(store.users.values()).map(clone))
  },
  async getUser(id: string): Promise<User | null> {
    const u = store.users.get(id)
    return delay(u ? clone(u) : null)
  },
  async listPosts(): Promise<Post[]> {
    return delay(
      Array.from(store.posts.values())
        .sort((a, b) => b.createdAt - a.createdAt)
        .map(clone),
    )
  },
  async getPost(id: string): Promise<Post | null> {
    const p = store.posts.get(id)
    return delay(p ? clone(p) : null)
  },
  async createPost(input: Omit<Post, 'id' | 'createdAt'>): Promise<Post> {
    const post: Post = { ...input, id: uid('p'), createdAt: Date.now() }
    store.posts.set(post.id, post)
    return delay(clone(post))
  },
  async updatePost(id: string, patch: Partial<Omit<Post, 'id' | 'createdAt'>>): Promise<Post | null> {
    const current = store.posts.get(id)
    if (!current) return delay(null)
    const next: Post = { ...current, ...patch }
    store.posts.set(id, next)
    return delay(clone(next))
  },
  async deletePost(id: string): Promise<boolean> {
    const ok = store.posts.delete(id)
    return delay(ok)
  },
  async listComments(postId?: string): Promise<Comment[]> {
    const list = Array.from(store.comments.values()).filter((c) => (postId ? c.postId === postId : true))
    return delay(list.map(clone))
  },
  async createComment(input: Omit<Comment, 'id' | 'createdAt'>): Promise<Comment> {
    const comment: Comment = { ...input, id: uid('c'), createdAt: Date.now() }
    store.comments.set(comment.id, comment)
    return delay(clone(comment))
  },
  async deleteComment(id: string): Promise<boolean> {
    const ok = store.comments.delete(id)
    return delay(ok)
  },
}
