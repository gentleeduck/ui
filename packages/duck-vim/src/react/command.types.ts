import type { KeyHandler, Registry } from '../command'

/**
 * The shape of the value provided by `KeyContext`.
 */
export interface KeyContextValue {
  /**
   * The command registry instance, used to register key bindings.
   */
  registry: Registry

  /**
   * The key handler instance, responsible for listening to key events.
   */
  handler: KeyHandler
}
