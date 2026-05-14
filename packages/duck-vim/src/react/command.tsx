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

/** Provides {@link KeyContext} and attaches a global keydown handler for descendants. */
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
    value.handler.attach()

    const seqListener = (e: Event) => {
      value.sequenceManager.handleKeyEvent(e as KeyboardEvent)
    }
    document.addEventListener('keydown', seqListener)

    return () => {
      value.handler.detach()
      document.removeEventListener('keydown', seqListener)
      value.sequenceManager.destroy()
    }
  }, [value])

  return <KeyContext.Provider value={value}>{children}</KeyContext.Provider>
}

/**
 * Registers a map of key-sequence → command in the ambient {@link KeyProvider}.
 * Must be used inside a `KeyProvider`. Re-registers whenever `commands` or `options` change.
 */
export function useKeyCommands(commands: Record<string, Command.ICommand>, options?: Command.IKeyBindOptions): void {
  const ctx = React.useContext(KeyContext)
  const handlesRef = React.useRef<Command.IRegistrationHandle[]>([])

  React.useEffect(() => {
    if (!ctx) {
      console.warn('useKeyCommands must be used within a KeyProvider')
      return
    }

    for (const handle of handlesRef.current) {
      handle.unregister()
    }
    handlesRef.current = []

    for (const [seq, cmd] of Object.entries(commands)) {
      const handle = ctx.registry.register(seq, cmd, options)
      handlesRef.current.push(handle)
    }

    return () => {
      for (const handle of handlesRef.current) {
        handle.unregister()
      }
      handlesRef.current = []
    }
  }, [ctx, commands, options])
}
