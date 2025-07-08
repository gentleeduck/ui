import atom from '~/atom'
import { useAtomValue } from '~/react'

const countAtom = atom(0)
const doubleAtom = atom((get) => get(countAtom) * 2)

export function DoubleCounter() {
  const double = useAtomValue(doubleAtom)

  return <h2>Double Count: {double}</h2>
}
