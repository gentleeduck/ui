import * as React from 'react'

type Machine<S> = { [k: string]: { [k: string]: S } }
type MachineState<T> = keyof T
type MachineEvent<T> = keyof UnionToIntersection<T[keyof T]>
type UnionToIntersection<T> = (T extends any ? (x: T) => any : never) extends (x: infer R) => any ? R : never

/**
 * Minimal state machine hook. Takes an initial state and a transition map,
 * returns [currentState, send]. Ignores events with no matching transition.
 */
export function useStateMachine<M>(initialState: MachineState<M>, machine: M & Machine<MachineState<M>>) {
  return React.useReducer((state: MachineState<M>, event: MachineEvent<M>): MachineState<M> => {
    const nextState = (machine[state] as Record<string, MachineState<M>>)[event as string]
    return nextState ?? state
  }, initialState)
}
