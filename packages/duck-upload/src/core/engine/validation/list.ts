import type { UploadConfig } from '../../client'
import type { RejectReason } from '../../contracts'
import { validateFile } from './file'

export function validateFileList<P extends string>(
  files: File[],
  purpose: P,
  config: UploadConfig<P>,
  existingCount: number = 0,
): { valid: File[]; rejected: Array<{ file: File; reason: RejectReason }> } {
  const rules = config.validation?.[purpose]
  const valid: File[] = []
  const rejected: Array<{ file: File; reason: RejectReason }> = []

  // Calculate remaining slots based on maxFiles limit
  const maxFiles = rules?.maxFiles
  let remaining = maxFiles !== undefined ? Math.max(0, maxFiles - existingCount) : Number.POSITIVE_INFINITY

  for (const file of files) {
    // Check if we've reached the file limit
    if (remaining <= 0) {
      const limit = maxFiles ?? 0
      rejected.push({ file, reason: { code: 'too_many_files', max: limit } })
      continue
    }

    // Run individual file validation
    const reason = validateFile(file, purpose, config)
    if (reason) {
      rejected.push({ file, reason })
      continue
    }

    // File is valid, add to list and decrement remaining slots
    valid.push(file)
    remaining -= 1
  }

  return { valid, rejected }
}

/**
 * Validates an intent object from the backend.
 * Ensures required fields are present and URLs are valid.
 *
 * @param intent - Intent object to validate
 * @param strategy - Expected strategy type (from the intent itself)
 *
 * @returns {Error | null} Error if validation fails, null if valid
 */
