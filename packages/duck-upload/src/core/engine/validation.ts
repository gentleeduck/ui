import type { Client } from '../client'
import type { Contracts } from '../contracts'
import { isRecord } from '../utils/guards'

// ============================================================================
// validateFile -- single-file rule check
// ============================================================================

/**
 * Validate one file against `config.validation[purpose]` rules.
 *
 * Empty files are always rejected.
 *
 * @param file File to validate.
 * @param purpose Purpose key used to look up rules.
 * @param config Resolved upload config.
 * @template P Purpose discriminator string.
 * @returns `null` when valid, otherwise a {@link Contracts.RejectReason}.
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function validateFile<P extends string>(
  file: File,
  purpose: P,
  config: Client.IUploadConfig<P>,
): Contracts.RejectReason | null {
  if (file.size === 0) return { code: 'empty_file' }

  const rules = config.validation?.[purpose]
  if (!rules) return null

  if (rules.maxSizeBytes !== undefined && file.size > rules.maxSizeBytes) {
    return { code: 'file_too_large', maxBytes: rules.maxSizeBytes, size: file.size }
  }

  if (rules.minSizeBytes !== undefined && file.size < rules.minSizeBytes) {
    return { code: 'empty_file' }
  }

  if (rules.allowedTypes || rules.allowedExtensions) {
    const allowed = rules.allowedTypes || []
    const extensions = rules.allowedExtensions || []

    const fileExt = file.name.split('.').pop()?.toLowerCase()
    const mimeType = (file.type || '').toLowerCase()

    const typeMatches =
      allowed.length === 0
        ? false
        : allowed.some((type) => {
            if (type.endsWith('/*')) {
              const prefix = type.slice(0, -2).toLowerCase()
              return mimeType.startsWith(`${prefix}/`)
            }
            return mimeType === type.toLowerCase()
          })

    const extMatches =
      fileExt && extensions.length > 0 ? extensions.some((ext) => ext.toLowerCase() === fileExt) : false

    const hasTypeRules = allowed.length > 0
    const hasExtRules = extensions.length > 0

    // When both rule kinds are present, either match is enough; otherwise the
    // present one must match.
    const ok = (hasTypeRules ? typeMatches : true) && (hasExtRules ? extMatches : true)
    const okEither = hasTypeRules && hasExtRules ? typeMatches || extMatches : ok

    if (!okEither) {
      return {
        code: 'type_not_allowed',
        allowed: [...allowed, ...extensions],
        got: file.type || file.name,
      }
    }
  }

  return null
}

// ============================================================================
// validateFileList -- batch validation with maxFiles cap
// ============================================================================

/**
 * Validate a batch of files and split into accepted vs rejected.
 *
 * Enforces `maxFiles` against the existing count plus the running additions
 * so a single `addFiles` call cannot overshoot.
 *
 * @param files Files to validate.
 * @param purpose Purpose key used to look up rules.
 * @param config Resolved upload config.
 * @param existingCount Items already in the store for this purpose.
 * @template P Purpose discriminator string.
 * @returns Object with `valid` files and `rejected` files plus reasons.
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function validateFileList<P extends string>(
  files: File[],
  purpose: P,
  config: Client.IUploadConfig<P>,
  existingCount: number = 0,
): { valid: File[]; rejected: Array<{ file: File; reason: Contracts.RejectReason }> } {
  const rules = config.validation?.[purpose]
  const valid: File[] = []
  const rejected: Array<{ file: File; reason: Contracts.RejectReason }> = []

  const maxFiles = rules?.maxFiles
  let remaining = maxFiles !== undefined ? Math.max(0, maxFiles - existingCount) : Number.POSITIVE_INFINITY

  for (const file of files) {
    if (remaining <= 0) {
      const limit = maxFiles ?? 0
      rejected.push({ file, reason: { code: 'too_many_files', max: limit } })
      continue
    }

    const reason = validateFile(file, purpose, config)
    if (reason) {
      rejected.push({ file, reason })
      continue
    }

    valid.push(file)
    remaining -= 1
  }

  return { valid, rejected }
}

// ============================================================================
// validateIntent -- backend-intent shape check
// ============================================================================

/**
 * Validate an intent payload returned by the backend before the engine
 * commits to it.
 *
 * Rejects malformed shapes, protocol-foreign URLs, and cross-field
 * inconsistencies (e.g. `partCount * partSize` cannot cover the file).
 *
 * @param intent Raw intent value from `createIntent`.
 * @param strategy Expected `strategy` discriminator.
 * @param fileSize File byte length; enables multipart cross-checks.
 * @returns `Error` describing the failure, or `null` if valid.
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function validateIntent(intent: unknown, strategy: string, fileSize?: number): Error | null {
  if (!isRecord(intent)) {
    return new Error('Invalid intent: must be an object')
  }

  if (typeof intent.strategy !== 'string') {
    return new Error('Invalid intent: missing or invalid strategy field')
  }

  if (intent.strategy !== strategy) {
    return new Error(`Invalid intent: strategy mismatch (expected ${strategy}, got ${intent.strategy})`)
  }

  if (typeof intent.fileId !== 'string' || !intent.fileId) {
    return new Error('Invalid intent: missing or invalid fileId')
  }

  if (strategy === 'post') {
    if (typeof intent.url !== 'string' || !intent.url) {
      return new Error('Invalid post intent: missing or invalid url')
    }
    try {
      const url = new URL(intent.url)
      if (!['http:', 'https:'].includes(url.protocol)) {
        return new Error('Invalid post intent: url must use http or https protocol')
      }
    } catch {
      return new Error('Invalid post intent: url is not a valid URL')
    }
    if (!intent.fields || typeof intent.fields !== 'object') {
      return new Error('Invalid post intent: missing or invalid fields')
    }
  } else if (strategy === 'multipart') {
    if (typeof intent.uploadId !== 'string' || !intent.uploadId) {
      return new Error('Invalid multipart intent: missing or invalid uploadId')
    }
    if (typeof intent.partSize !== 'number' || intent.partSize <= 0) {
      return new Error('Invalid multipart intent: missing or invalid partSize')
    }
    if ('partCount' in intent && intent.partCount !== undefined) {
      if (typeof intent.partCount !== 'number' || !Number.isFinite(intent.partCount) || intent.partCount <= 0) {
        return new Error('Invalid multipart intent: partCount must be a positive number')
      }
    }
    if (typeof fileSize === 'number' && typeof intent.partCount === 'number' && intent.partCount > 0) {
      const partSize = intent.partSize
      const partCount = intent.partCount
      const maxBytes = partCount * partSize
      const minBytes = (partCount - 1) * partSize
      if (maxBytes < fileSize) {
        return new Error(
          `Invalid multipart intent: partCount * partSize (${maxBytes}) is smaller than file size (${fileSize})`,
        )
      }
      if (minBytes >= fileSize && partCount > 1) {
        return new Error(
          `Invalid multipart intent: partCount (${partCount}) exceeds what file size (${fileSize}) needs at partSize ${partSize}`,
        )
      }
    }
    if ('parts' in intent && intent.parts !== undefined) {
      if (!Array.isArray(intent.parts)) {
        return new Error('Invalid multipart intent: parts must be an array if provided')
      }
    }
  }

  return null
}
