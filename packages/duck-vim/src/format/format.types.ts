import type { Platform } from '../platform/platform.types'

export namespace Format {
  export interface IFormatOptions {
    /** Override platform detection */
    platform?: Platform
    /** Separator between parts. Default: '+' */
    separator?: string
  }
}
