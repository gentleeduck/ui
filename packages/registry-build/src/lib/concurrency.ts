/** Maps over values with a bounded concurrency limit, preserving input order in results. */
export async function mapConcurrently<TValue, TResult>(
  values: TValue[],
  concurrency: number,
  mapper: (value: TValue, index: number) => Promise<TResult>,
) {
  if (values.length === 0) {
    return [] as TResult[]
  }

  const limit = Math.max(1, concurrency)
  const results = new Array<TResult>(values.length)
  let nextIndex = 0

  async function runWorker() {
    while (nextIndex < values.length) {
      const currentIndex = nextIndex
      nextIndex += 1
      results[currentIndex] = await mapper(values[currentIndex] as TValue, currentIndex)
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, values.length) }, () => runWorker()))

  return results
}
