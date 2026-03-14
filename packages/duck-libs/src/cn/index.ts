import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export type { ClassValue }

/**
 * Merge Tailwind CSS class names using `clsx` and `tailwind-merge`.
 *
 * @param inputs - Class values to merge.
 * @returns The merged class string.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
