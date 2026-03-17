/**
 * Stemming, tokenization, and search term expansion.
 */

/**
 * Simple suffix-stripping stemmer.
 * Handles common English suffixes so "running" matches "run", "buttons" matches "button", etc.
 */
export function stem(word: string): string {
  if (word.length < 4) return word

  const collapseDoubledConsonant = (value: string) => {
    if (value.length < 3) return value
    const lastChar = value.at(-1)
    const prevChar = value.at(-2)
    if (!lastChar || !prevChar) return value
    if (lastChar !== prevChar) return value
    if ('aeiou'.includes(lastChar)) return value
    if (['l', 's', 'z'].includes(lastChar)) return value
    return value.slice(0, -1)
  }

  const suffixes: [string, string][] = [
    ['ational', 'ate'],
    ['tional', 'tion'],
    ['encies', 'ence'],
    ['ancies', 'ance'],
    ['izers', 'ize'],
    ['ising', 'ise'],
    ['izing', 'ize'],
    ['ating', 'ate'],
    ['ation', 'ate'],
    ['eness', 'e'],
    ['ments', 'ment'],
    ['ables', 'able'],
    ['ibles', 'ible'],
    ['ously', 'ous'],
    ['ings', ''],
    ['ally', 'al'],
    ['ment', 'ment'],
    ['ness', ''],
    ['able', 'able'],
    ['ible', 'ible'],
    ['ful', ''],
    ['ous', 'ous'],
    ['ive', 'ive'],
    ['ing', ''],
    ['ers', ''],
    ['ion', ''],
    ['ies', 'y'],
    ['ed', ''],
    ['er', ''],
    ['ly', ''],
    ['es', ''],
    ['s', ''],
  ]

  for (const [suffix, replacement] of suffixes) {
    if (word.endsWith(suffix)) {
      const base = collapseDoubledConsonant(word.slice(0, -suffix.length) + replacement)
      if (base.length >= 2) return base
    }
  }

  return word
}

const STOP_WORDS = new Set([
  'a',
  'an',
  'the',
  'and',
  'or',
  'but',
  'in',
  'on',
  'at',
  'to',
  'for',
  'of',
  'with',
  'by',
  'from',
  'is',
  'it',
  'as',
  'be',
  'was',
  'are',
  'were',
  'been',
  'being',
  'have',
  'has',
  'had',
  'do',
  'does',
  'did',
  'will',
  'would',
  'could',
  'should',
  'may',
  'might',
  'can',
  'shall',
  'not',
  'no',
  'nor',
  'so',
  'if',
  'then',
  'than',
  'that',
  'this',
  'these',
  'those',
  'each',
  'every',
  'all',
  'any',
  'few',
  'more',
  'most',
  'other',
  'some',
  'such',
  'only',
  'own',
  'same',
  'too',
  'very',
  'just',
  'about',
  'above',
  'after',
  'again',
  'also',
  'am',
  'because',
  'before',
  'between',
  'both',
  'during',
  'he',
  'her',
  'here',
  'him',
  'his',
  'how',
  'i',
  'into',
  'its',
  'me',
  'my',
  'now',
  'our',
  'out',
  'she',
  'them',
  'there',
  'they',
  'up',
  'us',
  'we',
  'what',
  'when',
  'where',
  'which',
  'who',
  'why',
  'you',
  'your',
])

/**
 * Tokenize text into lowercase terms, removing stop words and short tokens.
 * Also generates bigrams for phrase matching.
 */
export function tokenize(text: string): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 2 && !STOP_WORDS.has(w))
    .map((w) => stem(w))

  const bigrams: string[] = []
  for (let i = 0; i < words.length - 1; i++) {
    bigrams.push(`${words[i]}_${words[i + 1]}`)
  }

  return [...words, ...bigrams]
}

const TERM_SYNONYMS: Record<string, string[]> = {
  calendar: ['date', 'datepicker'],
  dropdown: ['select', 'combobox', 'menu'],
  modal: ['dialog', 'popup'],
  notification: ['toast'],
  picker: ['calendar', 'datepicker'],
  popup: ['dialog', 'modal'],
  select: ['dropdown', 'combobox'],
  toast: ['notification', 'sonner'],
}

const PHRASE_SYNONYMS: Record<string, string[]> = {
  'date picker': ['calendar', 'datepicker'],
  'data table': ['table', 'grid'],
}

export function expandSearchTerms(query: string): string[] {
  const normalized = query
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .trim()
  const expanded = new Set(normalized.split(/\s+/).filter(Boolean))

  for (const [phrase, synonyms] of Object.entries(PHRASE_SYNONYMS)) {
    if (!normalized.includes(phrase)) continue
    for (const synonym of synonyms) expanded.add(synonym)
  }

  for (const term of expanded) {
    const synonyms = TERM_SYNONYMS[term]
    if (!synonyms) continue
    for (const synonym of synonyms) expanded.add(synonym)
  }

  return [...expanded]
}

export function expandSearchText(query: string): string {
  return expandSearchTerms(query).join(' ')
}
