export function enumToArray<T extends {}>(enumObj: T): T[keyof T][] {
  return Object.values(enumObj) as T[keyof T][]
}
