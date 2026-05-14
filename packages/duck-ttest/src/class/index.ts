/** Concrete class constructor producing instances of `T`. */
export type Class<T = unknown, Args extends unknown[] = any[]> = new (...args: Args) => T

/** Abstract class constructor producing instances of `T`. */
export type AbstractClass<T = unknown, Args extends unknown[] = any[]> = abstract new (...args: Args) => T

/** Instance type of constructor `C`, or `never`. */
export type InstanceTypeSafe<C> = C extends new (...args: any[]) => infer T ? T : never

/** Constructor parameter tuple of `C`, or `never`. */
export type ConstructorParametersSafe<C> = C extends new (...args: infer P) => any ? P : never

export type IsClass<T> = T extends new (...args: any[]) => any ? true : false
