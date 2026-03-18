import { useCallback } from 'react'
import type { KeyboardConfig, KeyboardReturn } from './use-keyboard.types'

/** Maximum number of days to skip when searching for the next non-disabled date. */
const MAX_SKIP = 365

type Action<TDate> = (focused: TDate, config: KeyboardConfig<TDate>) => TDate | null // null means "no movement, just a side-effect"

function stepUntilEnabled<TDate>(
  start: TDate,
  config: KeyboardConfig<TDate>,
  step: (date: TDate) => TDate,
): TDate | null {
  let candidate = step(start)
  for (let i = 0; i < MAX_SKIP; i++) {
    if (!config.isDisabled(candidate)) return candidate
    candidate = step(candidate)
  }
  return null // all candidates were disabled
}

function buildActionMap<TDate>(): Record<string, Action<TDate>> {
  return {
    ArrowLeft: (focused, config) => stepUntilEnabled(focused, config, (d) => config.adapter.addDays(d, -1)),

    ArrowRight: (focused, config) => stepUntilEnabled(focused, config, (d) => config.adapter.addDays(d, 1)),

    ArrowUp: (focused, config) => stepUntilEnabled(focused, config, (d) => config.adapter.addDays(d, -7)),

    ArrowDown: (focused, config) => stepUntilEnabled(focused, config, (d) => config.adapter.addDays(d, 7)),

    PageUp: (focused, config) => stepUntilEnabled(focused, config, (d) => config.adapter.addMonths(d, -1)),

    PageDown: (focused, config) => stepUntilEnabled(focused, config, (d) => config.adapter.addMonths(d, 1)),

    'Shift+PageUp': (focused, config) => stepUntilEnabled(focused, config, (d) => config.adapter.addYears(d, -1)),

    'Shift+PageDown': (focused, config) => stepUntilEnabled(focused, config, (d) => config.adapter.addYears(d, 1)),

    Home: (focused, config) => {
      const weekStart = config.weekStartDay ?? 0
      const start = config.adapter.startOfWeek(focused, weekStart)
      if (!config.isDisabled(start)) return start
      return stepUntilEnabled(start, config, (d) => config.adapter.addDays(d, 1))
    },

    End: (focused, config) => {
      const weekStart = config.weekStartDay ?? 0
      // end of week = start of week + 6
      const end = config.adapter.addDays(config.adapter.startOfWeek(focused, weekStart), 6)
      if (!config.isDisabled(end)) return end
      return stepUntilEnabled(end, config, (d) => config.adapter.addDays(d, -1))
    },
  }
}

// built once, outside the hook — no re-creation on render
const ACTION_MAP = buildActionMap<any>()

export function useKeyboard<TDate>(config: KeyboardConfig<TDate>): KeyboardReturn {
  const { focusedDate, onFocusChange, onSelect, onDismiss, isDisabled, adapter, weekStartDay } = config

  const onKeyDown: React.KeyboardEventHandler = useCallback(
    (e) => {
      const key = e.shiftKey && (e.key === 'PageUp' || e.key === 'PageDown') ? `Shift+${e.key}` : e.key

      // Enter / Space — select
      if (key === 'Enter' || key === ' ') {
        e.preventDefault()
        if (!isDisabled(focusedDate)) {
          onSelect(focusedDate)
        }
        return
      }

      // Escape — dismiss
      if (key === 'Escape') {
        e.preventDefault()
        onDismiss?.()
        return
      }

      const action = (ACTION_MAP as Record<string, Action<TDate>>)[key]
      if (!action) return

      e.preventDefault()
      const configObj: KeyboardConfig<TDate> = {
        focusedDate,
        onFocusChange,
        onSelect,
        onDismiss,
        isDisabled,
        adapter,
        weekStartDay,
      }
      const next = action(focusedDate, configObj)
      if (next !== null) {
        onFocusChange(next)
      }
    },
    [focusedDate, onFocusChange, onSelect, onDismiss, isDisabled, adapter, weekStartDay],
  )

  return { onKeyDown }
}
