import { createFileRoute, Link } from '@tanstack/react-router'
import { useCurrentUser } from '../iam/auth-context'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  const me = useCurrentUser()
  return (
    <main className="page-wrap flex flex-col gap-6 px-4 pb-12 pt-14">
      <header>
        <h1 className="text-2xl font-semibold">duck-iam · TanStack Start example</h1>
        <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">
          End-to-end ABAC + RBAC demo backed by an in-memory mock backend. Switch users above to see decisions flip in real time.
        </p>
      </header>

      <section className="grid gap-3 md:grid-cols-3">
        <Card description="List + create + delete posts. Per-action buttons gated by engine.can()." href="/posts" title="Posts" />
        <Card description="Assign and revoke RBAC roles via engine.admin." href="/users" title="Users" />
        <Card description="Full devtools panel: decision inspector, policies, roles, metrics." href="/iam" title="IAM devtools" />
      </section>

      <section className="rounded-xl border border-[var(--line)] p-4 text-xs">
        <p className="font-semibold">Current subject</p>
        {me ? (
          <p className="mt-1 text-[var(--sea-ink-soft)]">
            {me.name} · {me.email} · tier <strong>{me.tier}</strong> · workspace <strong>{me.workspaceId}</strong>
          </p>
        ) : (
          <p className="mt-1 italic text-[var(--sea-ink-soft)]">anonymous</p>
        )}
      </section>
    </main>
  )
}

function Card({ title, description, href }: { title: string; description: string; href: '/posts' | '/users' | '/iam' }) {
  return (
    <Link className="block rounded-xl border border-[var(--line)] p-4 no-underline transition hover:bg-[var(--link-bg-hover)]" to={href}>
      <h2 className="text-sm font-semibold">{title}</h2>
      <p className="mt-1 text-xs text-[var(--sea-ink-soft)]">{description}</p>
    </Link>
  )
}
