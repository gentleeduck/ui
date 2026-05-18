import { createFileRoute, Link } from '@tanstack/react-router'
import React from 'react'
import { Authorize, useExplain } from '../iam/hooks'
import { useCurrentUser } from '../iam/auth-context'
import { useComments, useCreateComment, useDeleteComment, usePost } from '../iam/queries'

export const Route = createFileRoute('/posts/$postId')({ component: PostDetailPage })

function PostDetailPage() {
  const { postId } = Route.useParams()
  const { data: post, isLoading } = usePost(postId)
  const { data: comments = [] } = useComments(postId)
  const me = useCurrentUser()
  const createComment = useCreateComment()
  const deleteComment = useDeleteComment()
  const [draftComment, setDraftComment] = React.useState('')

  const explain = useExplain(
    post && me
      ? {
          action: 'publish',
          resource: {
            type: 'post',
            id: post.id,
            attributes: { ownerId: post.ownerId, published: post.published, workspaceId: post.workspaceId, tagCount: post.tags.length },
          },
          scope: me.workspaceId,
        }
      : null,
  )

  if (isLoading) return <main className="page-wrap px-4 pt-14 text-xs">loading…</main>
  if (!post) return <main className="page-wrap px-4 pt-14 text-xs">not found</main>

  const resource = {
    type: 'post' as const,
    id: post.id,
    attributes: { ownerId: post.ownerId, published: post.published, workspaceId: post.workspaceId, tagCount: post.tags.length },
  }

  return (
    <main className="page-wrap flex flex-col gap-4 px-4 pb-8 pt-14">
      <nav>
        <Link className="text-xs text-[var(--sea-ink-soft)] hover:underline" to="/posts">
          ← posts
        </Link>
      </nav>

      <Authorize
        action="read"
        fallback={<p className="text-xs italic text-[var(--sea-ink-soft)]">hidden by policy.</p>}
        resource={resource}
      >
        <article>
          <h1 className="text-2xl font-semibold">{post.title}</h1>
          <p className="text-xs text-[var(--sea-ink-soft)]">
            {post.workspaceId} · {post.published ? 'published' : 'draft'} · owner {post.ownerId}
          </p>
          <p className="mt-3 text-sm">{post.body}</p>
        </article>
      </Authorize>

      <section className="rounded-xl border border-[var(--line)] p-3">
        <header className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Why publish?</h2>
          <span className="text-[10px] text-[var(--sea-ink-soft)]">live trace for current subject</span>
        </header>
        {explain.isLoading && <p className="text-xs">loading trace…</p>}
        {explain.data && (
          <div className="text-xs">
            <p className="mb-2">
              decision:{' '}
              <span className={explain.data.decision.allowed ? 'text-emerald-500' : 'text-rose-500'}>
                {explain.data.decision.allowed ? 'ALLOW' : 'DENY'}
              </span>{' '}
              · {explain.data.summary}
            </p>
            <details>
              <summary className="cursor-pointer text-[var(--sea-ink-soft)]">policies ({explain.data.policies.length})</summary>
              <pre className="mt-2 max-h-80 overflow-auto rounded bg-black/40 p-2 text-[10px]">
                {JSON.stringify(explain.data.policies, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-sm font-semibold">Comments ({comments.length})</h2>
        <Authorize action="comment" resource={resource}>
          <form
            className="mt-2 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              if (!draftComment.trim() || !me) return
              createComment.mutate({ postId: post.id, body: draftComment, ownerId: me.id })
              setDraftComment('')
            }}
          >
            <input
              className="flex-1 rounded border border-[var(--line)] bg-transparent px-2 py-1 text-xs"
              onChange={(e) => setDraftComment(e.target.value)}
              placeholder="add a comment…"
              value={draftComment}
            />
            <button className="rounded border border-[var(--line)] px-2 py-1 text-xs" type="submit">
              post
            </button>
          </form>
        </Authorize>
        <ul className="mt-2 flex flex-col gap-1">
          {comments.map((c) => (
            <li className="flex items-start justify-between gap-2 rounded border border-[var(--line)] p-2 text-xs" key={c.id}>
              <div>
                <p>{c.body}</p>
                <p className="text-[10px] text-[var(--sea-ink-soft)]">by {c.ownerId}</p>
              </div>
              <Authorize action="delete" resource={{ type: 'comment', id: c.id, attributes: { ownerId: c.ownerId, postId: c.postId } }}>
                <button className="rounded border border-rose-700 px-2 py-0.5 text-[10px] text-rose-500" onClick={() => deleteComment.mutate(c.id)} type="button">
                  delete
                </button>
              </Authorize>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
