'use client'

import React from 'react'
import { KeyHandler, Registry } from '../command/command'
import type { Command } from '../command/command.types'
import { KeyRecorder } from '../recorder/recorder'
import type { Recorder } from '../recorder/recorder.types'
import { SequenceManager } from '../sequence/sequence'
import type { Sequence } from '../sequence/sequence.types'
import { KeyContext } from './command'
import type { Vim } from './vim.types'

/**
 * Binds `handler` to `binding` (e.g. `'ctrl+k'`, `'g+d'`).
 * Uses the ambient {@link KeyProvider} when available; otherwise spins up a standalone
 * registry scoped to `options.targetRef` or `document`.
 *
 * NOTE: only the individual `options.*` fields listed in the dep array trigger
 * re-registration — pass a stable `options` reference (or rely on the
 * destructured primitives) when you change anything else.
 */
export function useKeyBind(binding: string, handler: () => void, options?: Vim.IKeyBindHookOptions): void {
  const ctx = React.useContext(KeyContext)
  const handlerRef = React.useRef(handler)
  handlerRef.current = handler

  const targetRef = options?.targetRef
  const enabled = options?.enabled
  const preventDefault = options?.preventDefault
  const stopPropagation = options?.stopPropagation
  const ignoreInputs = options?.ignoreInputs
  const requireReset = options?.requireReset
  const conflictBehavior = options?.conflictBehavior

  React.useEffect(() => {
    const bindOpts: Command.IKeyBindOptions = {}
    if (enabled !== undefined) bindOpts.enabled = enabled
    if (preventDefault !== undefined) bindOpts.preventDefault = preventDefault
    if (stopPropagation !== undefined) bindOpts.stopPropagation = stopPropagation
    if (ignoreInputs !== undefined) bindOpts.ignoreInputs = ignoreInputs
    if (requireReset !== undefined) bindOpts.requireReset = requireReset
    if (conflictBehavior !== undefined) bindOpts.conflictBehavior = conflictBehavior

    const execute = () => handlerRef.current()

    if (ctx) {
      const handle: Command.IRegistrationHandle = ctx.registry.register(binding, { name: binding, execute }, bindOpts)

      // targetRef → scoped handler that only listens on that element.
      let scopedHandler: KeyHandler | undefined
      const scopedTarget = targetRef?.current
      if (scopedTarget) {
        scopedHandler = new KeyHandler(ctx.registry, ctx.timeoutMs)
        scopedHandler.attach(scopedTarget)
      }

      return () => {
        handle.unregister()
        scopedHandler?.detach()
      }
    }

    const registry = new Registry(false)
    const keyHandler = new KeyHandler(registry, 600, bindOpts)
    registry.register(binding, { name: binding, execute })

    const target = targetRef?.current ?? document
    keyHandler.attach(target)

    return () => {
      keyHandler.detach()
      registry.clear()
    }
  }, [binding, ctx, targetRef, enabled, preventDefault, stopPropagation, ignoreInputs, requireReset, conflictBehavior])
}

/**
 * Binds a multi-step key sequence (e.g. `['g', 'd']`).
 * Uses the context {@link SequenceManager} when available; otherwise standalone.
 *
 * NOTE: `steps` is compared by its joined string so passing a fresh array of
 * the same bindings each render is safe.
 */
export function useKeySequence(steps: string[], handler: () => void, options?: Vim.ISequenceHookOptions): void {
  const ctx = React.useContext(KeyContext)
  const handlerRef = React.useRef(handler)
  handlerRef.current = handler

  const targetRef = options?.targetRef
  const timeout = options?.timeout
  const enabled = options?.enabled
  // Stable dep key for the steps array — `steps.map` (a method reference) was
  // always identical and therefore useless as a dep.
  const stepsKey = steps.join('|')

  React.useEffect(() => {
    const seqOpts: Sequence.ISequenceOptions = {}
    if (timeout !== undefined) seqOpts.timeout = timeout
    if (enabled !== undefined) seqOpts.enabled = enabled

    const execute = () => handlerRef.current()
    const stepBindings = steps.map((s) => ({ binding: s }))

    if (ctx?.sequenceManager) {
      const handle: Sequence.ISequenceHandle = ctx.sequenceManager.register({
        steps: stepBindings,
        handler: execute,
        options: seqOpts,
      })

      return () => handle.unregister()
    }

    const manager = new SequenceManager()
    const handle = manager.register({
      steps: stepBindings,
      handler: execute,
      options: seqOpts,
    })

    const target: HTMLElement | Document = targetRef?.current ?? document
    const listener = (e: KeyboardEvent) => {
      manager.handleKeyEvent(e)
    }
    // Cast at the boundary: DOM lib's `addEventListener` typing for the
    // `HTMLElement | Document` union picks the loose `EventListener` overload,
    // so we narrow centrally here once. The listener body is `KeyboardEvent`.
    target.addEventListener('keydown', listener as EventListener)

    return () => {
      handle.unregister()
      target.removeEventListener('keydown', listener as EventListener)
      manager.destroy()
    }
    // stepsKey covers `steps` content; eslint-disable: stepsKey is derived from steps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx, stepsKey, targetRef, timeout, enabled])
}

/**
 * Reactive wrapper over {@link KeyRecorder} for "press to set shortcut" UIs.
 * Returns recorder state plus `start`, `stop`, and `reset` controls.
 */
export function useKeyRecorder(): Vim.IKeyRecorderReturn {
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
