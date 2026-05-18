import { createFileRoute, Link } from '@tanstack/react-router'
import React from 'react'
import { Authorize } from '../iam/hooks'
import { useCurrentUser } from '../iam/auth-context'
import { engine } from '../iam/engine'
import { useCreatePost, useDeletePost, usePosts, useUpdatePost } from '../iam/queries'
import type { AppAction, Post } from '../iam/types'

export const Route = createFileRoute('/posts')({ component: PostsPage })

async function gateAction(
  subjectId: string,
  action: AppAction,
  resource: { type: 'post'; id: string; attributes: Record<string, unknown> },
  run: () => void,
) {
  const decision = await engine.can(subjectId, action, resource as never)
  const allowed = typeof decision === 'boolean' ? decision : Boolean((decision as { allowed?: boolean }).allowed)
  if (allowed) run()
  else console.warn('[gate] blocked', { subjectId, action, resource })
}

function PostsPage() {
  const me = useCurrentUser()
  const { data: posts = [], isLoading } = usePosts()
  const createPost = useCreatePost()
  const updatePost = useUpdatePost()
  const deletePost = useDeletePost()
  const [draftTitle, setDraftTitle] = React.useState('')

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Posts</h1>
          <p className="text-xs text-[var(--sea-ink-soft)]">
            Every button below is gated by <code>engine.can()</code>. Switch user in the bar above to see policies fire.
          </p>
        </div>
        {me && (
          <Authorize action="create" resource={{ type: 'post', attributes: { workspaceId: me.workspaceId } }}>
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                if (!draftTitle.trim() || !me) return
                createPost.mutate({
                  title: draftTitle,
                  body: '',
                  ownerId: me.id,
                  published: false,
                  workspaceId: me.workspaceId,
                  tags: [],
                })
                setDraftTitle('')
              }}
            >
              <input
                className="rounded border border-[var(--line)] bg-transparent px-2 py-1 text-xs"
                onChange={(e) => setDraftTitle(e.target.value)}
                placeholder="new post title"
                value={draftTitle}
              />
              <button className="rounded border border-[var(--line)] px-2 py-1 text-xs" type="submit">
                create
              </button>
            </form>
          </Authorize>
        )}
      </header>

      {isLoading && <p className="text-xs text-[var(--sea-ink-soft)]">loading…</p>}

      <ul className="flex flex-col gap-2">
        {posts.map((post) => (
          <PostRow key={post.id} onDelete={() => deletePost.mutate(post.id)} onPublish={() => updatePost.mutate({ id: post.id, patch: { published: !post.published } })} post={post} />
        ))}
      </ul>
    </main>
  )
}

function PostRow({ post, onDelete, onPublish }: { post: Post; onDelete: () => void; onPublish: () => void }) {
  const me = useCurrentUser()
  const resource = React.useMemo(
    () => ({
      type: 'post' as const,
      id: post.id,
      attributes: {
        ownerId: post.ownerId,
        published: post.published,
        workspaceId: post.workspaceId,
        tagCount: post.tags.length,
      },
    }),
    [post.id, post.ownerId, post.published, post.workspaceId, post.tags.length],
  )

  // All gating happens at click time via gateAction. No render-time `<Authorize>`
  // wrappers so the flow shows exactly the checks the user triggers — nothing
  // implicit on rerender.
  return (
    <li className="flex items-start justify-between gap-4 rounded-xl border border-[var(--line)] p-3">
      <div className="flex-1">
        <Link className="font-semibold hover:underline" params={{ postId: post.id }} to="/posts/$postId">
          {post.title}
        </Link>
        <p className="text-xs text-[var(--sea-ink-soft)]">
          {post.workspaceId} · {post.published ? 'published' : 'draft'} · {post.tags.join(', ') || 'untagged'}
        </p>
      </div>
      <div className="flex gap-2">
        <button
          className="rounded border border-emerald-700 px-2 py-1 text-xs text-emerald-500"
          onClick={() => me && gateAction(me.id, 'publish', resource, onPublish)}
          type="button">
          {post.published ? 'unpublish' : 'publish'}
        </button>
        <button
          className="rounded border border-rose-700 px-2 py-1 text-xs text-rose-500"
          onClick={() => me && gateAction(me.id, 'delete', resource, onDelete)}
          type="button">
          delete
        </button>
      </div>
    </li>
  )
}
