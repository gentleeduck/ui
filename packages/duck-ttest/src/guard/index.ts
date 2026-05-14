// Compile-time predicates returning `true | false`.
// Compose with `If` / `IfExtends` from `~/conditional` to branch.

/** `true` if `T` is exactly `string` or a string-literal subtype. */
export type IsString<T> = [T] extends [string] ? true : false

/** `true` if `T` is exactly `number` or a numeric-literal subtype of `number`. */
export type IsNumber<T> = [T] extends [number] ? true : false

/** `true` if `T` is `boolean` or a boolean-literal subtype. */
export type IsBoolean<T> = [T] extends [boolean] ? true : false

/** `true` if `T` is `bigint` or a bigint-literal subtype. */
export type IsBigInt<T> = [T] extends [bigint] ? true : false

/** `true` if `T` is `symbol` (including `unique symbol`). */
export type IsSymbol<T> = [T] extends [symbol] ? true : false

/** `true` if `T` is a plain object (not array / not function / not primitive). */
export type IsObject<T> = T extends object
  ? T extends readonly unknown[]
    ? false
    : // biome-ignore lint/complexity/noBannedTypes: structural callable check
      T extends Function
      ? false
      : true
  : false

/** `true` if `T` is an array (mutable or readonly). */
export type IsArray<T> = T extends readonly unknown[] ? true : false

/** `true` if `T` is `readonly X[]` but not `X[]`. */
export type IsReadonlyArray<T> = T extends readonly unknown[] ? (T extends unknown[] ? false : true) : false

/** `true` for empty strings, arrays, and objects. */
export type IsEmpty<T> = T extends ''
  ? true
  : T extends readonly []
    ? true
    : T extends Record<PropertyKey, never>
      ? true
      : T extends object
        ? keyof T extends never
          ? true
          : false
        : false

/** `true` if `T` is the literal `true`. */
export type IsTrue<T> = [T] extends [true] ? ([true] extends [T] ? true : false) : false

/** `true` if `T` is the literal `false`. */
export type IsFalse<T> = [T] extends [false] ? ([false] extends [T] ? true : false) : false

/** `true` if `T` is `Date`. */
export type IsDate<T> = T extends Date ? true : false

/** `true` if `T` is `RegExp`. */
export type IsRegExp<T> = T extends RegExp ? true : false

/** `true` if `T` is assignable to `Error`. */
export type IsError<T> = T extends Error ? true : false

/** `true` if `T` is a `Map` of some shape. */
export type IsMap<T> = T extends Map<unknown, unknown> ? true : false

/** `true` if `T` is a `Set` of some shape. */
export type IsSet<T> = T extends Set<unknown> ? true : false

/** `true` if `T` is `PromiseLike<unknown>`. */
export type IsPromiseLike<T> = T extends PromiseLike<unknown> ? true : false

/** Plain `Record<PropertyKey, unknown>`: not array/function/Date/Map/Set/etc. */
export type IsRecord<T> = T extends object
  ? T extends readonly unknown[]
    ? false
    : // biome-ignore lint/complexity/noBannedTypes: callable structural check
      T extends Function
      ? false
      : T extends
            | Date
            | RegExp
            | Error
            | Map<unknown, unknown>
            | Set<unknown>
            | WeakMap<object, unknown>
            | WeakSet<object>
        ? false
        : true
  : false

/** `true` if `T` implements the sync iterator protocol. */
export type IsIterable<T> = T extends Iterable<unknown> ? true : false

/** `true` if `T` implements the async iterator protocol. */
export type IsAsyncIterable<T> = T extends AsyncIterable<unknown> ? true : false

/** `true` if `T` is a `WeakMap`. */
export type IsWeakMap<T> = T extends WeakMap<WeakKey, unknown> ? true : false

/** `true` if `T` is a `WeakSet`. */
export type IsWeakSet<T> = T extends WeakSet<WeakKey> ? true : false

/** `true` if `T` is an `ArrayBuffer`. */
export type IsArrayBuffer<T> = T extends ArrayBuffer ? true : false

/** `true` if `T` is a `DataView`. */
export type IsDataView<T> = T extends DataView ? true : false

/** `true` if `T` is one of the typed arrays (`Uint8Array`, `Float32Array`, …). */
export type IsTypedArray<T> = T extends
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array
  ? true
  : false

/** `true` if `T` is a fixed tuple (length is a literal, not `number`). */
export type IsFixedTuple<T> = T extends readonly unknown[] ? (number extends T['length'] ? false : true) : false
