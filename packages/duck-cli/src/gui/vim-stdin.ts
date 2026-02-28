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

  ref() {
    if (typeof (process.stdin as any).ref === 'function') {
      ;(process.stdin as any).ref()
    }
    return this
  }

  unref() {
    if (typeof (process.stdin as any).unref === 'function') {
      ;(process.stdin as any).unref()
    }
    return this
  }

  _transform(
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
}
