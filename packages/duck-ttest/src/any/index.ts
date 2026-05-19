/**
 * `true` iff `T` is exactly `any`. Uses the `0 extends (1 & T)` trick: only
 * `any` collapses that intersection, reliably distinguishing it from `unknown`.
 */
export type IsAny<T> = 0 extends 1 & T ? true : false

/** Branch on `IsAny<T>`. */
export type IfAny<T, Then, Else = T> = IsAny<T> extends true ? Then : Else

/** `true` iff `T` is exactly `never`. */
export type IsNever<T> = [T] extends [never] ? true : false

/** Branch on `IsNever<T>`. */
export type IfNever<T, Then, Else = T> = IsNever<T> extends true ? Then : Else

/** `true` iff `T` is exactly `unknown`. */
export type IsUnknown<T> = unknown extends T ? (IsAny<T> extends true ? false : true) : false

/** Branch on `IsUnknown<T>`. */
export type IfUnknown<T, Then, Else = T> = IsUnknown<T> extends true ? Then : Else

/** `true` iff `T` is `void`. Does not consider `undefined` to be `void`. */
export type IsVoid<T> = [T] extends [undefined] ? ([undefined] extends [T] ? true : false) : false

/** Inverse of `IsAny`. */
export type NotAny<T> = IsAny<T> extends true ? false : true
