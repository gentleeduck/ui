'use client'
import { isInputElement } from '../matcher/matcher'
import type { Command } from './command.types'

/**
 * Registry mapping key sequences (e.g. `ctrl+shift+k`, `g+d`) to commands.
 * Tracks prefixes to support multi-key chord bindings.
 */
export class Registry implements Command.RegistryClass {
  private entries = new Map<string, Command.IRegistryEntry>()
  private prefixes = new Set<string>()

  constructor(public debug: boolean = false) {
    if (this.debug) console.log('[Registry] Initialized')
  }

  /**
   * Registers a command for a key sequence.
   * @param key A key sequence like `ctrl+k` or `g+d`.
   * @returns Handle for unregistering and toggling the binding.
   */
  public register(
    key: string,
    command: Command.ICommand,
    options?: Command.IKeyBindOptions,
  ): Command.IRegistrationHandle {
    const opts: Command.IKeyBindOptions = { ...options }

    if (this.entries.has(key)) {
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
    this.entries.set(key, entry)
    this.rebuildPrefixes()
    this.debug && console.log(`[Registry] Registered '${key}'`)

    return {
      unregister: () => this.unregister(key),
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
    const removed = this.entries.delete(key)
    if (removed) {
      this.rebuildPrefixes()
      this.debug && console.log(`[Registry] Unregistered '${key}'`)
    }
    return removed
  }

  public hasCommand(key: string): boolean {
    return this.entries.has(key)
  }

  public getCommand(key: string): Command.ICommand | undefined {
    return this.entries.get(key)?.command
  }

  public getEntry(key: string): Command.IRegistryEntry | undefined {
    return this.entries.get(key)
  }

  public getOptions(key: string): Command.IKeyBindOptions | undefined {
    return this.entries.get(key)?.options
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

  public clear(): void {
    this.entries.clear()
    this.prefixes.clear()
    this.debug && console.log('[Registry] Cleared all commands')
  }

  private rebuildPrefixes(): void {
    this.prefixes.clear()
    for (const key of this.entries.keys()) {
      const parts = key.split('+')
      for (let i = 1; i <= parts.length; i++) {
        this.prefixes.add(parts.slice(0, i).join('+'))
      }
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
  private TIMEOUT_MS: number
  private defaultOptions: Partial<Command.IKeyBindOptions>

  constructor(
    private registry: Registry,
    timeoutMs: number = 600,
    defaultOptions: Partial<Command.IKeyBindOptions> = {},
  ) {
    this.TIMEOUT_MS = timeoutMs
    this.defaultOptions = defaultOptions
  }

  public attach(target: HTMLElement | Document = document): void {
    target.addEventListener('keydown', this.handleKey as EventListener)
    this.registry.debug && console.log('[KeyHandler] Attached to target')
  }

  public detach(target: HTMLElement | Document = document): void {
    target.removeEventListener('keydown', this.handleKey as EventListener)
    this.registry.debug && console.log('[KeyHandler] Detached from target')
  }

  private normalizeKey(key: string): string {
    const lower = key.toLowerCase()
    if (lower === ' ') return 'space'
    if (lower === 'escape') return 'esc'
    if (lower === 'control') return 'ctrl'
    return lower
  }

  // Modifier order (ctrl+alt+meta+shift) must match parser output for matching.
  private buildKeyDescriptor = (e: KeyboardEvent): string | null => {
    if (['Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) return null
    const parts: string[] = []
    if (e.ctrlKey) parts.push('ctrl')
    if (e.altKey) parts.push('alt')
    if (e.metaKey) parts.push('meta')
    if (e.shiftKey) parts.push('shift')
    parts.push(this.normalizeKey(e.key))
    return parts.join('+')
  }

  private resetSequence(): void {
    this.registry.debug && console.log(`[Sequence] Reset (was: '${this.seq.join('+')}')`)
    this.seq = []
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
  }

  private executeCommand(key: string, e: KeyboardEvent): boolean {
    const entry = this.registry.getEntry(key)
    if (!entry) return false

    const opts: Command.IKeyBindOptions = { ...this.defaultOptions, ...entry.options }

    if (opts.enabled === false) return false
    if (opts.ignoreInputs && isInputElement(e.target as Element)) return false
    if (opts.requireReset && entry.fired) return false

    if (opts.preventDefault) e.preventDefault()
    if (opts.stopPropagation) e.stopPropagation()

    entry.command.execute()

    if (opts.requireReset) {
      entry.fired = true
    }

    return true
  }

  private handleKey = (e: KeyboardEvent): void => {
    const desc = this.buildKeyDescriptor(e)
    if (!desc) return

    this.seq.push(desc)
    const joined = this.seq.join('+')
    this.registry.debug && console.log(`[Sequence] '${joined}'`)

    if (this.registry.hasCommand(joined)) {
      this.registry.debug && console.log(`[Match] '${joined}'`)
      this.executeCommand(joined, e)
      this.resetSequence()
      return
    }

    if (this.registry.isPrefix(joined)) {
      this.registry.debug && console.log(`[Prefix] '${joined}'`)
      if (this.timeoutId) clearTimeout(this.timeoutId)
      this.timeoutId = setTimeout(() => this.resetSequence(), this.TIMEOUT_MS)
      return
    }

    // Sequence dead-end: drop history and retry treating last key as fresh start.
    this.registry.debug && console.log(`[NoMatch] '${joined}', retrying`)
    this.resetSequence()
    this.seq.push(desc)

    if (this.registry.hasCommand(desc)) {
      this.registry.debug && console.log(`[Match] '${desc}'`)
      this.executeCommand(desc, e)
      this.resetSequence()
    } else if (this.registry.isPrefix(desc)) {
      this.timeoutId = setTimeout(() => this.resetSequence(), this.TIMEOUT_MS)
    } else {
      this.resetSequence()
    }
  }
}
