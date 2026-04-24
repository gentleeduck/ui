// 8. Function-level Utilities

/**
 * ReturnTypeSafe<F>
 * -----------------------------------------
 * Extracts the return type of a function type `F`.
 * If `F` is not a function, yields `never`.
 *
 * @template F - The function type to inspect.
 *
 * @returns The return type `R` if `F` is `(...args: any[]) => R`, else `never`.
 *
 * @example
 * type R1 = ReturnTypeSafe<() => string>;    // string
 * type R2 = ReturnTypeSafe<() => void>;      // void
 * type R3 = ReturnTypeSafe<number>;          // never
 */
export type ReturnTypeSafe<F> = F extends (...args: any[]) => infer R ? R : never

/**
 * ParametersSafe<F>
 * -----------------------------------------
 * Extracts the parameter types of a function type `F` as a tuple.
 * If `F` is not a function, yields `never`.
 *
 * @template F - The function type to inspect.
 *
 * @returns A tuple of argument types `P` if `F` is `(...args: P) => any`, else `never`.
 *
 * @example
 * type P1 = ParametersSafe<(x: number, y: string) => void>; // [number, string]
 * type P2 = ParametersSafe<string>;                           // never
 */
export type ParametersSafe<F> = F extends (...args: infer P) => any ? P : never

/**
 * Curried<F>
 * -----------------------------------------
 * Transforms a multi-argument function type `F` into its curried version.
 * Recursively breaks `F`'s parameters into nested single-arg functions.
 *
 * @template F - The original function type to curry.
 *
 * @example
 * type Fn = (a: number, b: string, c: boolean) => Date;
 * type C = Curried<Fn>;
 * // Results in: (a: number) => (b: string) => (c: boolean) => Date
 */
export type Curried<F> = F extends (...args: infer P) => infer R
  ? P extends [infer A, ...infer Rest]
    ? (arg: A) => Curried<(...args: Rest) => R>
    : R
  : never

/**
 * Transforms a synchronous function type into an asynchronous one that returns a `Promise`.
 *
 * This utility takes a function type `F`, extracts its parameters and return type,
 * and produces a new function type with the same parameters but whose return value is wrapped in a `Promise`.
 *
 * If `F` is not a function type, it evaluates to `never`.
 *
 * @template F The function type to transform.
 *
 * @example
 * type SyncFn = (a: number, b: string) => boolean;
 * type AsyncFn = Promisify<SyncFn>; // (a: number, b: string) => Promise<boolean>
 *
 * @example
 * type VoidFn = () => void;
 * type Promisified = Promisify<VoidFn>; // () => Promise<void>
 *
 * @example
 * type NotAFunction = number;
 * type Result = Promisify<NotAFunction>; // never
 */
export type Promisify<F> = F extends (...args: infer P) => infer R ? (...args: P) => Promise<R> : never
