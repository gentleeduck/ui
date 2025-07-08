import atom from '~/atom'
import { useAtomValue } from '~/react'

const userAtom = atom(async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/users/1')
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json() as Promise<{ name: string; email: string }>
})

export function UserInfo() {
  const user = useAtomValue(userAtom)

  return (
    <div>
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
    </div>
  )
}
