export type JSONPrimitive = string | number | boolean | null
export type JSONObject = { [key: string]: JSONValue }
export type JSONArray = JSONValue[]
export type JSONValue = JSONPrimitive | JSONObject | JSONArray

/**
 * Recursively coerce `T` into a JSON-serializable shape.
 * Drops functions and `Date`; drops `password` and `toJSON` keys; recurses.
 */
export type Jsonify<T> = T extends JSONPrimitive
  ? T
  : T extends Date | ((...args: any[]) => any)
    ? never
    : T extends Array<infer U>
      ? Jsonify<U>[]
      : T extends object
        ? {
            // biome-ignore lint/complexity/noBannedTypes: Function is intentional structural match
            [K in keyof T as T[K] extends Function | Date
              ? never
              : K extends 'password' | 'toJSON'
                ? never
                : K]: Jsonify<T[K]>
          }
        : never

/** `true` if `T` is structurally assignable to `JSONValue`. */
export type IsJsonValue<T> = T extends JSONValue ? true : false

/**
 * A value that survives `JSON.stringify`/`JSON.parse` round-trip.
 * Objects with `toJSON()` are accepted; the return type must itself be JSON.
 */
export type Jsonifiable<T = unknown> = T extends JSONPrimitive
  ? T
  : T extends { toJSON: () => infer J }
    ? J
    : T extends readonly (infer U)[]
      ? Jsonifiable<U>[]
      : T extends object
        ? // biome-ignore lint/complexity/noBannedTypes: structural Function check
          {
            [K in keyof T as T[K] extends Function ? never : K extends 'toJSON' ? never : K]: Jsonifiable<T[K]>
          }
        : never
