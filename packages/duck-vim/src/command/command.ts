'use client'
import { isInputElement } from '../matcher/matcher'
import type { ICommand, IKeyBindOptions, IRegistrationHandle, IRegistryEntry, RegistryClass } from './command.types'

/**
 * A registry for keyboard command sequences.
 *
 * Maintains a mapping between key combinations (e.g. `ctrl+shift+k`)
 * and their associated commands. Also tracks key sequence prefixes
 * to support multi-key bindings like `g+d`.
 */
export class Registry implements RegistryClass {
  private entries = new Map<string, IRegistryEntry>()
  private prefixes = new Set<string>()

  /**
   * @param {boolean} debug - Enable debug logging for all registry operations.
   */
  constructor(public debug: boolean = false) {
    if (this.debug) console.log('[Registry] Initialized')
  }

  /**
   * Registers a new command with a given key sequence.
   *
   * @param {string} key - A key sequence like `ctrl+k` or `g+d`.
   * @param {ICommand} command - A command object containing an `execute()` function.
   * @param {IKeyBindOptions} [options] - Optional per-binding options.
   * @returns {IRegistrationHandle} A handle for unregistering and controlling the binding.
   *
   * @example
   * const handle = registry.register('ctrl+k', {
   *   name: 'Palette',
   *   execute: () => console.log('Command palette opened')
   * }, { preventDefault: true })
   *
   * // Later:
   * handle.unregister()
   */
  public register(key: string, command: ICommand, options?: IKeyBindOptions): IRegistrationHandle {
    const opts: IKeyBindOptions = { ...options }

    // Conflict detection
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

    const entry: IRegistryEntry = { command, options: opts, fired: false }
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

  /**
   * Unregisters the command at the given key.
   *
   * @param {string} key - The key sequence to remove.
   * @returns {boolean} True if a command was removed.
   */
  public unregister(key: string): boolean {
    const removed = this.entries.delete(key)
    if (removed) {
      this.rebuildPrefixes()
      this.debug && console.log(`[Registry] Unregistered '${key}'`)
    }
    return removed
  }

  /**
   * Checks if a command is registered under the specified key sequence.
   */
  public hasCommand(key: string): boolean {
    return this.entries.has(key)
  }

  /**
   * Retrieves a registered command for the given key sequence.
   */
  public getCommand(key: string): ICommand | undefined {
    return this.entries.get(key)?.command
  }

  /**
   * Retrieves the full registry entry (command + options + state) for a key.
   */
  public getEntry(key: string): IRegistryEntry | undefined {
    return this.entries.get(key)
  }

  /**
   * Retrieves the options for a registered key binding.
   */
  public getOptions(key: string): IKeyBindOptions | undefined {
    return this.entries.get(key)?.options
  }

  /**
   * Determines whether the given key sequence is a known prefix of any command.
   */
  public isPrefix(key: string): boolean {
    return this.prefixes.has(key)
  }

  /**
   * Returns all registered commands.
   */
  public getAllCommands(): Map<string, ICommand> {
    const result = new Map<string, ICommand>()
    for (const [key, entry] of this.entries) {
      result.set(key, entry.command)
    }
    return result
  }

  /**
   * Removes all registered commands.
   */
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
 * Handles keyboard input and dispatches commands based on key sequences.
 *
 * Attaches to a DOM element (or `document` by default) and listens for
 * keydown events. Uses a sequence timeout to support multi-key commands.
 */
export class KeyHandler {
  private seq: string[] = []
  private timeoutId: ReturnType<typeof setTimeout> | null = null
  private TIMEOUT_MS: number
  private defaultOptions: Partial<IKeyBindOptions>

  /**
   * @param {Registry} registry - The command registry to use for key resolution.
   * @param {number} [timeoutMs=600] - Timeout in milliseconds between key presses in a sequence.
   * @param {Partial<IKeyBindOptions>} [defaultOptions={}] - Default options merged with per-binding options.
   */
  constructor(
    private registry: Registry,
    timeoutMs: number = 600,
    defaultOptions: Partial<IKeyBindOptions> = {},
  ) {
    this.TIMEOUT_MS = timeoutMs
    this.defaultOptions = defaultOptions
  }

  /**
   * Starts listening for keyboard events on a given target.
   */
  public attach(target: HTMLElement | Document = document): void {
    target.addEventListener('keydown', this.handleKey as EventListener)
    this.registry.debug && console.log('[KeyHandler] Attached to target')
  }

  /**
   * Stops listening for keyboard events on a given target.
   */
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

  /**
   * Attempt to execute a matched command, respecting its options.
   * Returns true if the command was executed.
   */
  private executeCommand(key: string, e: KeyboardEvent): boolean {
    const entry = this.registry.getEntry(key)
    if (!entry) return false

    const opts: IKeyBindOptions = { ...this.defaultOptions, ...entry.options }

    // Check enabled
    if (opts.enabled === false) return false

    // Check ignoreInputs
    if (opts.ignoreInputs && isInputElement(e.target as Element)) return false

    // Check requireReset
    if (opts.requireReset && entry.fired) return false

    // Apply event modifiers
    if (opts.preventDefault) e.preventDefault()
    if (opts.stopPropagation) e.stopPropagation()

    // Execute
    entry.command.execute()

    // Mark as fired for requireReset
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

    // Retry with only the last key
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
