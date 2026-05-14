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
 */
export function useKeyBind(binding: string, handler: () => void, options?: Vim.IKeyBindHookOptions): void {
  const ctx = React.useContext(KeyContext)
  const handlerRef = React.useRef(handler)
  handlerRef.current = handler

  React.useEffect(() => {
    const { targetRef, ...bindOpts } = options ?? {}

    const execute = () => handlerRef.current()

    if (ctx) {
      const handle: Command.IRegistrationHandle = ctx.registry.register(
        binding,
        { name: binding, execute },
        bindOpts as Command.IKeyBindOptions,
      )

      // targetRef → scoped handler that only listens on that element.
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
 * Binds a multi-step key sequence (e.g. `['g', 'd']`).
 * Uses the context {@link SequenceManager} when available; otherwise standalone.
 */
export function useKeySequence(steps: string[], handler: () => void, options?: Vim.ISequenceHookOptions): void {
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
