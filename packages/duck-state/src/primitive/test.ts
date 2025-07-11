import { atom } from './atom'

/* ======================================================== Atom Test API ======================================================== */
const countAtom = atom(0)
// inferred as: PrimitiveAtom<number> & WithInitValue<number>
const doubleCountAtom = atom((get) => get(countAtom) * 2)
// inferred as: PrimitiveAtom<number>
const addAtom = atom(
  (get) => get(countAtom),
  (get, set, amount: number) => {
    set(countAtom, (prev) => prev + amount)
  },
)
// inferred as: WritableAtom<number, [number], void>
const logAtom = atom(0, (_get, _set, msg: string) => {
  console.log('Log:', msg)
})
// inferred as: WritableAtom<number, [string], void> & WithInitValue<number>
const optionalValueAtom = atom<string>()
// inferred as: PrimitiveAtom<string | undefined> & WithInitValue<string | undefined>
const todosAtom = atom<string[]>([])

const addTodoAtom = atom(
  (get) => get(todosAtom),
  (get, set, newTodo: string) => {
    const current = get(todosAtom)
    set(todosAtom, [...current, newTodo])
  },
)
// inferred as: WritableAtom<string[], [string], void>
const multiplyAtom = atom(
  (get) => get(countAtom),
  (get, set, factor: number, repeat: number) => {
    let value = get(countAtom)
    for (let i = 0; i < repeat; i++) {
      value *= factor
    }
    set(countAtom, value)
  },
)
// inferred as: WritableAtom<number, [number, number], void>
