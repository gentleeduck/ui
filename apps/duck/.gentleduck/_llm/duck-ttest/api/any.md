```ts
import type {
  IsAny, IfAny,
  IsNever, IfNever,
  IsUnknown, IfUnknown,
  IsVoid,
  NotAny,
} from '@gentleduck/ttest/any'
```

Discrimination between `any`, `unknown`, `never`, and `void` is one of the more error-prone corners of TypeScript. These helpers use stable tricks (intersection collapse, tuple wrapping) to give reliable boolean answers.

## IsAny

```ts
type IsAny<T> = 0 extends 1 & T ? true : false
```

`true` iff `T` is exactly `any`. Uses the `0 extends (1 & T)` trick: only `any` collapses that intersection.

```ts
type a = IsAny<any>       // true
type b = IsAny<unknown>   // false
type c = IsAny<string>    // false
```

## IfAny

```ts
type IfAny<T, Then, Else = T> = IsAny<T> extends true ? Then : Else
```

Branch on `IsAny<T>`. Useful for replacing leaked `any` with a safer fallback.

```ts
type Safe<T> = IfAny<T, unknown>  // strips any → unknown
```

## IsNever

```ts
type IsNever<T> = [T] extends [never] ? true : false
```

`true` iff `T` is exactly `never`. The tuple wrap disables distribution, which is required because `never` distributes to `never` in a naked conditional.

```ts
type a = IsNever<never>  // true
type b = IsNever<undefined>  // false
```

## IfNever

```ts
type IfNever<T, Then, Else = T> = IsNever<T> extends true ? Then : Else
```

Branch on `IsNever<T>`.

```ts
type Result<T> = IfNever<T, 'no result', T>
```

## IsUnknown

```ts
type IsUnknown<T> = unknown extends T ? (IsAny<T> extends true ? false : true) : false
```

`true` iff `T` is exactly `unknown`. The inner `IsAny` check is required because `unknown extends any` is also true.

```ts
type a = IsUnknown<unknown>  // true
type b = IsUnknown<any>      // false
```

## IfUnknown

```ts
type IfUnknown<T, Then, Else = T> = IsUnknown<T> extends true ? Then : Else
```

Branch on `IsUnknown<T>`.

## IsVoid

```ts
type IsVoid<T> = [T] extends [void] ? ([void] extends [T] ? true : false) : false
```

`true` iff `T` is `void`. Does not consider `undefined` to be `void`.

```ts
type a = IsVoid<void>       // true
type b = IsVoid<undefined>  // false
```

## NotAny

```ts
type NotAny<T> = IsAny<T> extends true ? false : true
```

Inverse of `IsAny`. Use as a constraint to refuse `any`:

```ts
function safeFn<T>(t: T & (NotAny<T> extends true ? unknown : never)): T { return t }
```