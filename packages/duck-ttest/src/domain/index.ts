// 10. Domain-Specific Utilities

/**
 * Represents the basic JSON-serializable primitive types.
 */
type JSONPrimitive = string | number | boolean | null

/**
 * Represents a valid JSON object where values are also JSON-serializable.
 */
type JSONObject = { [key: string]: JSONValue }

/**
 * Represents a valid JSON array where elements are JSON-serializable.
 */
type JSONArray = JSONValue[]

/**
 * Represents any valid JSON value: primitive, object, or array.
 */
type JSONValue = JSONPrimitive | JSONObject | JSONArray

/**
 * Recursively transforms a type `T` into a JSON-safe version:
 *
 * - Removes functions and `Date` instances (not JSON-serializable).
 * - Excludes specific sensitive or irrelevant keys (e.g., `"password"`, `"toJSON"`).
 * - Converts arrays and nested objects recursively.
 *
 * @template T The input type to sanitize.
 * @returns A new type that only includes JSON-serializable and safe properties.
 *
 * @example
 * type RawUser = {
 *   id: number;
 *   name: string;
 *   password: string;
 *   createdAt: Date;
 *   toJSON(): string;
 * };
 *
 * type SanitizedUser = Jsonify<RawUser>; // => { id: number; name: string }
 */
export type Jsonify<T> = T extends JSONPrimitive
  ? T
  : T extends Date | Function
    ? never
    : T extends Array<infer U>
      ? Jsonify<U>[]
      : T extends object
        ? {
            [K in keyof T as // Exclude methods and Date instances
            T[K] extends Function | Date
              ? never
              : // Exclude sensitive keys manually
                K extends 'password' | 'toJSON'
                ? never
                : K]: Jsonify<T[K]>
          }
        : never

/**
 * `HexColor` matches any string starting with "#" followed by characters, commonly used in hex color codes.
 *
 * @example
 * const color: HexColor = "#ff00aa"
 */
export type HexColor = `#${string & (number | string)}`

/**
 * `RgbColorString` is a string literal type representing valid CSS rgb() format.
 *
 * @example
 * const color: RgbColorString = "rgb(255, 0, 128)"
 */
export type RgbColorString = `rgb(${number}, ${number}, ${number})`

/**
 * `UuidString` is a string literal type shaped like a UUID (version-agnostic).
 *
 * @example
 * const id: UuidString = "550e8400-e29b-41d4-a716-446655440000"
 */
export type UuidString = `${string}-${string}-${string}-${string}-${string}`
