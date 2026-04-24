// Class / constructor type utilities

/**
 * Type of a concrete class constructor producing instances of `T`.
 *
 * @example
 * class Foo { hello() {} }
 * const Ctor: Class<Foo> = Foo
 * const f = new Ctor()
 */
export type Class<T = unknown, Args extends unknown[] = any[]> = new (...args: Args) => T

/**
 * Type of an abstract class constructor producing instances of `T`.
 */
export type AbstractClass<T = unknown, Args extends unknown[] = any[]> = abstract new (...args: Args) => T

/**
 * Safely extract the instance type of a constructor. Returns `never` if `C`
 * is not a constructor.
 */
export type InstanceTypeSafe<C> = C extends new (...args: any[]) => infer T ? T : never

/**
 * Safely extract the constructor parameter types of `C` as a tuple.
 */
export type ConstructorParametersSafe<C> = C extends new (...args: infer P) => any ? P : never

/**
 * `true` if `T` is a constructor type.
 */
export type IsClass<T> = T extends new (...args: any[]) => any ? true : false
