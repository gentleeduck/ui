import { useAuth, useCurrentUser } from '../iam/auth-context'

export function UserSwitcher() {
  const { users, currentUserId, setCurrentUserId } = useAuth()
  const me = useCurrentUser()

  return (
    <div className="sticky top-[60px] z-40 flex items-center gap-3 border-b border-[var(--line)] bg-[var(--header-bg)] px-4 py-2 text-xs">
      <span className="font-semibold text-[var(--sea-ink-soft)]">Acting as</span>
      <select
        value={currentUserId ?? ''}
        onChange={(e) => setCurrentUserId(e.target.value || null)}
        className="rounded border border-[var(--line)] bg-transparent px-2 py-1 text-xs"
      >
        <option value="">— anonymous —</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name} · {u.tier} · {u.workspaceId}
          </option>
        ))}
      </select>
      {me && (
        <span className="text-[var(--sea-ink-soft)]">
          {me.email} · roles via engine.admin
        </span>
      )}
    </div>
  )
}
