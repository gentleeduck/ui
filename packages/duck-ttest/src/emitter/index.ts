// Type-only event-system shapes. Drive an emitter from an `EventMap`.

/** Map of event name → payload type. */
export type EventMap = Record<string, unknown>

export type Listener<P = unknown> = (payload: P) => void

export type Unsubscribe = () => void

export type EventPayload<M extends EventMap, E extends keyof M> = M[E]

export type EventNames<M extends EventMap> = keyof M & string

/** Args for `emit(event, ...args)`: `[]` for void payload, `[payload]` otherwise. */
export type EmitArgs<M extends EventMap, E extends keyof M> = M[E] extends void ? [] : [payload: M[E]]

/** Type-safe emitter driven by `EventMap`. */
export interface Emitter<M extends EventMap> {
  on<E extends keyof M>(event: E, listener: Listener<M[E]>): Unsubscribe
  off<E extends keyof M>(event: E, listener: Listener<M[E]>): void
  once<E extends keyof M>(event: E, listener: Listener<M[E]>): Unsubscribe
  emit<E extends keyof M>(event: E, ...args: EmitArgs<M, E>): void
}

/** Pub-sub: publish events in `M`; subscribe by name or to all. */
export interface PubSub<M extends EventMap> {
  publish<E extends keyof M>(event: E, ...args: EmitArgs<M, E>): void
  subscribe<E extends keyof M>(event: E, listener: Listener<M[E]>): Unsubscribe
  subscribeAll(listener: <E extends keyof M>(event: E, payload: M[E]) => void): Unsubscribe
}

/** Handler record: `{ [E in keyof M]: (payload: M[E]) => R }`. */
export type Handlers<M extends EventMap, R = void> = {
  [E in keyof M]: (payload: M[E]) => R
}

/** Union of `{ [Tag]: E; [Data]: M[E] }` actions for redux-like reducers. */
export type EventAction<M extends EventMap, Tag extends string = 'type', Data extends string = 'payload'> = {
  [E in keyof M]: _Flat<{ [T in Tag]: E } & { [D in Data]: M[E] }>
}[keyof M]

type _Flat<T> = { [K in keyof T]: T[K] } & {}
