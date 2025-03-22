export function enumToArray<T extends {}>(enumObj: T): T[keyof T][] {
  return Object.keys(enumObj) as T[keyof T][]
}
