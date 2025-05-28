/**
 * Represents a command that can be triggered by a keyboard shortcut.
 */
export interface Command {
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
 * Interface for a keyboard command registry.
 *
 * Provides methods to register commands, check for command existence,
 * and resolve multi-key sequence prefixes.
 */
export declare class RegistryClass {
  /**
   * Registers a command to be triggered by a key sequence.
   *
   * @param {string} key - A key sequence like `'ctrl+k'` or `'g+d'`.
   * @param {Command} command - The command to associate with the key sequence.
   */
  public register(key: string, command: Command): void

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
   * @returns {Command | undefined} The command, if found.
   */
  public getCommand(key: string): Command | undefined

  /**
   * Determines whether a given key sequence is a known prefix
   * of a longer registered command (e.g., `'g'` is a prefix of `'g+d'`).
   *
   * @param {string} key - A partial key sequence.
   * @returns {boolean} `true` if the key is a prefix.
   */
  public isPrefix(key: string): boolean
}
