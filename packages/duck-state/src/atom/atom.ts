/* ======================================================== Atom Types ======================================================== */
type Getter = <Value>(atom: Atom<Value>) => Value
type Setter = <Value, Args extends unknown[], Result>(atom: WritableAtom<Value, Args, Result>, ...args: Args) => Result
type Read<Value, Options = never> = (get: Getter, options: Options) => Value
type Write<Args extends unknown[], Result> = (get: Getter, set: Setter, ...args: Args) => Result
type SetStateAction<Value> = Value | ((prevState: Value) => Value)
export type PrimitiveAtom<Value> = WritableAtom<Value, [SetStateAction<Value>], void>
export type SetAtom<Args extends unknown[], Result> = <P extends Args>(...args: P) => Result

export type Atom<Value> = {
  toString: () => string
  read: Read<Value>
  debugLabel?: string
  // TODO:
  // unstable_is?(a: Atom<unknown>): boolean
  // debugPrivate?: boolean
  // unstable_onInit?: (store: any) => void
}

export interface WritableAtom<Value, Args extends unknown[], Result> extends Atom<Value> {
  read: Read<Value, SetAtom<Args, Result>>
  write: Write<Args, Result>
  // TODO:
  // onMount?: () => () => void
}

type WithInitValue<Value> = {
  initValue: Value
}

/* ================================== Atom Declarations ==================================  */

let keyCount = 0

// writable derived atom
export function atom<Value, Args extends unknown[], Result>(
  read: Read<Value, SetAtom<Args, Result>>,
  write: Write<Args, Result>,
): WritableAtom<Value, Args, Result>
// write-only derived atom
export function atom<Value, Args extends unknown[], Result>(
  init: Value,
  write: Write<Args, Result>,
): WritableAtom<Value, Args, Result> & WithInitValue<Value>
// read-only derived atom
export function atom<TValue>(read: Read<TValue>): PrimitiveAtom<TValue>
// primitive atom without initial value
export function atom<TValue>(): PrimitiveAtom<TValue | undefined> & WithInitValue<TValue | undefined>
// primitive atom
export function atom<TValue>(init: TValue): PrimitiveAtom<TValue> & WithInitValue<TValue>

/* ================================== Atom Implementation ==================================  */
export function atom<TValue, Args extends unknown[], Result>(
  read?: TValue | Read<TValue, SetAtom<Args, Result>>,
  write?: Write<Args, Result>,
) {
  const key = `duck-atom${++keyCount}`
  const config = {
    toString() {
      return import.meta.env?.MODE !== 'production' && this.debugLabel ? key + ':' + this.debugLabel : key
    },
  } as WritableAtom<TValue, Args, Result> & WithInitValue<TValue>

  if (typeof read === 'function') {
    config.read = read as Read<TValue, SetAtom<Args, Result>>
  } else {
    config.initValue = read as TValue
    config.read = defaultRead
    config.write = defaultWrite as never as Write<Args, Result>
  }

  if (write) {
    config.write = write
  }

  return config
}

function defaultRead<Value>(this: Atom<Value>, get: Getter) {
  return get(this)
}

function defaultWrite<Value>(this: PrimitiveAtom<Value>, get: Getter, set: Setter, arg: SetStateAction<Value>) {
  return set(this, typeof arg === 'function' ? (arg as (prev: Value) => Value)(get(this)) : arg)
}
