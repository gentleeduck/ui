import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Authorize } from '../iam/hooks'
import { engine } from '../iam/engine'
import { useAssignRole, useRevokeRole, useUsers } from '../iam/queries'
import { APP_ROLES, type AppRole } from '../iam/types'

export const Route = createFileRoute('/users')({ component: UsersPage })

function UsersPage() {
  const { data: users = [] } = useUsers()
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [selectedRole, setSelectedRole] = React.useState<AppRole>('reader')
  const assignRole = useAssignRole()
  const revokeRole = useRevokeRole()

  const selected = users.find((u) => u.id === selectedId) ?? null

  const { data: assignments = [] } = useQuery({
    queryKey: ['iam', 'assignments', selectedId],
    enabled: Boolean(selectedId),
    queryFn: async () => {
      if (!selectedId) return []
      const all = await engine.admin.listRoles()
      // engine doesn't expose listAssignments; rely on subject roles via getAttributes + resolveSubject's behavior.
      // For demo purposes, just show what roles exist.
      return all.map((r) => r.id)
    },
  })

  return (
    <main className="page-wrap flex flex-col gap-4 px-4 pb-8 pt-14">
      <header>
        <h1 className="text-xl font-semibold">Users</h1>
        <p className="text-xs text-[var(--sea-ink-soft)]">
          RBAC assignments via <code>engine.admin.assignRole</code>. Switch user in the bar to act as that subject.
        </p>
      </header>

      <Authorize action="read" resource={{ type: 'user' }} fallback={<p className="text-xs italic">no permission to list users</p>}>
        <ul className="grid gap-2 md:grid-cols-2">
          {users.map((u) => (
            <li key={u.id}>
              <button
                className={`flex w-full flex-col items-start rounded-xl border p-3 text-left text-xs ${
                  selectedId === u.id ? 'border-emerald-700 bg-emerald-950/30' : 'border-[var(--line)]'
                }`}
                onClick={() => setSelectedId(u.id)}
                type="button"
              >
                <span className="font-semibold">{u.name}</span>
                <span className="text-[var(--sea-ink-soft)]">
                  {u.email} · {u.tier} · {u.workspaceId}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Authorize>

      {selected && (
        <Authorize action="update" resource={{ type: 'user', id: selected.id }} fallback={<p className="text-xs italic">no permission to manage roles</p>}>
          <section className="flex flex-col gap-3 rounded-xl border border-[var(--line)] p-3 text-xs">
            <header className="flex items-center justify-between">
              <h2 className="font-semibold">Role assignment · {selected.name}</h2>
              <span className="text-[10px] text-[var(--sea-ink-soft)]">{assignments.length} roles defined</span>
            </header>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2">
                role
                <select
                  className="rounded border border-[var(--line)] bg-transparent px-2 py-1"
                  onChange={(e) => setSelectedRole(e.target.value as AppRole)}
                  value={selectedRole}
                >
                  {APP_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </label>
              <button
                className="rounded border border-emerald-700 px-2 py-1 text-emerald-500"
                onClick={() => assignRole.mutate({ subjectId: selected.id, roleId: selectedRole, scope: selected.workspaceId })}
                type="button"
              >
                assign
              </button>
              <button
                className="rounded border border-rose-700 px-2 py-1 text-rose-500"
                onClick={() => revokeRole.mutate({ subjectId: selected.id, roleId: selectedRole, scope: selected.workspaceId })}
                type="button"
              >
                revoke
              </button>
            </div>
            <p className="text-[10px] text-[var(--sea-ink-soft)]">
              Scope defaults to the user's workspace (<code>{selected.workspaceId}</code>). Use the IAM devtools page for
              cross-scope debugging.
            </p>
          </section>
        </Authorize>
      )}
    </main>
  )
}
