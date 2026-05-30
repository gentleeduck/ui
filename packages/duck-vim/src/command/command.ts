'use client'
import { isInputElement } from '../matcher/matcher'
import {
  KEY_ALIASES,
  keyboardEventToDescriptor,
  MODIFIER_KEY_EVENT_NAMES,
  MODIFIER_KEYS,
  normalizeKeyBind,
} from '../parser/parser'
import type { Command } from './command.types'

/** Narrows the `HTMLElement | Document` union to a `KeyboardEvent` listener. */
function addKeyListener(
  target: HTMLElement | Document,
  type: 'keydown' | 'keyup',
  listener: (e: KeyboardEvent) => void,
): void {
  target.addEventListener(type, listener as EventListener)
}

function removeKeyListener(
  target: HTMLElement | Document,
  type: 'keydown' | 'keyup',
  listener: (e: KeyboardEvent) => void,
): void {
  target.removeEventListener(type, listener as EventListener)
}

/**
 * Canonicalize a chord key for matching what {@link keyboardEventToDescriptor} emits.
 * Steps split on non-modifier keys (modifiers keep accumulating into current step).
 */
function normalizeChordKey(key: string): string {
  const parts = key.split('+')
  const steps: string[] = []
  let buffer: string[] = []
  for (const raw of parts) {
    buffer.push(raw)
    const lower = raw.trim().toLowerCase()
    if (lower === 'ctrl' || lower === 'alt' || lower === 'meta' || lower === 'shift' || lower === 'mod') continue
    if (lower === 'control' || lower === 'cmd' || lower === 'command' || lower === 'opt' || lower === 'option') continue
    steps.push(normalizeKeyBind(buffer.join('+')))
    buffer = []
  }
  if (buffer.length > 0) steps.push(normalizeKeyBind(buffer.join('+')))
  return steps.join('+')
}

/** Key-sequence → command registry; prefix index enables chord lookup in {@link KeyHandler}. */
export class Registry {
  private entries = new Map<string, Command.IRegistryEntry>()
  private prefixes = new Set<string>()

  constructor(public debug: boolean = false) {
    if (this.debug) console.log('[Registry] Initialized')
  }

  public register(
    key: string,
    command: Command.ICommand,
    options?: Command.IKeyBindOptions,
  ): Command.IRegistrationHandle {
    const opts: Command.IKeyBindOptions = { ...options }
    const canonical = normalizeChordKey(key)

    if (this.entries.has(canonical)) {
      const behavior = opts.conflictBehavior ?? 'warn'
      if (behavior === 'error') {
        throw new Error(`Key binding '${key}' is already registered`)
      }
      if (behavior === 'warn') {
        console.warn(`[Registry] Key binding '${key}' is already registered, replacing`)
      }
      // 'replace' and 'allow' silently proceed
    }

    const entry: Command.IRegistryEntry = { command, options: opts, fired: false }
    this.entries.set(canonical, entry)
    this.addPrefixes(canonical)
    if (this.debug) console.log(`[Registry] Registered '${key}'`)

    return {
      unregister: () => this.unregister(canonical),
      setEnabled: (enabled: boolean) => {
        entry.options.enabled = enabled
      },
      isEnabled: () => entry.options.enabled !== false,
      resetFired: () => {
        entry.fired = false
      },
    }
  }

  public unregister(key: string): boolean {
    const canonical = normalizeChordKey(key)
    const removed = this.entries.delete(canonical)
    if (removed) {
      this.rebuildPrefixes()
      if (this.debug) console.log(`[Registry] Unregistered '${key}'`)
    }
    return removed
  }

  public hasCommand(key: string): boolean {
    if (this.entries.has(key)) return true
    return this.entries.has(normalizeChordKey(key))
  }

  public getCommand(key: string): Command.ICommand | undefined {
    return (this.entries.get(key) ?? this.entries.get(normalizeChordKey(key)))?.command
  }

  public getEntry(key: string): Command.IRegistryEntry | undefined {
    return this.entries.get(key) ?? this.entries.get(normalizeChordKey(key))
  }

  public getOptions(key: string): Command.IKeyBindOptions | undefined {
    return (this.entries.get(key) ?? this.entries.get(normalizeChordKey(key)))?.options
  }

  /** True if `key` is a prefix of any registered chord (for multi-key sequences). */
  public isPrefix(key: string): boolean {
    return this.prefixes.has(key)
  }

  public getAllCommands(): Map<string, Command.ICommand> {
    const result = new Map<string, Command.ICommand>()
    for (const [key, entry] of this.entries) {
      result.set(key, entry.command)
    }
    return result
  }

  /** Iterate all registered entries — used by KeyHandler to scan `fired` flags on keyup. */
  public iterateEntries(): IterableIterator<[string, Command.IRegistryEntry]> {
    return this.entries.entries()
  }

  public clear(): void {
    this.entries.clear()
    this.prefixes.clear()
    if (this.debug) console.log('[Registry] Cleared all commands')
  }

  /** Incrementally adds prefixes for a single new key — avoids O(K·C) full rebuild. */
  private addPrefixes(key: string): void {
    const parts = key.split('+')
    for (let i = 1; i <= parts.length; i++) {
      this.prefixes.add(parts.slice(0, i).join('+'))
    }
  }

  private rebuildPrefixes(): void {
    this.prefixes.clear()
    for (const k of this.entries.keys()) {
      this.addPrefixes(k)
    }
  }
}

/**
 * Listens for keydown events and dispatches commands from a {@link Registry}.
 * Buffers keystrokes within a timeout window to resolve chord sequences.
 */
export class KeyHandler {
  private seq: string[] = []
  private timeoutId: ReturnType<typeof setTimeout> | null = null
  private timeoutMs: number
  private defaultOptions: Partial<Command.IKeyBindOptions>
  // Track attached target so detach() without arg cleans up the right element.
  private attachedTarget: HTMLElement | Document | null = null

  constructor(
    private registry: Registry,
    timeoutMs: number = 600,
    defaultOptions: Partial<Command.IKeyBindOptions> = {},
  ) {
    this.timeoutMs = timeoutMs
    this.defaultOptions = defaultOptions
  }

  public attach(target: HTMLElement | Document = document): void {
    if (this.attachedTarget && this.attachedTarget !== target) {
      console.warn('[KeyHandler] attach() called while already attached; detach first')
      return
    }
    this.attachedTarget = target
    addKeyListener(target, 'keydown', this.handleKey)
    addKeyListener(target, 'keyup', this.handleKeyUp)
    if (this.registry.debug) console.log('[KeyHandler] Attached to target')
  }

  /** If `target` is omitted, detaches from the element that was passed to {@link attach}. */
  public detach(target?: HTMLElement | Document): void {
    const t = target ?? this.attachedTarget
    if (!t) return
    removeKeyListener(t, 'keydown', this.handleKey)
    removeKeyListener(t, 'keyup', this.handleKeyUp)
    if (this.attachedTarget === t) this.attachedTarget = null
    if (this.registry.debug) console.log('[KeyHandler] Detached from target')
  }

  private resetSequence(): void {
    if (this.registry.debug) console.log(`[Sequence] Reset (was: '${this.seq.join('+')}')`)
    this.seq = []
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
  }

  private executeCommand(key: string, e: KeyboardEvent, phase: 'keydown' | 'keyup' = 'keydown'): boolean {
    const entry = this.registry.getEntry(key)
    if (!entry) return false

    const opts: Command.IKeyBindOptions = { ...this.defaultOptions, ...entry.options }
    const targetPhase = opts.eventType ?? 'keydown'
    if (targetPhase !== phase) return false

    if (opts.enabled === false) return false
    if (opts.ignoreInputs && isInputElement(e.target)) return false
    if (opts.requireReset && entry.fired) return false

    if (opts.preventDefault) e.preventDefault()
    if (opts.stopPropagation) e.stopPropagation()

    // Fire-and-forget: async errors must be caught by the consumer.
    void entry.command.execute()

    if (opts.requireReset) {
      entry.fired = true
    }

    return true
  }

  /**
   * Dispatches a `keydown` event into the registry chord matcher.
   * Public so callers (e.g. `KeyProvider`) can fan a single listener out into
   * multiple subsystems without paying for two `addEventListener` calls.
   */
  public handleKey = (e: KeyboardEvent): void => {
    // Use the parser's canonical descriptor — keeps modifier order in sync with
    // anything produced by parseKeyBind/normalizeKeyBind, so Map lookups always match.
    const desc = keyboardEventToDescriptor(e)
    if (!desc) return

    this.seq.push(desc)
    const joined = this.seq.join('+')
    if (this.registry.debug) console.log(`[Sequence] '${joined}'`)

    if (this.registry.hasCommand(joined)) {
      if (this.registry.debug) console.log(`[Match] '${joined}'`)
      this.executeCommand(joined, e)
      this.resetSequence()
      return
    }

    if (this.registry.isPrefix(joined)) {
      if (this.registry.debug) console.log(`[Prefix] '${joined}'`)
      if (this.timeoutId) clearTimeout(this.timeoutId)
      this.timeoutId = setTimeout(() => this.resetSequence(), this.timeoutMs)
      return
    }

    // Sequence dead-end: drop history and retry treating last key as fresh start.
    if (this.registry.debug) console.log(`[NoMatch] '${joined}', retrying`)
    this.resetSequence()
    this.seq.push(desc)

    if (this.registry.hasCommand(desc)) {
      if (this.registry.debug) console.log(`[Match] '${desc}'`)
      this.executeCommand(desc, e)
      this.resetSequence()
    } else if (this.registry.isPrefix(desc)) {
      this.timeoutId = setTimeout(() => this.resetSequence(), this.timeoutMs)
    } else {
      this.resetSequence()
    }
  }

  /**
   * Dispatches a `keyup` event so `requireReset` bindings auto-clear their
   * `fired` flag when any non-modifier constituent of the bound chord is
   * released. Also fires bindings registered with `eventType: 'keyup'`.
   */
  public handleKeyUp = (e: KeyboardEvent): void => {
    if (MODIFIER_KEY_EVENT_NAMES.has(e.key)) return
    const desc = keyboardEventToDescriptor(e)
    if (!desc) return

    // Fire any binding registered with `eventType: 'keyup'` whose descriptor matches.
    if (this.registry.hasCommand(desc)) {
      this.executeCommand(desc, e, 'keyup')
    }

    // Clear `fired` on any entry whose chord contains the released non-modifier key.
    // For chord bindings like `g+d`, the keyup of `g` or `d` (descriptor `'g'`/`'d'`)
    // would not match the entry key `'g+d'` directly — so we scan all fired entries
    // and check whether the released key is a non-modifier constituent of the chord.
    const releasedKey = normalizeKeyPartFromEventKey(e.key)
    for (const [chordKey, entry] of this.registry.iterateEntries()) {
      if (!entry.fired) continue
      if (chordContainsNonModifier(chordKey, releasedKey)) {
        entry.fired = false
      }
    }
  }
}

/** Lowercase + alias-normalise a raw `KeyboardEvent.key` to its canonical form. */
function normalizeKeyPartFromEventKey(rawKey: string): string {
  if (rawKey in KEY_ALIASES) return KEY_ALIASES[rawKey as keyof typeof KEY_ALIASES]
  const lower = rawKey.toLowerCase().trim()
  return (KEY_ALIASES as Record<string, string>)[lower] ?? lower
}

/**
 * Returns true if `releasedKey` matches any non-modifier `+`-separated segment
 * of the canonical chord key. Modifier segments (ctrl/alt/meta/shift) are skipped.
 */
function chordContainsNonModifier(chordKey: string, releasedKey: string): boolean {
  // chordKey is already canonical (joined by '+' with no spaces).
  const parts = chordKey.split('+')
  for (const part of parts) {
    if (MODIFIER_KEYS.has(part)) continue
    if (part === releasedKey) return true
  }
  return false
}
