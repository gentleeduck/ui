// 1. Assertion Helpers

/**
 * Asserts that the provided type `T` is `true`.
 * If `T` is not `true`, a custom compile-time error message `Msg` will be shown.
 *
 * @template T - A boolean type to assert as `true`.
 * @template Msg - A string literal used as the custom error message when the assertion fails.
 *
 * @example
 * type Test1 = AssertTrue<true, "Should be true">; // ✅ Passes
 * type Test2 = AssertTrue<false, "This will fail">; // ❌ Error: "This will fail"
 */
export type AssertTrue<T extends true, Msg extends string> = T extends true ? true : neverError<Msg>

/**
 * Utility type that forces a compile-time error using a custom message.
 * It intersects the provided message with `never` to produce a type error.
 *
 * @template Msg - The error message to display when a type check fails.
 */
type neverError<Msg extends string> = Msg & never

/**
 * Asserts that the provided type `T` is `false`.
 * If `T` is not `false`, a custom compile-time error message `Msg` will be shown.
 *
 * @template T - A boolean type to assert as `false`.
 * @template Msg - A string literal used as the custom error message when the assertion fails.
 *
 * @example
 * type Test1 = AssertFalse<false, "Should be false">; // ✅ Passes
 * type Test2 = AssertFalse<true, "This will fail">;   // ❌ Error: "This will fail"
 */
export type AssertFalse<T extends false, Msg extends string> = T extends false ? true : neverError<Msg>
