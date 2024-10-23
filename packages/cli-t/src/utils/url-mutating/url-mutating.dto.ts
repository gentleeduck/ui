import { z } from 'zod'

export const pathSchema = z.string().min(1, 'Path must be a non-empty string')

export const pathnameSchema = z
  .string()
  .refine((val) => /\/chat\/b\//.test(val), {
    message: 'The URL must contain /chat/b/ in the pathname'
  })
