# 🦆 `ttest`: TypeScript Unit Tests for Your Types

> *Because types are logic, and logic deserves tests.*

---

## Are We Really Testing Types?

Yes. And if you’re building anything remotely advanced in TypeScript, you *should be*.

If your project includes:

* utility types like `Flatten<T>`
* inference helpers like `InferSchema<T>`
* DSLs, schemas, or compile-time engines

…then your types are doing real work. That means real bugs. And real bugs deserve real tests, **type-level tests**.

Enter `ttest`.

---

## Why Type-Level Tests?

Here’s the classic trap.

You write:

```ts
type Flatten<T> = T extends any[] ? T[number] : T;
```

Later, you refactor:

```ts
type Flatten<T> = T extends readonly (infer U)[] ? U : T;
```

Looks clean. But your entire system of array flattening silently breaks, because `number[]` is mutable, and `readonly number[]` isn’t. And unless you're asserting behavior via types, **you’ll never notice**.

TypeScript won’t throw at runtime. It won’t warn you in CI. There’s no red squiggly line until you’re three levels deep into a refactor.

This is why type tests matter.

---

## What `ttest` Gives You

```ts
import { AssertTrue, Equal } from '@gentleduck/ttest';

type X1 = XOR<{ a: number; common: string }, { b: boolean; common: string }>
// expected: { a: number } | { b: boolean }
type Test_X1 = AssertTrue<
  Equal<X1, { a: number } | { b: boolean }>,
  'Expected XOR to produce mutually exclusive union of properties'
>;
```

All of these:

* have **zero runtime**
* run inside your regular `.ts` files
* fail at **compile time**, not in the browser or test runner

---

## Built-in Type Suites (SQL, JSON, and More)

`ttest` includes **ready-to-use type suites** to help you model and validate structured formats like:

* SQL schemas (`InferSchema<T>`)
* JSON types and paths (`InferJson<T>`)
* Object transformations (`Merge`, `Flatten`, `DeepPick`, etc.)
* Tokenizers and DSL-style strings

These are:

* Fully type-only, **zero bundle size**
* Deeply composable
* Designed for high-performance developer experience
* Crafted to utilize the TypeScript compiler as a static type engine

So instead of rewriting logic for every schema or format, you can **plug into powerful, pre-built helpers** and test them confidently with type assertions.

---

## Real-World Use Case

Let’s say you’re merging two config types:

```ts
type DefaultConfig = { host: string; port: number };
type UserConfig = { port?: number; useSsl?: boolean };
type FinalConfig = Merge<DefaultConfig, UserConfig>;
```

And you expect the result to be:

```ts
type Expected = { host: string; port?: number; useSsl?: boolean };
```

You can assert this directly:

```ts
type Test_FinalConfig = AssertTrue<
  Equal<FinalConfig, Expected>,
  'Expected Merge to combine DefaultConfig with optional overrides from UserConfig'
>;
```

Test passes if the structure is correct, fails loudly if not.

---

## `ttest` vs `tsd` vs `expect-type`

| Feature                            | `ttest` | `tsd` | `expect-type` |
| ---------------------------------- | ------------ | ----- | ------------- |
| Compile-time only (no CLI)         | ✅            | ❌     | ✅             |
| Works in `.ts` or `.test.ts` files | ✅            | ❌     | ✅             |
| Custom assertion messages          | ✅            | ❌     | ❌             |
| Tailored for type-heavy libs       | ✅            | ❌     | ❌             |
| Built-in type engines (SQL, etc.)  | ✅            | ❌     | ❌             |
| Dependency-free                    | ✅            | ❌     | ✅             |

It’s **not a replacement** for value-level tests. It’s a new layer: **compile-time contracts for your types**.

---

## Example from `duck-schema`

Let’s say you infer SQL types:

```ts
type Schema = InferSchema<"CREATE TABLE users (id INT PRIMARY KEY, email TEXT NOT NULL)">;

type Test_Column = AssertTrue<
  Equal<Schema['email'], string>,
  'Expected SQL "TEXT" to infer as string'
>;
```

If a refactor changes how `TEXT` maps to `string`, this test catches it **instantly**, without needing to run a single JS file.

---

## Your Types Are a Compiler

Modern TypeScript is a full-fledged **compiler extension platform**.

If you're building:

* typed APIs
* schema transformers
* type-safe runtime validators
* codegen from types

Then you’re writing a compiler.

And **your compiler needs tests**.

---

## TL;DR

* `ttest` is a type-level testing utility.
* It tests your types like logic, because they *are* logic.
* Includes built-in helpers for **SQL, JSON, and DSL inference**.
* Zero runtime, zero CLI, zero config, zero bundle size.
* Catches subtle inference bugs early.
* Use it anywhere you’d use generics, inference, or type transformation.

---

## Get Started

```bash
bun add -d @gentleduck/ttest
```

Then write some type assertions in your `.ts` files. If they compile, your types are good.

If not, that’s a feature.

---

## 👋 Final Thoughts

If you're writing types like:

```ts
type Flatten<T> = T extends any[] ? T[number] : T;
type Merge<A, B> = { ... };
type InferSchema<T extends string> = { ... };
```

Then you’re writing logic.

And logic needs tests.

Use `ttest`.

Because TypeScript is your compiler now, and your compiler needs a test suite.
