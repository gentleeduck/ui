import type { Platform } from '../platform/platform.types'

export interface IFormatOptions {
  /** Override platform detection */
  platform?: Platform
  /** Separator between parts. Default: '+' */
  separator?: string
}
