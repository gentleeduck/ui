import * as React from 'react'

type Machine<S> = { [k: string]: { [k: string]: S } }
type MachineState<T> = keyof T
type MachineEvent<T> = keyof UnionToIntersection<T[keyof T]>
// biome-ignore lint/suspicious/noExplicitAny: `any` is required here for distributive conditional type and contravariant inference to work correctly
type UnionToIntersection<T> = (T extends any ? (x: T) => any : never) extends (x: infer R) => any ? R : never

/** Reducer-based state machine; returns [state, send]. Unmatched events are no-ops. */
export function useStateMachine<M>(initialState: MachineState<M>, machine: M & Machine<MachineState<M>>) {
  return React.useReducer((state: MachineState<M>, event: MachineEvent<M>): MachineState<M> => {
    const nextState = (machine[state] as Record<string, MachineState<M>>)[event as string]
    return nextState ?? state
  }, initialState)
}
