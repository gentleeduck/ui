}>
  Assertions and utilities live entirely in the type system. Nothing is emitted to JavaScript.

## What is duck-ttest?

`@gentleduck/ttest` is two things in one package:

1. A small, focused **type-level test framework** — `AssertTrue`, `AssertFalse`, `Equal`, and friends. When a test fails, the compiler surfaces a readable message at the failure site.
2. A **library of type utilities** organized into 37 narrow modules — `any`, `aria`, `assert`, `async`, `bit`, `boolean`, `brand`, `class`, `conditional`, `css`, `date`, `discriminated`, `emitter`, `equality`, `extraction`, `format`, `fp`, `fs`, `function`, `geometry`, `guard`, `http`, `json`, `literal`, `locale`, `number`, `object`, `pattern`, `predicates`, `primitive`, `promise`, `result`, `router`, `sql`, `template`, `tuple`, `union`.

Each utility is a `type`, so the entire package is erased at compile time. There is no runtime, no bundle bytes, and nothing to ship.

***

## Why duck-ttest?

The TypeScript ecosystem already has `tsd`, `expect-type`, and `type-fest`. duck-ttest covers ground each of them touches separately:

* `tsd` runs assertions through a CLI on top of `tsc`. duck-ttest assertions are types that fail your normal type-check — no extra runner needed.
* `expect-type` is fluent and ergonomic, but stops at the test framework boundary. duck-ttest ships the framework **and** the utilities that the framework asserts against.
* `type-fest` is a beloved utility library, but has no test side. duck-ttest gives you both: write a utility and assert it the same way the test suite does.

If you build schema generators, ORMs, validation libraries, or type-heavy SDKs, you typically need: a way to declare invariants, a way to check them, and a way to ship them with zero runtime cost. That is what duck-ttest is.

***

## Features

| Feature | Description |
| --- | --- |
| **Compile-time only** | `package.json` ships `src/` only. Every export is a `type` — nothing reaches the JS output of consumers. |
| **37 utility modules** | Sub-path imports such as `@gentleduck/ttest/object`, `@gentleduck/ttest/sql`, `@gentleduck/ttest/router`. Tree-shake by importing only what you need. |
| **Assertions** | `AssertTrue

There is no runtime layer in this diagram. The `tsc` step is the runner.

***

## Documentation map

| Section | What it covers |
| --- | --- |
| [Installation](/duck-ttest/installation) | Install the package, configure `tsconfig`, and import a sub-path. |
| [Getting started](/duck-ttest/getting-started) | Five-minute tutorial: write a failing test, see the error, fix it. |
| [Comparison](/duck-ttest/comparison) | Honest tradeoffs versus `tsd`, `expect-type`, and `type-fest`. |
| [Migration](/duck-ttest/migration) | v0.x → v1.0 breaking renames. |
| [Core — Assertions](/duck-ttest/core/assertions) | `AssertTrue`, `AssertFalse`, `Equal`, `Extends`. |
| [Core — Type-level testing](/duck-ttest/core/type-level-testing) | Workflow with `tsc`, vitest `@ts-expect-error`, and `tsd`. |
| [Core — Composing tests](/duck-ttest/core/composing-tests) | Naming, organization, and pitfalls. |
| [API reference](/duck-ttest/api/any) | Every exported type across all 35 modules. |
| [Guides](/duck-ttest/guides) | Branded types, discriminated unions, schema builders, regression suites. |

***

## Philosophy

}>
  Runtime tests check behavior. Type tests check contracts.

In a schema generator, ORM, or framework, the type **is** the contract. duck-ttest closes the loop between authoring a contract and verifying it — at the same compile step that catches every other type error.