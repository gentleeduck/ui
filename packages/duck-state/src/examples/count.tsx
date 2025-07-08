import atom from '~/atom'
import { useAtom } from '~/react'

const countAtom = atom(0)

export function Counter() {
  const [count, setCount] = useAtom(countAtom)

  return (
    <div>
      <h2>Counter: {count}</h2>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
      <button onClick={() => setCount((c) => c - 1)}>Decrement</button>
    </div>
  )
}
