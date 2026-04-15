/**
 * Return a shallow copy of `obj` with the specified `keys` removed.
 *
 * @param keys - Property names to exclude.
 * @param obj  - The source object.
 * @returns A new object without the excluded keys.
 */
export const filteredObject = <T extends Record<string, unknown>>(
  keys: readonly string[],
  obj: Readonly<T>,
): Partial<T> => {
  return Object.fromEntries(Object.entries(obj).filter(([key]) => !keys.includes(key))) as Partial<T>
}
