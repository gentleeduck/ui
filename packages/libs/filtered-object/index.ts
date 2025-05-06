export const filteredObject = <T extends Record<string, unknown>>(keys: string[], obj: T): Partial<T> => {
  return Object.fromEntries(Object.entries(obj).filter(([key]) => !keys.includes(key))) as Partial<T>
}
