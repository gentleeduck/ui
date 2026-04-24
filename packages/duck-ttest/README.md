# `🦆 @gentleduck/ttest`

> **TypeScript Type-Level Test Framework.**
> Assert your types like you mean it, at compile time.

---

## 💡 What is this?

`ttest` is a zero-runtime library for writing **type-level tests** in TypeScript.

You spend countless hours designing complex types and systems, `ttest` gives you a way to **validate** them with confidence. No `console.log`, no runtime hacks, just pure **type assertion** at compile-time.

---

## ✨ Features

* ✅ **Zero-runtime**: Fully erased at compile time, no emitted JS.
* 📐 **Precise assertions**: Verify assignability, equality, and inference.
* 🧠 **IDE-friendly**: Fails type-checking with helpful messages.
* 🧪 Works with your favorite setup (e.g. `tsc`, `tsd`, `vitest` + `@ts-expect-error`)
* 🦆 Designed for duck-typed systems, schema builders, type-safe APIs, and ORMs.

---

## 📦 Installation

```bash
bun add -d @gentleduck/ttest
```

---

## 🚀 Quick Start

```ts
type Schema = InferSchema<"CREATE TABLE users (id INT PRIMARY KEY, email TEXT NOT NULL)">;

type Test_Column = AssertTrue<
  Equal<Schema['email'], string>,
  'Expected SQL "TEXT" to infer as string'
>;
```

---

## ❓ Why Not `tsd` or `expect-type`?

`@gentleduck/ttest` is inspired by them but designed for **framework authors** and **type-heavy codebases**:

* Cleaner API for grouped tests.
* More powerful inference testing.
* Easier integration with custom toolchains.
* It's a duck thing 🦆, it fits your ecosystem.

---

## 🧙 Advanced Patterns

```ts
type X1 = XOR<{ a: number; common: string }, { b: boolean; common: string }>

// expected: { a: number } | { b: boolean }
type Test_X1 = AssertTrue<
  Equal<X1, { a: number } | { b: boolean }>,
  'Expected XOR to produce mutually exclusive union of properties'
>;
```

---

## 🧠 Philosophy

> Runtime tests test behavior.
> Type tests test **contracts**.

If you’re building a schema system, compiler, or framework, types *are* your architecture. You can’t trust what you can’t test. `@gentleduck/ttest` exists to **close the feedback loop** between your types and your logic.

---

## 🦆 License

[MIT © GentleDuck](./LICENSE)
