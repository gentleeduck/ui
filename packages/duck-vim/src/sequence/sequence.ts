import { matchesKeyboardEvent } from '../matcher/matcher'
import { keyboardEventToDescriptor, MODIFIER_KEY_EVENT_NAMES, parseKeyBind } from '../parser/parser'
import type { Parser } from '../parser/parser.types'
import type { Sequence } from './sequence.types'

interface IInternalEntry {
  id: number
  parsedSteps: Parser.IParsedKeyBind[]
  /** Canonical descriptor for `parsedSteps[0]` — joined modifiers + key. */
  firstStepDescriptor: string
  handler: () => void
  options: Required<Sequence.ISequenceOptions>
  currentStep: number
  timeoutId: ReturnType<typeof setTimeout> | null
}

const DEFAULT_TIMEOUT = 600

/** Canonical descriptor for a parsed step — matches `keyboardEventToDescriptor`'s output. */
function parsedStepDescriptor(step: Parser.IParsedKeyBind): string {
  return [...step.modifiers, step.key].join('+')
}

/**
 * Tracks multi-step key sequences (e.g. `g d`). Feed events via
 * {@link handleKeyEvent}; matching entries advance until completion or timeout.
 *
 * The dead-end branch retries the current event as a fresh first step so
 * `g g d` still triggers on `g x g d` — see {@link handleKeyEvent}.
 *
 * First-step dispatch is O(1) via a `Map<descriptor, entry[]>`; only entries
 * already advancing (currentStep > 0) are iterated linearly.
 */
export class SequenceManager {
  /** All registered entries (used by reset/destroy/getState). */
  private entries: IInternalEntry[] = []
  /** Entries indexed by their first-step descriptor for O(1) fresh-start lookup. */
  private byFirstStep = new Map<string, IInternalEntry[]>()
  /** Entries that are mid-chord (currentStep > 0). Iterated on every event. */
  private inProgress: IInternalEntry[] = []
  private nextId = 0

  register(registration: Sequence.ISequenceRegistration): Sequence.ISequenceHandle {
    const id = this.nextId++
    const parsedSteps = registration.steps.map((s) => parseKeyBind(s.binding))
    const firstParsed = parsedSteps[0]
    if (!firstParsed) {
      throw new Error('Sequence must contain at least one step')
    }

    const entry: IInternalEntry = {
      id,
      parsedSteps,
      firstStepDescriptor: parsedStepDescriptor(firstParsed),
      handler: registration.handler,
      options: {
        timeout: registration.options?.timeout ?? DEFAULT_TIMEOUT,
        enabled: registration.options?.enabled ?? true,
      },
      currentStep: 0,
      timeoutId: null,
    }

    this.entries.push(entry)
    const bucket = this.byFirstStep.get(entry.firstStepDescriptor)
    if (bucket) bucket.push(entry)
    else this.byFirstStep.set(entry.firstStepDescriptor, [entry])

    return {
      unregister: () => {
        const idx = this.entries.findIndex((e) => e.id === id)
        if (idx !== -1) {
          const entry = this.entries[idx]
          if (entry) {
            this.clearEntryTimeout(entry)
            this.dropFromInProgress(entry)
            this.dropFromFirstStepIndex(entry)
          }
          this.entries.splice(idx, 1)
        }
      },
    }
  }

  /** Advances all registered sequences with `event`. Returns true if any completed. */
  handleKeyEvent(event: KeyboardEvent): boolean {
    if (MODIFIER_KEY_EVENT_NAMES.has(event.key)) return false

    let anyMatched = false

    // 1) Advance any entries already mid-chord. Iterate a copy so unregister/
    //    handler side effects during the loop don't break iteration.
    if (this.inProgress.length > 0) {
      const advancing = this.inProgress.slice()
      for (const entry of advancing) {
        if (!entry.options.enabled) continue

        const expectedStep = entry.parsedSteps[entry.currentStep]
        if (!expectedStep) continue

        if (matchesKeyboardEvent(expectedStep, event)) {
          this.clearEntryTimeout(entry)
          entry.currentStep++

          if (entry.currentStep >= entry.parsedSteps.length) {
            entry.handler()
            this.dropFromInProgress(entry)
            entry.currentStep = 0
            anyMatched = true
          } else {
            entry.timeoutId = setTimeout(() => {
              this.dropFromInProgress(entry)
              entry.currentStep = 0
              entry.timeoutId = null
            }, entry.options.timeout)
          }
        } else {
          // Mismatch mid-chord: drop the entry and let the first-step fallback below decide.
          this.clearEntryTimeout(entry)
          this.dropFromInProgress(entry)
          entry.currentStep = 0
        }
      }
    }

    // 2) Try the event as a fresh first step against the O(1) index.
    const desc = keyboardEventToDescriptor(event)
    if (!desc) return anyMatched
    const bucket = this.byFirstStep.get(desc)
    if (!bucket) return anyMatched

    for (const entry of bucket.slice()) {
      if (!entry.options.enabled) continue
      // Already advanced mid-chord above — skip to avoid double-firing.
      if (entry.currentStep > 0) continue

      // Bucket guarantees descriptor-equality but matchesKeyboardEvent also
      // does case-insensitive normalisation on `key`. Keep the check for
      // safety on synthetic events that may not match canonically.
      const first = entry.parsedSteps[0]
      if (!first || !matchesKeyboardEvent(first, event)) continue

      if (entry.parsedSteps.length === 1) {
        entry.handler()
        anyMatched = true
      } else {
        entry.currentStep = 1
        this.inProgress.push(entry)
        entry.timeoutId = setTimeout(() => {
          this.dropFromInProgress(entry)
          entry.currentStep = 0
          entry.timeoutId = null
        }, entry.options.timeout)
      }
    }

    return anyMatched
  }

  reset(): void {
    for (const entry of this.entries) {
      this.clearEntryTimeout(entry)
      entry.currentStep = 0
    }
    this.inProgress = []
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
    this.byFirstStep.clear()
    this.inProgress = []
  }

  private clearEntryTimeout(entry: IInternalEntry): void {
    if (entry.timeoutId !== null) {
      clearTimeout(entry.timeoutId)
      entry.timeoutId = null
    }
  }

  private dropFromInProgress(entry: IInternalEntry): void {
    const idx = this.inProgress.indexOf(entry)
    if (idx !== -1) this.inProgress.splice(idx, 1)
  }

  private dropFromFirstStepIndex(entry: IInternalEntry): void {
    const bucket = this.byFirstStep.get(entry.firstStepDescriptor)
    if (!bucket) return
    const idx = bucket.indexOf(entry)
    if (idx !== -1) bucket.splice(idx, 1)
    if (bucket.length === 0) this.byFirstStep.delete(entry.firstStepDescriptor)
  }
}

/** Single-sequence convenience over {@link SequenceManager}. */
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
