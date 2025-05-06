import { atom, useAtom } from 'jotai'
import React from 'react'
import { Suspense } from 'react'

const userIdAtom = atom(1)
const userAtom = atom(async (get, { signal }) => {
  const userId = get(userIdAtom)
  const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}?_delay=2000`, { signal })
  return response.json()
})

const Controls = () => {
  const [userId, setUserId] = useAtom(userIdAtom)
  return (
    <div>
      <div>User Id: {userId}</div>
      <br />
      <br />
      <br />
      <br />
      <button onClick={() => setUserId((c) => c - 1)}>Prev</button>
      <button onClick={() => setUserId((c) => c + 1)}>Next</button>
    </div>
  )
}

const UserName = () => {
  const [user] = useAtom(userAtom)
  return <div>User name: {user.name}</div>
}

const App = () => (
  <>
    <Controls />
    <Suspense fallback="Loading...">
      <UserName />
    </Suspense>
  </>
)

export default App
