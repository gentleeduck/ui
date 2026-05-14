/** URL-safe slug retaining only Arabic letters, Latin alphanumerics, and hyphens. */
export function generateArabicSlug(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\u0623-\u064Aa-zA-Z0-9-]/g, '')
}
