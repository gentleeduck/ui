}>
  TypeScript type-level test framework. Assertions run at compile time and emit no runtime JavaScript.

***

## What is this?

`ttest` is a library for writing type-level tests in TypeScript.

Use it to check assignability, equality, and inference on the types you design. When a test fails, TypeScript surfaces it at build time.

***

## Features

* Fully erased at compile time. No emitted JS.
* Assertions for assignability, equality, and inference.
* Fails type-checking with readable messages.
* Works with `tsc`, `tsd`, or `vitest` + `@ts-expect-error`.
* Designed for schema builders, type-safe APIs, and ORMs.

***

## Installation

```bash
npm install --save-dev @gentleduck/ttest
```

***

## Quick Start

```ts
import { AssertTrue, Equal } from "@gentleduck/ttest";

type Schema = InferSchema<
  "CREATE TABLE users (id INT PRIMARY KEY, email TEXT NOT NULL)"
>;

type Test_Column = AssertTrue<
  Equal<Schema["email"], string>,
  'Expected SQL "TEXT" to infer as string'
>;
```

***

## Why Not `tsd` or `expect-type`?

`@gentleduck/ttest` draws from both but targets framework authors and type-heavy codebases:

* Grouped test API.
* Inference testing helpers.
* Direct integration with custom toolchains.
* First-class within the gentleduck ecosystem.

***

## Advanced Patterns

```ts
import { AssertTrue, Equal } from "@gentleduck/ttest";
import { XOR } from "@gentleduck/utils";

type X1 = XOR<
  { a: number; common: string },
  { b: boolean; common: string }
>;

// expected: { a: number } | { b: boolean }
type Test_X1 = AssertTrue<
  Equal<X1, { a: number } | { b: boolean }>,
  "Expected XOR to produce mutually exclusive union of properties"
>;
```

***

## Philosophy

}>
  Runtime tests check behavior. Type tests check contracts.

In a schema system, compiler, or framework, types are the architecture. `@gentleduck/ttest` closes the feedback loop between types and logic.