/** Shallow copy of `obj` with the given `keys` removed. */
export const filteredObject = <T extends Record<string, unknown>>(
  keys: readonly string[],
  obj: Readonly<T>,
): Partial<T> => {
  return Object.fromEntries(Object.entries(obj).filter(([key]) => !keys.includes(key))) as Partial<T>
}
