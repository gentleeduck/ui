import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export type { ClassValue }

/** Merge Tailwind class names via `clsx` + `tailwind-merge`. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
