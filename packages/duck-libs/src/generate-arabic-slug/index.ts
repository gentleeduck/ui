/** URL-safe slug; keeps Arabic (U+0600-06FF, U+0750-077F, U+FB50-FDFF, U+FE70-FEFF), Latin alnum, `-`. */
export function generateArabicSlug(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFFa-zA-Z0-9-]/g, '')
}
