import type { KeyHandler, Registry } from '../command'
import type { Command } from '../command/command.types'
import type { SequenceManager } from '../sequence/sequence'

export namespace ReactCommand {
  /**
   * The shape of the value provided by `KeyContext`.
   */
  export interface IKeyContextValue {
    /**
     * The command registry instance, used to register key bindings.
     */
    registry: Registry

    /**
     * The key handler instance, responsible for listening to key events.
     */
    handler: KeyHandler

    /**
     * The sequence manager for multi-key sequences.
     */
    sequenceManager: SequenceManager

    /**
     * The timeout in ms for key sequences.
     */
    timeoutMs: number

    /**
     * Default key binding options applied to all registrations unless overridden.
     */
    defaultOptions?: Partial<Command.IKeyBindOptions>
  }
}
