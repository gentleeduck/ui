'use client'

const USERS = [
  { id: 'alice', name: 'Alice', role: 'viewer' },
  { id: 'bob', name: 'Bob', role: 'editor' },
  { id: 'charlie', name: 'Charlie', role: 'admin' },
]

export function UserSwitcher({ currentUser }: { currentUser: string }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <span style={{ fontWeight: 'bold' }}>User:</span>
      {USERS.map((u) => (
        <form key={u.id} action="/api/switch-user" method="POST" style={{ display: 'inline' }}>
          <input type="hidden" name="userId" value={u.id} />
          <button
            type="submit"
            style={{
              padding: '6px 12px',
              border: '1px solid #ccc',
              borderRadius: 6,
              cursor: 'pointer',
              background: currentUser === u.id ? '#0070f3' : '#fff',
              color: currentUser === u.id ? '#fff' : '#333',
            }}>
            {u.name} <small>({u.role})</small>
          </button>
        </form>
      ))}
    </div>
  )
}
