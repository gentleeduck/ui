import type { PermissionMap } from '@gentleduck/iam'
import { cookies } from 'next/headers'
import { PostList } from '@/components/post-list'
import { UserSwitcher } from '@/components/user-switcher'
import { AccessProvider } from '@/lib/access-client'
import { apiFetch } from '@/lib/api'

interface Post {
  id: number
  title: string
  body: string
  authorId: string
}

export default async function Home() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('user-id')?.value ?? 'alice'

  let posts: Post[] = []
  let permissions: PermissionMap = {}

  try {
    posts = await apiFetch('/posts', userId)
    permissions = await apiFetch('/permissions', userId)
  } catch {
    // API not running
  }

  return (
    <AccessProvider permissions={permissions}>
      <h1 style={{ marginBottom: 4 }}>BlogDuck</h1>
      <p style={{ color: '#666', marginTop: 0 }}>
        Role-based access control powered by <code>@gentleduck/iam</code>
      </p>

      <UserSwitcher currentUser={userId} />

      <hr style={{ margin: '20px 0' }} />

      <PostList posts={posts} userId={userId} />
    </AccessProvider>
  )
}
