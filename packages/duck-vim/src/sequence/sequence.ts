import { matchesKeyboardEvent } from '../matcher/matcher'
import { parseKeyBind } from '../parser/parser'
import type { Parser } from '../parser/parser.types'
import type { Sequence } from './sequence.types'

interface IInternalEntry {
  id: number
  parsedSteps: Parser.IParsedKeyBind[]
  handler: () => void
  options: Required<Sequence.ISequenceOptions>
  currentStep: number
  timeoutId: ReturnType<typeof setTimeout> | null
}

const DEFAULT_TIMEOUT = 600

let nextId = 0

/**
 * Tracks multi-step key sequences (e.g. `g d`). Feed events via
 * {@link handleKeyEvent}; matching entries advance until completion or timeout.
 */
export class SequenceManager {
  private entries: IInternalEntry[] = []

  register(registration: Sequence.ISequenceRegistration): Sequence.ISequenceHandle {
    const id = nextId++
    const parsedSteps = registration.steps.map((s) => parseKeyBind(s.binding))

    const entry: IInternalEntry = {
      id,
      parsedSteps,
      handler: registration.handler,
      options: {
        timeout: registration.options?.timeout ?? DEFAULT_TIMEOUT,
        enabled: registration.options?.enabled ?? true,
      },
      currentStep: 0,
      timeoutId: null,
    }

    this.entries.push(entry)

    return {
      unregister: () => {
        const idx = this.entries.findIndex((e) => e.id === id)
        if (idx !== -1) {
          const entry = this.entries[idx]
          if (entry) this.clearEntryTimeout(entry)
          this.entries.splice(idx, 1)
        }
      },
    }
  }

  /** Advances all registered sequences with `event`. Returns true if any completed. */
  handleKeyEvent(event: KeyboardEvent): boolean {
    if (['Shift', 'Control', 'Alt', 'Meta'].includes(event.key)) return false

    let anyMatched = false

    for (const entry of this.entries) {
      if (!entry.options.enabled) continue

      const expectedStep = entry.parsedSteps[entry.currentStep]
      if (!expectedStep) continue

      if (matchesKeyboardEvent(expectedStep, event)) {
        this.clearEntryTimeout(entry)
        entry.currentStep++

        if (entry.currentStep >= entry.parsedSteps.length) {
          entry.handler()
          entry.currentStep = 0
          anyMatched = true
        } else {
          entry.timeoutId = setTimeout(() => {
            entry.currentStep = 0
            entry.timeoutId = null
          }, entry.options.timeout)
        }
      } else {
        this.clearEntryTimeout(entry)
        entry.currentStep = 0

        // Failed mid-chord: try the current event as a fresh first step (e.g. `g g d` on user typing `g x g d`).
        const firstStep = entry.parsedSteps[0]
        if (firstStep && matchesKeyboardEvent(firstStep, event)) {
          entry.currentStep = 1
          if (entry.parsedSteps.length === 1) {
            entry.handler()
            entry.currentStep = 0
            anyMatched = true
          } else {
            entry.timeoutId = setTimeout(() => {
              entry.currentStep = 0
              entry.timeoutId = null
            }, entry.options.timeout)
          }
        }
      }
    }

    return anyMatched
  }

  reset(): void {
    for (const entry of this.entries) {
      this.clearEntryTimeout(entry)
      entry.currentStep = 0
    }
  }

  /** Aggregate state across all entries; reports progress of the most-advanced one. */
  getState(): Sequence.ISequenceState {
    let maxProgress = 0
    let maxTotal = 0
    let isMatching = false

    for (const entry of this.entries) {
      if (entry.currentStep > 0) {
        isMatching = true
        if (entry.currentStep > maxProgress) {
          maxProgress = entry.currentStep
          maxTotal = entry.parsedSteps.length
        }
      }
    }

    return {
      completedSteps: maxProgress,
      totalSteps: maxTotal,
      isMatching,
    }
  }

  destroy(): void {
    for (const entry of this.entries) {
      this.clearEntryTimeout(entry)
    }
    this.entries = []
  }

  private clearEntryTimeout(entry: IInternalEntry): void {
    if (entry.timeoutId !== null) {
      clearTimeout(entry.timeoutId)
      entry.timeoutId = null
    }
  }
}

/** Standalone matcher for a single sequence; thin wrapper over {@link SequenceManager}. */
export function createSequenceMatcher(
  steps: string[],
  handler: () => void,
  options?: Sequence.ISequenceOptions,
): { feed: (event: KeyboardEvent) => boolean; reset: () => void; getState: () => Sequence.ISequenceState } {
  const manager = new SequenceManager()
  manager.register({
    steps: steps.map((binding) => ({ binding })),
    handler,
    ...(options !== undefined ? { options } : {}),
  })

  return {
    feed: (event: KeyboardEvent) => manager.handleKeyEvent(event),
    reset: () => manager.reset(),
    getState: () => manager.getState(),
  }
}
