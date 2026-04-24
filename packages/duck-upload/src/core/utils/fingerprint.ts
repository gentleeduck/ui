import type { FileFingerprint } from '../contracts'

/**
 * Builds a lightweight fingerprint from a {@link File}.
 */
export function computeFingerprint(file: File): FileFingerprint {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
  }
}

/**
 * Compares two file fingerprints.
 */
export function fingerprintMatches(a: FileFingerprint, b: FileFingerprint): boolean {
  return a.name === b.name && a.size === b.size && a.lastModified === b.lastModified
}
