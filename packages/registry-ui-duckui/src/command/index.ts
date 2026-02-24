export * from './command'
export * from './command.types'

import {
  useCommandContext as _useCommandContext,
  useCommandListContext as _useCommandListContext,
} from '@gentleduck/primitives/command'

type ScopeArg<T extends (...args: any[]) => any> = Parameters<T>[1]
type CommandContextReturn = ReturnType<typeof _useCommandContext>
type CommandListContextReturn = ReturnType<typeof _useCommandListContext>

/** Convenience hook to access command search state and direction. */
export function useCommandContext(): CommandContextReturn {
  return _useCommandContext('CommandConsumer', undefined as unknown as ScopeArg<typeof _useCommandContext>)
}

/** Convenience hook to access command list refs and item leave handler. */
export function useCommandListContext(): CommandListContextReturn {
  return _useCommandListContext('CommandConsumer', undefined as unknown as ScopeArg<typeof _useCommandListContext>)
}
