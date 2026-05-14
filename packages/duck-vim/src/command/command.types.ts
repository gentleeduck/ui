export namespace Command {
  /** A command that can be triggered by a keyboard shortcut. */
  export interface ICommand {
    name: string
    description?: string
    execute: <T>(args?: T) => void | Promise<void>
  }

  /** Per-binding options applied when a key sequence matches. */
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

  /** Handle returned from {@link RegistryClass.register} for lifecycle control. */
  export interface IRegistrationHandle {
    unregister: () => void
    setEnabled: (enabled: boolean) => void
    isEnabled: () => boolean
    /** Reset the fired flag (for requireReset mode) */
    resetFired: () => void
  }

  /** @internal */
  export interface IRegistryEntry {
    command: ICommand
    options: IKeyBindOptions
    fired: boolean
  }

  /** @internal */
  export declare class RegistryClass {
    public register(key: string, command: ICommand): void
    public hasCommand(key: string): boolean
    public getCommand(key: string): ICommand | undefined
    /** True if `key` is a prefix of any registered chord (e.g. `g` for `g+d`). */
    public isPrefix(key: string): boolean
  }
}
