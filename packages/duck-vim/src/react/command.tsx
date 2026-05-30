'use client'

import React from 'react'
import { KeyHandler, Registry } from '../command'
import type { Command } from '../command/command.types'
import { SequenceManager } from '../sequence/sequence'
import type { Vim } from './vim.types'

export const KeyContext = React.createContext<Vim.IKeyContextValue | null>(null)

interface IKeyProviderProps {
  debug?: boolean
  timeoutMs?: number
  defaultOptions?: Partial<Command.IKeyBindOptions>
  children: React.ReactNode
}

/**
 * Provides {@link KeyContext} and attaches a single global keydown handler that
 * dispatches into both the {@link Registry} (single/chord bindings) and the
 * {@link SequenceManager} (multi-step sequences).
 */
export const KeyProvider: React.FC<IKeyProviderProps> = ({
  debug = false,
  timeoutMs = 600,
  defaultOptions,
  children,
}) => {
  const value = React.useMemo<Vim.IKeyContextValue>(() => {
    const registry = new Registry(debug)
    const handler = new KeyHandler(registry, timeoutMs, defaultOptions)
    const sequenceManager = new SequenceManager()

    return {
      registry,
      handler,
      sequenceManager,
      timeoutMs,
      ...(defaultOptions !== undefined ? { defaultOptions } : {}),
    }
  }, [debug, timeoutMs, defaultOptions])

  React.useEffect(() => {
    // Single document listener fans out to both registry chord matcher + sequence matcher.
    const onKeyDown = (e: KeyboardEvent) => {
      value.handler.handleKey(e)
      value.sequenceManager.handleKeyEvent(e)
    }
    const onKeyUp = (e: KeyboardEvent) => {
      value.handler.handleKeyUp(e)
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('keyup', onKeyUp)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('keyup', onKeyUp)
      value.sequenceManager.destroy()
    }
  }, [value])

  return <KeyContext.Provider value={value}>{children}</KeyContext.Provider>
}

/**
 * Registers a map of key-sequence → command in the ambient {@link KeyProvider}.
 * Must be used inside a `KeyProvider`.
 *
 * The hook only re-registers when the set of binding keys changes (compared by
 * `Object.keys(commands).join('|')`) — passing fresh `commands` and `options`
 * object literals each render is therefore safe. The latest `execute` body is
 * kept current via a ref so handler closures are never stale.
 */
export function useKeyCommands(commands: Record<string, Command.ICommand>, options?: Command.IKeyBindOptions): void {
  const ctx = React.useContext(KeyContext)
  const handlesRef = React.useRef<Command.IRegistrationHandle[]>([])
  // Always-current snapshot so re-renders don't force re-registration.
  const commandsRef = React.useRef(commands)
  commandsRef.current = commands

  // Stable key for the registered bindings; the actual command bodies live in
  // commandsRef so changing handler/description does not re-register.
  const keysSignature = Object.keys(commands).sort().join('|')
  const enabled = options?.enabled
  const preventDefault = options?.preventDefault
  const stopPropagation = options?.stopPropagation
  const ignoreInputs = options?.ignoreInputs
  const requireReset = options?.requireReset
  const conflictBehavior = options?.conflictBehavior
  const eventType = options?.eventType

  React.useEffect(() => {
    if (!ctx) {
      console.warn('useKeyCommands must be used within a KeyProvider')
      return
    }

    for (const handle of handlesRef.current) {
      handle.unregister()
    }
    handlesRef.current = []

    const opts: Command.IKeyBindOptions = {}
    if (enabled !== undefined) opts.enabled = enabled
    if (preventDefault !== undefined) opts.preventDefault = preventDefault
    if (stopPropagation !== undefined) opts.stopPropagation = stopPropagation
    if (ignoreInputs !== undefined) opts.ignoreInputs = ignoreInputs
    if (requireReset !== undefined) opts.requireReset = requireReset
    if (conflictBehavior !== undefined) opts.conflictBehavior = conflictBehavior
    if (eventType !== undefined) opts.eventType = eventType

    for (const seq of Object.keys(commandsRef.current)) {
      const handle = ctx.registry.register(
        seq,
        {
          // Use the binding key as the command name and proxy execute through
          // the ref so the latest closure is always called.
          name: seq,
          execute: () => {
            const cmd = commandsRef.current[seq]
            if (cmd) cmd.execute()
          },
          ...(commandsRef.current[seq]?.description !== undefined && {
            description: commandsRef.current[seq]?.description,
          }),
        },
        opts,
      )
      handlesRef.current.push(handle)
    }

    return () => {
      for (const handle of handlesRef.current) {
        handle.unregister()
      }
      handlesRef.current = []
    }
    // keysSignature captures the set of bindings; primitive option fields cover the rest.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    ctx,
    keysSignature,
    enabled,
    preventDefault,
    stopPropagation,
    ignoreInputs,
    requireReset,
    conflictBehavior,
    eventType,
  ])
}
