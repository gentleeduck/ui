import atom from '~/atom'
import { useAtom } from './useAtom'

export * from './useAtom'
export * from './useAtomValue'
export * from './useSetAtom'

export const countAtom = atom(0)

export function Counter() {
  const [count, setCount] = useAtom(countAtom)
}
