import { Transform } from 'node:stream'

// ANSI escape sequences for arrow keys
const ARROW_UP = '\x1b[A'
const ARROW_DOWN = '\x1b[B'

/**
 * A stdin transform that converts vim j/k keys to arrow key escape sequences.
 * This allows @inkjs/ui Select/MultiSelect components to respond to vim keys
 * without any modifications to their source code.
 *
 * Disable via `enabled = false` when text input fields are active.
 */
export class VimStdin extends Transform {
  enabled = true
  isTTY: boolean
  setRawMode: (mode: boolean) => void

  constructor() {
    super()
    this.isTTY = process.stdin.isTTY ?? false
    this.setRawMode = (mode: boolean) => {
      if (process.stdin.setRawMode) {
        process.stdin.setRawMode(mode)
      }
    }
  }

  /**
   * Forward ref/unref calls to process.stdin.
   * Required by ink's stdin handling to manage the event loop --
   * unref() allows the process to exit when the TUI is idle.
   */
  ref() {
    const stdin = process.stdin as NodeJS.ReadStream & { ref?: () => void }
    if (typeof stdin.ref === 'function') {
      stdin.ref()
    }
    return this
  }

  unref() {
    const stdin = process.stdin as NodeJS.ReadStream & { unref?: () => void }
    if (typeof stdin.unref === 'function') {
      stdin.unref()
    }
    return this
  }

  override _transform(
    chunk: Buffer,
    _encoding: BufferEncoding,
    callback: (error: Error | null, data?: Buffer | string) => void,
  ) {
    if (this.enabled) {
      const str = chunk.toString()
      if (str === 'j') return callback(null, ARROW_DOWN)
      if (str === 'k') return callback(null, ARROW_UP)
    }
    callback(null, chunk)
  }

  /**
   * Cast this instance to the ReadStream type ink's render() expects.
   * VimStdin implements everything ink uses at runtime (isTTY, setRawMode,
   * ref, unref, readable stream), but extends Transform rather than
   * net.Socket, so the structural types do not fully overlap.
   */
  asInkStdin(): NodeJS.ReadStream {
    return this as unknown as NodeJS.ReadStream
  }
}
