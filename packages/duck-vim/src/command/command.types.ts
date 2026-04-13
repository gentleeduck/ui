/**
 * Represents a command that can be triggered by a keyboard shortcut.
 */
export interface ICommand {
  /**
   * A human-readable name for the command.
   * Used for debugging, display in menus, etc.
   */
  name: string

  /**
   * Optional description of the command's purpose.
   * Useful for tooltips, help UIs, or logging.
   */
  description?: string

  /**
   * The function to execute when the command is triggered.
   * Can be synchronous or asynchronous.
   *
   * @template T - The optional type of argument passed to the command.
   * @param {T} [args] - Optional arguments used by the command.
   * @returns {void | Promise<void>} - Return can be synchronous or awaitable.
   */
  execute: <T>(args?: T) => void | Promise<void>
}

/**
 * Per-key-binding options that control behavior when the binding is matched.
 */
export interface IKeyBindOptions {
  /** Whether this key binding is active. Default: true */
  enabled?: boolean
  /** Call event.preventDefault() when matched. Default: false */
  preventDefault?: boolean
  /** Call event.stopPropagation() when matched. Default: false */
  stopPropagation?: boolean
  /** Skip execution if event target is an input element. Default: false */
  ignoreInputs?: boolean
  /** Event type to listen for. Default: 'keydown' */
  eventType?: 'keydown' | 'keyup'
  /** Fire only once per key press cycle. Default: false */
  requireReset?: boolean
  /** What to do when the key is already registered. Default: 'warn' */
  conflictBehavior?: 'warn' | 'error' | 'replace' | 'allow'
}

/**
 * A handle returned from registering a command.
 * Used for unregistering and controlling the binding.
 */
export interface IRegistrationHandle {
  /** Remove this binding from the registry */
  unregister: () => void
  /** Enable or disable this binding */
  setEnabled: (enabled: boolean) => void
  /** Check if the binding is currently enabled */
  isEnabled: () => boolean
  /** Reset the fired flag (for requireReset mode) */
  resetFired: () => void
}

/**
 * Internal storage entry for a registered command.
 * @internal
 */
export interface IRegistryEntry {
  command: ICommand
  options: IKeyBindOptions
  fired: boolean
}

/**
 * Interface for a keyboard command registry.
 *
 * Provides methods to register commands, check for command existence,
 * and resolve multi-key sequence prefixes.
 * @internal
 */
export declare class RegistryClass {
  /**
   * Registers a command to be triggered by a key sequence.
   *
   * @param {string} key - A key sequence like `'ctrl+k'` or `'g+d'`.
   * @param {ICommand} command - The command to associate with the key sequence.
   */
  public register(key: string, command: ICommand): void

  /**
   * Checks if a command is registered for the given key sequence.
   *
   * @param {string} key - The full key sequence.
   * @returns {boolean} `true` if a command exists.
   */
  public hasCommand(key: string): boolean

  /**
   * Retrieves the command registered to the given key sequence.
   *
   * @param {string} key - The full key sequence.
   * @returns {ICommand | undefined} The command, if found.
   */
  public getCommand(key: string): ICommand | undefined

  /**
   * Determines whether a given key sequence is a known prefix
   * of a longer registered command (e.g., `'g'` is a prefix of `'g+d'`).
   *
   * @param {string} key - A partial key sequence.
   * @returns {boolean} `true` if the key is a prefix.
   */
  public isPrefix(key: string): boolean
}
