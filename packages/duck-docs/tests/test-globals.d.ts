declare const describe: (name: string, run: () => void) => void
declare const it: (name: string, run: () => void) => void
declare const expect: (value: unknown) => {
  toBe: (expected: unknown) => void
  toBeDefined: () => void
  toContain: (expected: string) => void
  toEqual: (expected: unknown) => void
  toBeUndefined: () => void
}
