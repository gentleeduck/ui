/** Shallow copy of `obj` with `keys` removed. `K extends keyof T` rejects typos at compile time. */
export const filteredObject = <T extends Record<string, unknown>, K extends keyof T>(
  keys: readonly K[],
  obj: Readonly<T>,
): Omit<T, K> => {
  const omit = new Set<PropertyKey>(keys)
  return Object.fromEntries(Object.entries(obj).filter(([key]) => !omit.has(key))) as Omit<T, K>
}
