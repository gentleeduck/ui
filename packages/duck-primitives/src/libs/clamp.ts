/** @internal Constrains a value between a minimum and maximum (inclusive). */
export function clamp(value: number, [min, max]: [number, number]): number {
  return Math.min(max, Math.max(min, value))
}
