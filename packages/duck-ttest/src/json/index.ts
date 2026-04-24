// JSON-serialization type utilities

/** Valid JSON primitive types. */
export type JSONPrimitive = string | number | boolean | null

/** Valid JSON object — a plain record of JSON values. */
export type JSONObject = { [key: string]: JSONValue }

/** Valid JSON array — a list of JSON values. */
export type JSONArray = JSONValue[]

/** Any valid JSON value. */
export type JSONValue = JSONPrimitive | JSONObject | JSONArray

/**
 * Recursively transforms `T` into a JSON-serializable version of itself.
 *
 * - Drops function and `Date` properties.
 * - Drops `toJSON` and other intentionally-sensitive keys (`password`).
 * - Recurses into arrays and objects.
 *
 * @example
 * type User = { id: number; name: string; password: string; createdAt: Date; toJSON(): string };
 * type Clean = Jsonify<User>; // { id: number; name: string }
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

/**
 * `true` if `T` is structurally assignable to `JSONValue`.
 */
export type IsJsonValue<T> = T extends JSONValue ? true : false

/**
 * A value that survives `JSON.stringify`/`JSON.parse` round-trip. Values with
 * a `toJSON()` method are allowed (the return type is required to be JSON).
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
