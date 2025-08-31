import type { Command, RegistryClass } from './command.types'

/**
 * A registry for keyboard command sequences.
 *
 * Maintains a mapping between key combinations (e.g. `ctrl+shift+k`)
 * and their associated commands. Also tracks key sequence prefixes
 * to support multi-key bindings like `g+d`.
 */
export class Registry implements RegistryClass {
  private commands = new Map<string, Command>()
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
   * @param {Command} command - A command object containing an `execute()` function.
   *
   * @example
   * registry.register('ctrl+k', {
   *   execute: () => console.log('Command palette opened')
   * });
   */
  public register(key: string, command: Command): void {
    this.commands.set(key, command)
    const parts = key.split('+')
    for (let i = 1; i <= parts.length; i++) {
      this.prefixes.add(parts.slice(0, i).join('+'))
    }
    this.debug && console.log(`[Registry] Registered '${key}'`)
  }

  /**
   * Checks if a command is registered under the specified key sequence.
   *
   * @param {string} key - The key sequence to check.
   * @returns {boolean} `true` if a command exists for the given key.
   */
  public hasCommand(key: string): boolean {
    return this.commands.has(key)
  }

  /**
   * Retrieves a registered command for the given key sequence.
   *
   * @param {string} key - The key sequence to retrieve.
   * @returns {Command | undefined} The command if found, otherwise `undefined`.
   */
  public getCommand(key: string): Command | undefined {
    return this.commands.get(key)
  }

  /**
   * Determines whether the given key sequence is a known prefix of any command.
   *
   * Useful for multi-step command sequences like `g+d`.
   *
   * @param {string} key - The key prefix to check.
   * @returns {boolean} `true` if the prefix is valid.
   */
  public isPrefix(key: string): boolean {
    return this.prefixes.has(key)
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

  /**
   * @param {Registry} registry - The command registry to use for key resolution.
   * @param {number} [timeoutMs=600] - Timeout in milliseconds between key presses in a sequence.
   */
  constructor(
    private registry: Registry,
    timeoutMs: number = 600,
  ) {
    this.TIMEOUT_MS = timeoutMs
  }

  /**
   * Starts listening for keyboard events on a given target.
   *
   * @param {HTMLElement | Document} [target=document] - The element to attach the listener to.
   */
  public attach(target: HTMLElement | Document = document): void {
    target.addEventListener('keydown', this.handleKey as EventListener)
    this.registry.debug && console.log('[KeyHandler] Attached to target')
  }

  /**
   * Stops listening for keyboard events on a given target.
   *
   * @param {HTMLElement | Document} [target=document] - The element to detach the listener from.
   */
  public detach(target: HTMLElement | Document = document): void {
    target.removeEventListener('keydown', this.handleKey as EventListener)
    this.registry.debug && console.log('[KeyHandler] Detached from target')
  }

  /**
   * Normalizes keyboard keys to lowercase and maps some aliases.
   *
   * @private
   * @param {string} key - Raw key from event.
   * @returns {string} Normalized key.
   */
  private normalizeKey(key: string): string {
    const lower = key.toLowerCase()
    if (lower === ' ') return 'space'
    if (lower === 'escape') return 'esc'
    if (lower === 'control') return 'ctrl'
    return lower
  }

  /**
   * Builds a normalized key descriptor string for a keyboard event.
   * Combines modifier keys and the actual key, e.g., `ctrl+shift+s`.
   *
   * @private
   * @param {KeyboardEvent} e
   * @returns {string | null} The key descriptor or `null` for pure modifiers.
   */
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

  /**
   * Resets the current key sequence and clears the timeout.
   *
   * @private
   */
  private resetSequence(): void {
    this.registry.debug && console.log(`[Sequence] Reset (was: '${this.seq.join('+')}')`)
    this.seq = []
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
  }

  /**
   * Handles incoming keydown events and resolves them against the registry.
   *
   * Supports both single-key and multi-key sequences.
   *
   * @private
   * @param {KeyboardEvent} e
   */
  private handleKey = (e: KeyboardEvent): void => {
    // window.event?.preventDefault()
    // window.event?.stopPropagation()
    const desc = this.buildKeyDescriptor(e)
    if (!desc) return

    this.seq.push(desc)
    const joined = this.seq.join('+')
    this.registry.debug && console.log(`[Sequence] '${joined}'`)

    if (this.registry.hasCommand(joined)) {
      this.registry.debug && console.log(`[Match] '${joined}'`)
      this.registry.getCommand(joined)!.execute()
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
      this.registry.getCommand(desc)!.execute()
      this.resetSequence()
    } else if (this.registry.isPrefix(desc)) {
      this.timeoutId = setTimeout(() => this.resetSequence(), this.TIMEOUT_MS)
    } else {
      this.resetSequence()
    }
  }
}
