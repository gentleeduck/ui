/**
 * Generate a URL-safe slug from Arabic (or mixed) text.
 *
 * @param text - The input string to slugify.
 * @returns A hyphen-separated slug containing only Arabic letters, Latin
 *          alphanumerics, and hyphens.
 */
export function generateArabicSlug(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\u0623-\u064Aa-zA-Z0-9-]/g, '')
}
