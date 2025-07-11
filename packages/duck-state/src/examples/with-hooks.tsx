import { atom } from '~/atom'
import { useAtomValue, useSetAtom } from '../atom/hooks'

const countAtom = atom(0)
export function Counter() {
  const count = useAtomValue(countAtom)
  const setCount = useSetAtom(countAtom)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  )
}
