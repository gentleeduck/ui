import type { Platform } from '../platform/platform.types'

export interface FormatOptions {
  /** Override platform detection */
  platform?: Platform
  /** Separator between parts. Default: '+' */
  separator?: string
}
