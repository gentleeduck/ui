'use client'

import React from 'react'
import { KeyHandler, Registry } from '../command/command'
import type { Command } from '../command/command.types'
import { KeyRecorder } from '../recorder/recorder'
import type { Recorder } from '../recorder/recorder.types'
import { SequenceManager } from '../sequence/sequence'
import type { Sequence } from '../sequence/sequence.types'
import { KeyContext } from './command'
import type { ReactHooks } from './hooks.types'

/**
 * React hook to bind a single key binding.
 *
 * Registers the binding via the context registry when available,
 * or creates a scoped handler when a targetRef is provided.
 *
 * @param binding - A key sequence like 'ctrl+k' or 'g+d'
 * @param handler - The function to call when the binding fires
 * @param options - Optional hook options (enabled, preventDefault, targetRef, etc.)
 *
 * @example
 * ```tsx
 * useKeyBind('ctrl+k', () => setOpen(true), { preventDefault: true })
 * ```
 */
export function useKeyBind(binding: string, handler: () => void, options?: ReactHooks.IKeyBindHookOptions): void {
  const ctx = React.useContext(KeyContext)
  const handlerRef = React.useRef(handler)
  handlerRef.current = handler

  React.useEffect(() => {
    const { targetRef, ...bindOpts } = options ?? {}

    const execute = () => handlerRef.current()

    // If we have a context registry, use it
    if (ctx) {
      const handle: Command.IRegistrationHandle = ctx.registry.register(
        binding,
        { name: binding, execute },
        bindOpts as Command.IKeyBindOptions,
      )

      // If a targetRef is provided, create a scoped handler for that element
      let scopedHandler: KeyHandler | undefined
      if (targetRef?.current) {
        scopedHandler = new KeyHandler(ctx.registry, ctx.timeoutMs)
        scopedHandler.attach(targetRef.current)
      }

      return () => {
        handle.unregister()
        if (scopedHandler && targetRef?.current) {
          scopedHandler.detach(targetRef.current)
        }
      }
    }

    // Without context, create a standalone registry + handler
    const registry = new Registry(false)
    const keyHandler = new KeyHandler(registry, 600, bindOpts as Partial<Command.IKeyBindOptions>)
    registry.register(binding, { name: binding, execute })

    const target = targetRef?.current ?? document
    keyHandler.attach(target)

    return () => {
      keyHandler.detach(target)
      registry.clear()
    }
  }, [
    binding,
    ctx,
    options?.targetRef,
    options?.enabled,
    options?.preventDefault,
    options?.stopPropagation,
    options?.ignoreInputs,
    options,
  ])
}

/**
 * React hook to bind a multi-key sequence.
 *
 * Uses the SequenceManager from context, or creates a standalone one.
 *
 * @param steps - Array of key binding strings forming the sequence (e.g. ['g', 'd'])
 * @param handler - The function to call when the full sequence is entered
 * @param options - Optional sequence options (timeout, enabled, targetRef)
 *
 * @example
 * ```tsx
 * useKeySequence(['g', 'd'], () => navigate('/dashboard'))
 * ```
 */
export function useKeySequence(steps: string[], handler: () => void, options?: ReactHooks.ISequenceHookOptions): void {
  const ctx = React.useContext(KeyContext)
  const handlerRef = React.useRef(handler)
  handlerRef.current = handler

  React.useEffect(() => {
    const { targetRef, ...seqOpts } = options ?? {}
    const execute = () => handlerRef.current()

    if (ctx?.sequenceManager) {
      const handle: Sequence.ISequenceHandle = ctx.sequenceManager.register({
        steps: steps.map((s) => ({ binding: s })),
        handler: execute,
        options: seqOpts,
      })

      return () => handle.unregister()
    }

    // Standalone fallback
    const manager = new SequenceManager()
    const handle = manager.register({
      steps: steps.map((s) => ({ binding: s })),
      handler: execute,
      options: seqOpts,
    })

    const target = targetRef?.current ?? document
    const listener = (e: Event) => manager.handleKeyEvent(e as KeyboardEvent)
    target.addEventListener('keydown', listener)

    return () => {
      handle.unregister()
      target.removeEventListener('keydown', listener)
      manager.destroy()
    }
  }, [ctx, options?.timeout, options?.enabled, steps.map, options])
}

/**
 * React hook for recording key combinations.
 *
 * Returns reactive state and controls for the recorder.
 * Useful for settings UIs where users can customize keybindings.
 *
 * @returns An object with state, start, stop, and reset functions
 *
 * @example
 * ```tsx
 * const { state, start, stop, reset } = useKeyRecorder()
 * // state.recorded contains the last recorded combination
 * ```
 */
export function useKeyRecorder(): ReactHooks.IKeyRecorderReturn {
  const [state, setState] = React.useState<Recorder.IKeyRecorderState>({
    activeKeys: [],
    recorded: null,
    isRecording: false,
  })

  const recorderRef = React.useRef<KeyRecorder | null>(null)

  if (!recorderRef.current) {
    recorderRef.current = new KeyRecorder({
      onRecord: (recorded: string) => {
        setState((prev: Recorder.IKeyRecorderState) => ({ ...prev, recorded }))
      },
      onStart: () => {
        setState((prev: Recorder.IKeyRecorderState) => ({ ...prev, isRecording: true }))
      },
      onStop: () => {
        setState((prev: Recorder.IKeyRecorderState) => ({ ...prev, isRecording: false }))
      },
    })
  }

  React.useEffect(() => {
    return () => {
      recorderRef.current?.destroy()
    }
  }, [])

  const start = React.useCallback((target?: HTMLElement) => {
    recorderRef.current?.start(target ?? document.body)
  }, [])

  const stop = React.useCallback(() => {
    recorderRef.current?.stop()
  }, [])

  const reset = React.useCallback(() => {
    recorderRef.current?.reset()
    setState({ activeKeys: [], recorded: null, isRecording: false })
  }, [])

  return { state, start, stop, reset }
}
