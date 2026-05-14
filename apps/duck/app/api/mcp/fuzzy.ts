/** Levenshtein edit distance. */
export function editDistance(a: string, b: string): number {
  if (a.length === 0) return b.length
  if (b.length === 0) return a.length

  const matrix: number[][] = []

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i]
  }
  const firstRow = matrix[0]
  if (!firstRow) return 0
  for (let j = 0; j <= a.length; j++) {
    firstRow[j] = j
  }

  for (let i = 1; i <= b.length; i++) {
    const row = matrix[i]
    const previousRow = matrix[i - 1]
    if (!row || !previousRow) continue

    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        row[j] = previousRow[j - 1] ?? 0
      } else {
        row[j] = Math.min((previousRow[j - 1] ?? 0) + 1, (row[j - 1] ?? 0) + 1, (previousRow[j] ?? 0) + 1)
      }
    }
  }

  return matrix[b.length]?.[a.length] ?? 0
}

export function fuzzyMatch(term: string, target: string): boolean {
  if (target.includes(term)) return true
  if (term.length < 3) return false
  const words = target.split(/[\s\-_/]+/)
  const maxDist = term.length <= 4 ? 1 : 2
  return words.some((word) => editDistance(term, word) <= maxDist)
}

/** Higher = better. 0 = no match. */
export function fuzzyScore(term: string, target: string): number {
  if (target.includes(term)) return 3
  if (term.length < 3) return 0
  const words = target.split(/[\s\-_/]+/)
  const maxDist = term.length <= 4 ? 1 : 2
  let bestDist = Infinity
  for (const word of words) {
    const dist = editDistance(term, word)
    if (dist < bestDist) bestDist = dist
  }
  if (bestDist <= maxDist) return maxDist - bestDist + 1
  return 0
}

export interface IWeightedSearchField {
  text: string
  exactWeight: number
  fuzzyWeight: number
  stemmedExactWeight?: number
}

export interface IWeightedBodyField {
  text: string
  exactCap: number
  stemmedExactCap?: number
}

export interface IScoreKeywordQueryOptions {
  terms: string[]
  stemmedTerms?: string[]
  fields: IWeightedSearchField[]
  body?: IWeightedBodyField
}

export function scoreKeywordQuery({ terms, stemmedTerms = terms, fields, body }: IScoreKeywordQueryOptions): number {
  let score = 0

  for (let index = 0; index < terms.length; index++) {
    const term = terms[index]
    if (!term) continue
    const stemmedTerm = stemmedTerms[index] ?? term

    for (const field of fields) {
      if (field.text.includes(term)) score += field.exactWeight
      score += fuzzyScore(term, field.text) * field.fuzzyWeight
    }

    if (body) {
      const bodyMatches = body.text.split(term).length - 1
      score += Math.min(bodyMatches, body.exactCap)
    }

    if (stemmedTerm === term) continue

    for (const field of fields) {
      const stemmedWeight = field.stemmedExactWeight
      if (stemmedWeight !== undefined && field.text.includes(stemmedTerm)) {
        score += stemmedWeight
      }
    }

    if (body?.stemmedExactCap !== undefined) {
      const stemmedBodyMatches = body.text.split(stemmedTerm).length - 1
      score += Math.min(stemmedBodyMatches, body.stemmedExactCap)
    }
  }

  return score
}
