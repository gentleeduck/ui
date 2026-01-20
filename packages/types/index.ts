/**
 * **Utility Type: REQUEST_STATUS**
 * Represents the possible states of a request.
 *
 * @example
 * ```ts
 * let status: REQUEST_STATUS = 'loading'; // Valid
 * status = 'success'; // Valid
 * status = 'unknown'; // ❌ Error: Type '"unknown"' is not assignable to type 'REQUEST_STATUS'
 * ```
 */
export type REQUEST_STATUS = 'idle' | 'loading' | 'success' | 'error'

/**
 * **Utility Type: FilterValidKeys**
 * Filters only valid keys from a mask (`Mask`) that exist in the schema (`T`).
 *
 * - If a key exists in both `T` and `Mask`, it will be included.
 * - The resulting type maps valid keys to `true`.
 *
 * @template T - The reference schema type.
 * @template Mask - The type containing the mask of keys.
 *
 * @example
 * ```ts
 * type Schema = { name: string; age: number; active: boolean };
 * type Mask = { name: true; active: true; invalidKey: true };
 * type ValidKeys = FilterValidKeys<Schema, Mask>;
 * // Result:
 * // {
 * //   name: true;
 * //   active: true;
 * // }
 * ```
 */
export type FilterValidKeys<T, Mask> = {
  [K in keyof Mask & keyof T]: true
} & {}

/**
 * **Utility Type: Mutable**
 * Converts all properties of a type `T` from readonly to mutable.
 *
 * @template T - The type to make mutable.
 *
 * @example
 * ```ts
 * type ReadonlyUser = { readonly name: string; readonly age: number };
 * type MutableUser = Mutable<ReadonlyUser>;
 * // Result:
 * // {
 * //   name: string;
 * //   age: number;
 * // }
 * ```
 */
export type Mutable<T> = {
  -readonly [K in keyof T]: T[K]
} & {}

/**
 * **Utility Type: Immutable**
 * Converts all properties of a type `T` from mutable to readonly.
 *
 * @template T - The type to make immutable.
 *
 * @example
 * ```ts
 * type User = { name: string; age: number };
 * type ReadonlyUser = Immutable<User>;
 * // Result:
 * // {
 * //   readonly name: string;
 * //   readonly age: number;
 * // }
 * ```
 */
export type Immutable<T> = {
  readonly [K in keyof T]: T[K]
} & {}

/**
 * **Utility Type: Mapped**
 * A type that directly maps all keys of a given type `T` to themselves.
 *
 * @template T - The type to map.
 *
 * @example
 * ```ts
 * type User = { name: string; age: number };
 * type MappedUser = Mapped<User>;
 * // Result (Same as User):
 * // {
 * //   name: string;
 * //   age: number;
 * // }
 * ```
 */
export type Mapped<T> = {
  [K in keyof T]: T[K]
} & {}

/**
 * **Utility Type: MappedTo**
 *
 * A flexible utility type that maps the elements of an array or the keys of an object to a specified type `U`.
 *
 * - If `T` is an **array**, each **element** (not index) becomes a **key** (as a string), and its value is of type `U`.
 * - If `T` is an **object**, each **key** in `T` is assigned the type `U`.
 * - Supports **both mutable and readonly types** by ensuring `T` is converted to a mutable type before processing.
 * - Returns `never` if `T` is neither an array nor an object.
 *
 * @template T - The input type, which can be an array or an object.
 * @template U - The type to assign to each key.
 *
 * @example
 * Mapping an array to boolean
 * ```ts
 * type Fruits = ['apple', 'banana', 'cherry'];
 * type FruitMap = MappedTo<Fruits, boolean>;
 *
 * // Result:
 * // {
 * //   apple: boolean;
 * //   banana: boolean;
 * //   cherry: boolean;
 * // }
 * ```
 *
 * Mapping a number array to string
 * ```ts
 * type Numbers = [1, 2, 3];
 * type NumberMap = MappedTo<Numbers, string>;
 *
 * // Result:
 * // {
 * //   "1": string;
 * //   "2": string;
 * //   "3": string;
 * // }
 * ```
 *
 * Mapping a mixed array
 * ```ts
 * type Mixed = ['one', 2, 'three'];
 * type MixedMap = MappedTo<Mixed, number>;
 *
 * // Result:
 * // {
 * //   one: number;
 * //   "2": number;
 * //   three: number;
 * // }
 * ```
 *
 * Mapping an object
 * ```ts
 * type User = { id: number; name: string };
 * type UserMapped = MappedTo<User, string>;
 *
 * // Result:
 * // {
 * //   id: string;
 * //   name: string;
 * // }
 * ```
 */
export type MappedTo<T extends Record<string, number> | ReadonlyArray<string | number>, U> = T extends ReadonlyArray<
  infer Item
>
  ? { [K in `${Item & (string | number)}`]: U }
  : T extends object
    ? { [K in keyof Mutable<T>]: U }
    : never

type UUID = `${string}-${string}-${string}-${string}-${string}`

let uuid: UUID = '1234-5678-9012-3456-7890'

type Type<T extends string> = T extends string ? T : never

function callsomething<const T extends string>(v: Type<T>): T {
  console.log(v)
  return v
}

let hi = callsomething(uuid) // error

let rest = hi
