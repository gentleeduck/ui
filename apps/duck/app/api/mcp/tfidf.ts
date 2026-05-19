/** Sublinear TF (1 + log(count)) so long docs don't dominate. */
export function computeTf(tokens: string[]): Map<string, number> {
  const counts = new Map<string, number>()
  for (const token of tokens) {
    counts.set(token, (counts.get(token) ?? 0) + 1)
  }
  const tf = new Map<string, number>()
  for (const [term, count] of counts) {
    tf.set(term, 1 + Math.log(count))
  }
  return tf
}

/** IDF = log(N / df). */
export function computeIdf(tfMaps: Map<string, number>[], totalDocs: number): Map<string, number> {
  if (totalDocs === 0) return new Map()
  const df = new Map<string, number>()
  for (const tfMap of tfMaps) {
    for (const term of tfMap.keys()) {
      df.set(term, (df.get(term) ?? 0) + 1)
    }
  }
  const idf = new Map<string, number>()
  for (const [term, freq] of df) {
    idf.set(term, Math.log(totalDocs / freq))
  }
  return idf
}

/** Unit-length TF-IDF vector — cosineSimilarity assumes pre-normalized input. */
export function computeTfidfVector(tf: Map<string, number>, idf: Map<string, number>): Map<string, number> {
  const vector = new Map<string, number>()
  let magnitude = 0

  for (const [term, tfVal] of tf) {
    const idfVal = idf.get(term) ?? 0
    const tfidf = tfVal * idfVal
    if (tfidf > 0) {
      vector.set(term, tfidf)
      magnitude += tfidf * tfidf
    }
  }

  magnitude = Math.sqrt(magnitude)
  if (magnitude > 0) {
    for (const [term, val] of vector) {
      vector.set(term, val / magnitude)
    }
  }

  return vector
}

/** Dot product; inputs must be pre-normalized (see computeTfidfVector). */
export function cosineSimilarity(a: Map<string, number>, b: Map<string, number>): number {
  let dot = 0
  const [smaller, larger] = a.size <= b.size ? [a, b] : [b, a]
  for (const [term, val] of smaller) {
    const otherVal = larger.get(term)
    if (otherVal !== undefined) {
      dot += val * otherVal
    }
  }
  return dot
}
