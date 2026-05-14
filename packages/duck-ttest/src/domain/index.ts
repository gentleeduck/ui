type JSONPrimitive = string | number | boolean | null
type JSONObject = { [key: string]: JSONValue }
type JSONArray = JSONValue[]
type JSONValue = JSONPrimitive | JSONObject | JSONArray

/**
 * Recursively transform `T` into a JSON-safe shape:
 * strips functions and `Date`, and drops the keys `password` and `toJSON`.
 */
export type Jsonify<T> = T extends JSONPrimitive
  ? T
  : T extends Date | Function
    ? never
    : T extends Array<infer U>
      ? Jsonify<U>[]
      : T extends object
        ? {
            [K in keyof T as T[K] extends Function | Date
              ? never
              : K extends 'password' | 'toJSON'
                ? never
                : K]: Jsonify<T[K]>
          }
        : never

export type HexColor = `#${string & (number | string)}`
export type RgbColorString = `rgb(${number}, ${number}, ${number})`
export type UuidString = `${string}-${string}-${string}-${string}-${string}`
