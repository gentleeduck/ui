export const ZOD_MESSAGES = [
  // Type errors
  'ZOD_EXPECTED_STRING',
  'ZOD_EXPECTED_NUMBER',
  'ZOD_EXPECTED_BOOLEAN',
  'ZOD_EXPECTED_DATE',
  'ZOD_EXPECTED_BIGINT',
  'ZOD_EXPECTED_OBJECT',
  'ZOD_EXPECTED_ARRAY',
  'ZOD_EXPECTED_ENUM',
  'ZOD_EXPECTED_FUNCTION',
  'ZOD_EXPECTED_INSTANCE',
  'ZOD_EXPECTED_JSON',
  'ZOD_EXPECTED_BUFFER',
  'ZOD_EXPECTED_UNDEFINED',
  'ZOD_EXPECTED_NULL',
  'ZOD_EXPECTED_NAN',
  'ZOD_EXPECTED_SYMBOL',
  'ZOD_EXPECTED_REGEX',
  'ZOD_EXPECTED_DATE_TIME',
  'ZOD_EXPECTED_UUID',
  'ZOD_EXPECTED_URL',
  'ZOD_EXPECTED_EMAIL',

  // Length constraints
  'ZOD_TOO_SHORT',
  'ZOD_TOO_LONG',
  'ZOD_TOO_FEW',
  'ZOD_TOO_MANY',

  // Value constraints
  'ZOD_INVALID_EMAIL',
  'ZOD_INVALID_URL',
  'ZOD_INVALID_UUID',
  'ZOD_INVALID_DATE',
  'ZOD_INVALID_STRING',
  'ZOD_INVALID_NUMBER',
  'ZOD_INVALID_ENUM_VALUE',
  'ZOD_INVALID_LITERAL',
  'ZOD_INVALID_ARGUMENTS',
  'ZOD_INVALID_RETURN_TYPE',

  // Custom & parsing
  'ZOD_INVALID',
  'ZOD_REQUIRED',
  'ZOD_FAILED_TO_PARSE',
  'ZOD_UNRECOGNIZED_KEYS',
  'ZOD_CUSTOM',

  // Coercion errors
  'ZOD_COERCE_FAILED',
  'ZOD_COERCE_DATE_FAILED',

  // Refinement/transform errors
  'ZOD_REFINEMENT_FAILED',
  'ZOD_TRANSFORM_FAILED',

  // Union/intersection
  'ZOD_INVALID_UNION',
  'ZOD_INVALID_INTERSECTION',

  // Array/object index
  'ZOD_INVALID_TYPE_AT_INDEX',
  'ZOD_INVALID_ELEMENT',

  // Effects
  'ZOD_INVALID_EFFECT',
] as const

/**
 * @duckgen messages
 */
export const ZodMessages = Object.fromEntries(ZOD_MESSAGES.map((key) => [key, 400])) as Record<
  (typeof ZOD_MESSAGES)[number],
  400
>

/**
 * Helper to create a Zod error map input with a custom message.
 *
 * @param message - The error message key.
 * @returns An object compatible with Zod's error map parameters.
 *
 * @example
 * ```ts
 * const schema = z.string(zodErr('ZOD_EXPECTED_STRING'))
 * ```
 */
export const zodErr = <T extends (typeof ZOD_MESSAGES)[number]>(message: T) => ({ message })
