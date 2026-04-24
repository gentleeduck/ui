// Any / Never / Unknown / Void predicates and branches

/**
 * `true` if `T` is exactly `any`, `false` otherwise.
 *
 * Uses the classic `0 extends (1 & T)` trick — only `any` lets that intersection
 * collapse to `any`, so the check reliably discriminates `any` from everything else.
 *
 * @example
 * type A = IsAny<any>         // true
 * type B = IsAny<unknown>     // false
 * type C = IsAny<never>       // false
 * type D = IsAny<string>      // false
 */
export type IsAny<T> = 0 extends 1 & T ? true : false

/**
 * Conditional branch on `IsAny<T>`. Returns `Then` if `T` is `any`, else `Else`.
 */
export type IfAny<T, Then, Else = T> = IsAny<T> extends true ? Then : Else

/**
 * `true` if `T` is exactly `never`, `false` otherwise.
 *
 * @example
 * type A = IsNever<never>   // true
 * type B = IsNever<any>     // false
 * type C = IsNever<string>  // false
 */
export type IsNever<T> = [T] extends [never] ? true : false

/**
 * Conditional branch on `IsNever<T>`. Returns `Then` if `T` is `never`, else `Else`.
 */
export type IfNever<T, Then, Else = T> = IsNever<T> extends true ? Then : Else

/**
 * `true` if `T` is exactly `unknown`.
 *
 * Works by checking that `T` is assignable from `unknown` but is not `any`.
 *
 * @example
 * type A = IsUnknown<unknown>   // true
 * type B = IsUnknown<any>       // false
 * type C = IsUnknown<string>    // false
 */
export type IsUnknown<T> = unknown extends T ? (IsAny<T> extends true ? false : true) : false

/**
 * Conditional branch on `IsUnknown<T>`. Returns `Then` if `T` is `unknown`, else `Else`.
 */
export type IfUnknown<T, Then, Else = T> = IsUnknown<T> extends true ? Then : Else

/**
 * `true` if `T` is `void`. Does not consider `undefined` to be `void`.
 *
 * @example
 * type A = IsVoid<void>       // true
 * type B = IsVoid<undefined>  // false
 */
export type IsVoid<T> = [T] extends [void] ? ([void] extends [T] ? true : false) : false

/**
 * `true` if `T` is not `any`, `false` otherwise. Inverse of `IsAny`.
 */
export type NotAny<T> = IsAny<T> extends true ? false : true
