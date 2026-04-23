export function throwError<T extends string>(string: T, cause?: string): Error {
  throw new Error(string, {
    cause,
  })
}
