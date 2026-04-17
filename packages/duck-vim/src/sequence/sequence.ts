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
 * Manages multiple key sequence registrations.
 * Feed keyboard events via handleKeyEvent() and sequences are matched automatically.
 */
export class SequenceManager {
  private entries: IInternalEntry[] = []

  /**
   * Registers a new key sequence.
   *
   * @param registration - The sequence registration
   * @returns A handle to unregister the sequence
   */
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

  /**
   * Feed a keyboard event to advance matching for all registered sequences.
   *
   * @param event - The keyboard event
   * @returns true if any sequence was fully matched and executed
   */
  handleKeyEvent(event: KeyboardEvent): boolean {
    // Skip pure modifier key presses
    if (['Shift', 'Control', 'Alt', 'Meta'].includes(event.key)) return false

    let anyMatched = false

    for (const entry of this.entries) {
      if (!entry.options.enabled) continue

      const expectedStep = entry.parsedSteps[entry.currentStep]
      if (!expectedStep) continue

      if (matchesKeyboardEvent(expectedStep, event)) {
        // Step matched, advance
        this.clearEntryTimeout(entry)
        entry.currentStep++

        if (entry.currentStep >= entry.parsedSteps.length) {
          // Full sequence completed
          entry.handler()
          entry.currentStep = 0
          anyMatched = true
        } else {
          // Start timeout for next step
          entry.timeoutId = setTimeout(() => {
            entry.currentStep = 0
            entry.timeoutId = null
          }, entry.options.timeout)
        }
      } else {
        // Step did not match
        this.clearEntryTimeout(entry)
        entry.currentStep = 0

        // Retry from step 0 with the current event
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

  /**
   * Resets all in-progress sequence matching state.
   */
  reset(): void {
    for (const entry of this.entries) {
      this.clearEntryTimeout(entry)
      entry.currentStep = 0
    }
  }

  /**
   * Returns the aggregate matching state across all entries.
   * Reports progress of the most-advanced entry.
   */
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

  /**
   * Clears all registrations and state.
   */
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

/**
 * Creates a lightweight standalone sequence matcher for a single sequence.
 *
 * @param steps - Array of key binding strings for each step
 * @param handler - Callback when the full sequence matches
 * @param options - Sequence options
 * @returns An object with feed(), reset(), and getState() methods
 */
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
