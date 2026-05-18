'use client'

import { useState } from 'react'
import { Can, Cannot, useAccess } from '@/lib/access-client'
import { CLIENT_API_URL } from '@/lib/api'

interface Post {
  id: number
  title: string
  body: string
  authorId: string
}

export function PostList({ posts: initial, userId }: { posts: Post[]; userId: string }) {
  const { can } = useAccess()
  const [posts, setPosts] = useState(initial)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  async function createPost(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch(`${CLIENT_API_URL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
      body: JSON.stringify({ title, body }),
    })
    if (res.ok) {
      const post: Post = await res.json()
      setPosts([...posts, post])
      setTitle('')
      setBody('')
    }
  }

  async function deletePost(id: number) {
    const res = await fetch(`${CLIENT_API_URL}/posts/${id}`, {
      method: 'DELETE',
      headers: { 'x-user-id': userId },
    })
    if (res.ok) {
      setPosts(posts.filter((p) => p.id !== id))
    }
  }

  return (
    <div>
      <h2>Posts</h2>

      {posts.length === 0 && <p style={{ color: '#999' }}>No posts yet.</p>}

      {posts.map((post) => (
        <div key={post.id} style={{ border: '1px solid #eee', borderRadius: 8, padding: 16, marginBottom: 12 }}>
          <h3 style={{ margin: '0 0 4px' }}>{post.title}</h3>
          <p style={{ margin: '0 0 8px', color: '#666' }}>{post.body}</p>
          <small style={{ color: '#999' }}>by {post.authorId}</small>

          <Can action="delete" resource="post">
            <button
              type="button"
              onClick={() => deletePost(post.id)}
              style={{ marginLeft: 12, color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>
              Delete
            </button>
          </Can>
        </div>
      ))}

      <Can action="create" resource="post">
        <div style={{ marginTop: 24, padding: 16, border: '1px solid #eee', borderRadius: 8 }}>
          <h3 style={{ marginTop: 0 }}>New Post</h3>
          <form onSubmit={createPost}>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              required
              style={{
                display: 'block',
                width: '100%',
                padding: 8,
                marginBottom: 8,
                borderRadius: 4,
                border: '1px solid #ccc',
              }}
            />
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Body"
              required
              rows={3}
              style={{
                display: 'block',
                width: '100%',
                padding: 8,
                marginBottom: 8,
                borderRadius: 4,
                border: '1px solid #ccc',
              }}
            />
            <button
              type="submit"
              style={{
                padding: '8px 16px',
                background: '#0070f3',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
              }}>
              Create Post
            </button>
          </form>
        </div>
      </Can>

      <Cannot action="create" resource="post">
        <p style={{ marginTop: 24, padding: 16, background: '#f5f5f5', borderRadius: 8, color: '#999' }}>
          You don&apos;t have permission to create posts. (You&apos;re a viewer.)
        </p>
      </Cannot>

      <div style={{ marginTop: 24, padding: 16, background: '#f0f7ff', borderRadius: 8 }}>
        <h3 style={{ marginTop: 0 }}>Your permissions</h3>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>Create post: {can('create', 'post') ? '✅' : '❌'}</li>
          <li>Read post: {can('read', 'post') ? '✅' : '❌'}</li>
          <li>Update post: {can('update', 'post') ? '✅' : '❌'}</li>
          <li>Delete post: {can('delete', 'post') ? '✅' : '❌'}</li>
          <li>Read users: {can('read', 'user') ? '✅' : '❌'}</li>
          <li>Delete users: {can('delete', 'user') ? '✅' : '❌'}</li>
        </ul>
      </div>
    </div>
  )
}
