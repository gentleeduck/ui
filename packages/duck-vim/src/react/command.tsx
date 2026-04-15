'use client'

import React from 'react'
import { KeyHandler, Registry } from '../command'
import type { Command } from '../command/command.types'
import { SequenceManager } from '../sequence/sequence'
import type { ReactCommand } from './command.types'

/**
 * A React context that holds the key command registry and handler.
 * Consumers can register commands and interact with the keyboard system.
 */
export const KeyContext = React.createContext<ReactCommand.IKeyContextValue | null>(null)

/**
 * Props for the KeyProvider component.
 */
interface IKeyProviderProps {
  debug?: boolean
  timeoutMs?: number
  defaultOptions?: Partial<Command.IKeyBindOptions>
  children: React.ReactNode
}

/**
 * Provides a `KeyContext` to its children and attaches a global key handler.
 *
 * @param props.debug - Enable debug logging for key events.
 * @param props.timeoutMs - Timeout between key sequence inputs in milliseconds.
 * @param props.defaultOptions - Default key binding options for all registrations.
 * @param props.children - Child components that can access key command functionality.
 *
 * @example
 * ```tsx
 * <KeyProvider debug timeoutMs={500}>
 *   <App />
 * </KeyProvider>
 * ```
 */
export const KeyProvider: React.FC<IKeyProviderProps> = ({
  debug = false,
  timeoutMs = 600,
  defaultOptions,
  children,
}) => {
  const value = React.useMemo<ReactCommand.IKeyContextValue>(() => {
    const registry = new Registry(debug)
    const handler = new KeyHandler(registry, timeoutMs, defaultOptions)
    const sequenceManager = new SequenceManager()

    return { registry, handler, sequenceManager, timeoutMs, defaultOptions }
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
 * React hook to register one or more key-command mappings using the global key registry.
 *
 * @param commands - A record of key sequences and their corresponding commands.
 * @param options - Optional key binding options applied to all commands in this call.
 *
 * @example
 * ```tsx
 * useKeyCommands({
 *   'g+d': {
 *     name: 'Go to Dashboard',
 *     execute: () => navigate('/dashboard'),
 *   },
 *   'ctrl+k': {
 *     name: 'Open Command Palette',
 *     execute: () => setOpen(true),
 *   }
 * })
 * ```
 *
 * > Note: Must be used within a `KeyProvider`.
 */
export function useKeyCommands(commands: Record<string, Command.ICommand>, options?: Command.IKeyBindOptions): void {
  const ctx = React.useContext(KeyContext)
  const handlesRef = React.useRef<Command.IRegistrationHandle[]>([])

  React.useEffect(() => {
    if (!ctx) {
      console.warn('useKeyCommands must be used within a KeyProvider')
      return
    }

    // Clean up previous registrations
    for (const handle of handlesRef.current) {
      handle.unregister()
    }
    handlesRef.current = []

    // Register new commands
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
