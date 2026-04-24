import type { UploadConfig } from '../../client'
import type { RejectReason } from '../../contracts'

export function validateFile<P extends string>(file: File, purpose: P, config: UploadConfig<P>): RejectReason | null {
  // Get rules for this purpose, skip validation if no rules defined
  const rules = config.validation?.[purpose]
  if (!rules) return null

  // Check for empty file
  if (file.size === 0) return { code: 'empty_file' }

  // Check maximum size limit
  if (rules.maxSizeBytes !== undefined && file.size > rules.maxSizeBytes) {
    return { code: 'file_too_large', maxBytes: rules.maxSizeBytes, size: file.size }
  }

  // Check minimum size limit (treated as empty for simplicity)
  if (rules.minSizeBytes !== undefined && file.size < rules.minSizeBytes) {
    return { code: 'empty_file' }
  }

  // Check file type and extension restrictions
  if (rules.allowedTypes || rules.allowedExtensions) {
    const allowed = rules.allowedTypes || []
    const extensions = rules.allowedExtensions || []

    // Extract file extension (lowercase, without dot)
    const fileExt = file.name.split('.').pop()?.toLowerCase()
    // File MIME type (may be empty string for unknown types)
    const mimeType = (file.type || '').toLowerCase()

    const typeMatches =
      allowed.length === 0
        ? false
        : allowed.some((type) => {
            if (type.endsWith('/*')) {
              // Wildcard match: 'image/*' matches 'image/jpeg', 'image/png', etc.
              const prefix = type.slice(0, -2).toLowerCase()
              return mimeType.startsWith(`${prefix}/`)
            }
            // Exact match
            return mimeType === type.toLowerCase()
          })

    const extMatches =
      !!fileExt && extensions.length > 0 ? extensions.some((ext) => ext.toLowerCase() === fileExt) : false

    // Determine if file passes type/extension check
    const hasTypeRules = allowed.length > 0
    const hasExtRules = extensions.length > 0

    // If both rules exist, allow either to match (OR logic)
    // If only one exists, require it to match
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

  // All checks passed
  return null
}

/**
 * Validates a batch of files, filtering them into 'valid' and 'rejected' lists.
 * Also enforces the `maxFiles` limit relative to the existing count.
 *
 * @param files Array of files to validate
 * @param purpose Upload purpose
 * @param existingCount Number of files already uploaded (to enforce maxFiles)
 */
