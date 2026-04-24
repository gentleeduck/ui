// Type-safe event emitter and pub-sub types.
//
// No runtime — these types help model the shape of an event system in a
// strongly-typed way. Consumers can build their own emitter classes whose
// method signatures are driven by an `EventMap`.

/**
 * A map from event name to its payload type. Use this as the generic
 * parameter to strongly-typed emitters.
 *
 * @example
 * interface Events {
 *   click: { x: number; y: number }
 *   keypress: { key: string }
 *   close: void
 * }
 */
export type EventMap = Record<string, unknown>

/** Listener signature for a specific event payload. */
export type Listener<P = unknown> = (payload: P) => void

/** Signature returned by subscription APIs to cancel the subscription. */
export type Unsubscribe = () => void

/**
 * Extract the payload type of event `E` from map `M`.
 */
export type EventPayload<M extends EventMap, E extends keyof M> = M[E]

/**
 * Union of all event names in `M`.
 */
export type EventNames<M extends EventMap> = keyof M & string

/**
 * Tuple of arguments expected by `emit(event, ...args)` — either `[]` for
 * void-payload events, or `[payload]`.
 */
export type EmitArgs<M extends EventMap, E extends keyof M> = M[E] extends void ? [] : [payload: M[E]]

/**
 * The shape of a type-safe emitter driven by an `EventMap`.
 */
export interface Emitter<M extends EventMap> {
  on<E extends keyof M>(event: E, listener: Listener<M[E]>): Unsubscribe
  off<E extends keyof M>(event: E, listener: Listener<M[E]>): void
  once<E extends keyof M>(event: E, listener: Listener<M[E]>): Unsubscribe
  emit<E extends keyof M>(event: E, ...args: EmitArgs<M, E>): void
}

/**
 * Pub-sub model where publishing accepts only events in `M` and subscribing
 * can filter by event name.
 */
export interface PubSub<M extends EventMap> {
  publish<E extends keyof M>(event: E, ...args: EmitArgs<M, E>): void
  subscribe<E extends keyof M>(event: E, listener: Listener<M[E]>): Unsubscribe
  subscribeAll(listener: <E extends keyof M>(event: E, payload: M[E]) => void): Unsubscribe
}

/**
 * Handler record — for every event in `M`, a handler that maps its payload
 * to some return type.
 *
 * @example
 * type H = Handlers<Events, void>
 * // {
 * //   click: (p: { x: number; y: number }) => void;
 * //   keypress: (p: { key: string }) => void;
 * //   close: (p: void) => void;
 * // }
 */
export type Handlers<M extends EventMap, R = void> = {
  [E in keyof M]: (payload: M[E]) => R
}

/**
 * Union of single-event actions — useful for redux-like reducers.
 *
 * @example
 * type Action = EventAction<Events>
 * // { type: 'click'; payload: { x: number; y: number } }
 * // | { type: 'keypress'; payload: { key: string } }
 * // | { type: 'close'; payload: void }
 */
export type EventAction<M extends EventMap, Tag extends string = 'type', Data extends string = 'payload'> = {
  [E in keyof M]: _Flat<{ [T in Tag]: E } & { [D in Data]: M[E] }>
}[keyof M]

type _Flat<T> = { [K in keyof T]: T[K] } & {}
