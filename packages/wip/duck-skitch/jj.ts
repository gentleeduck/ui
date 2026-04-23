// // tiny-ark.ts
// // Goal: string DSL with autocomplete after `|` for allowed Base types,
// // plus compile-time rejection of unknown tokens (like "asdf").
//
// // ----------------------
// // 1) Your allowed tokens
// // ----------------------
//
// export type Base =
//   | 'uuid'
//   | 'varchar(255)'
//   | 'text'
//   | `enum("${string}")`
//   | 'number'
//   | 'timestamp'
//
// export type Modifier = 'pk' | 'unique' | 'default' | `default(${string})`
//
// // ----------------------
// // 2) Small helpers
// // ----------------------
//
// type WS = ' '
// type OptWS = '' | WS
//
// type Pipe =
//   | '|'
//   | `${OptWS}|`
//   | `|${OptWS}`
//   | `${OptWS}|${OptWS}`
//
// // simple depth decrement (keeps TS fast + avoids circular alias errors)
// type Dec<N extends number> =
//   N extends 0 ? 0
//   : N extends 1 ? 0
//   : N extends 2 ? 1
//   : N extends 3 ? 2
//   : N extends 4 ? 3
//   : N extends 5 ? 4
//   : N extends 6 ? 5
//   : N extends 7 ? 6
//   : N extends 8 ? 7
//   : N extends 9 ? 8
//   : N extends 10 ? 9
//   : 0
//
// // ----------------------
// // 3) Expression grammar
// // ----------------------
//
// // Keep it small: each union segment is just a Base (this is the part you wanted).
// type Segment = Base
//
// // Depth-limited union expression.
// // Includes a "trailing pipe" form so typing `uuid | ` is accepted while in-progress,
// // and the editor can suggest the next Segment.
// type UnionExpr<Depth extends number = 6> =
//   Depth extends 0
//     ? Segment | `${Segment}${Pipe}`
//     : Segment
//       | `${Segment}${Pipe}${UnionExpr<Dec<Depth>>}`
//       | `${Segment}${Pipe}`
//
// export type Expr = UnionExpr
//
// // Use this for "type-level" validation:
// // `Build<'uuid | asdf'>` will error at the type arg.
// export type Build<S extends Expr> = S
//
// // ----------------------
// // 4) Infer a TS type from the string expression
// // ----------------------
//
// type TrimLeft<S extends string> = S extends `${WS}${infer R}` ? TrimLeft<R> : S
// type TrimRight<S extends string> = S extends `${infer R}${WS}` ? TrimRight<R> : S
// type Trim<S extends string> = TrimLeft<TrimRight<S>>
//
// type BaseToTs<B extends Base> =
//   B extends 'number' ? number
//   : B extends 'timestamp' ? Date
//   : // uuid/varchar/text/enum(...) -> string
//     string
//
// type HeadBase<S extends string> =
//   Trim<S> extends `${infer B} ${string}` ? (B extends Base ? B : never)
//   : Trim<S> extends infer B ? (B extends Base ? B : never)
//   : never
//
// type InferAlt<S extends string> =
//   HeadBase<S> extends infer B extends Base ? BaseToTs<B> : never
//
// export type Infer<S extends Expr> =
//   S extends `${infer L}|${infer R}`
//     ? InferAlt<L> | Infer<Trim<R> & Expr>
//     : InferAlt<S>
//
// // ----------------------
// // 5) Runtime helper (optional, but makes it feel like arktype)
// // ----------------------
//
// export type Type<S extends Expr> = {
//   readonly def: S
//   check(value: unknown): value is Infer<S>
//   assert(value: unknown): asserts value is Infer<S>
// }
//
// const uuidRe =
//   /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
//
// function baseCheck(base: string, v: unknown): boolean {
//   switch (true) {
//     case base === 'number':
//       return typeof v === 'number' && Number.isFinite(v)
//     case base === 'timestamp':
//       return v instanceof Date && !Number.isNaN(v.getTime())
//     case base === 'uuid':
//       return typeof v === 'string' && uuidRe.test(v)
//     case base === 'varchar(255)':
//     case base === 'text':
//       return typeof v === 'string'
//     case base.startsWith('enum("') && base.endsWith('")'):
//       return typeof v === 'string'
//     default:
//       return false
//   }
// }
//
// function parseBases(def: string): string[] {
//   return def
//     .split('|')
//     .map(s => s.trim())
//     .filter(Boolean)
//     .map(seg => seg.split(/\s+/)[0]!) // base is first token
// }
//
// export function type<const S extends Expr>(def: S): Type<S> {
//   const bases = parseBases(def)
//
//   return {
//     def,
//     check(value) {
//       for (const b of bases) if (baseCheck(b, value)) return true
//       return false
//     },
//     assert(value) {
//       if (!this.check(value)) throw new Error(`Value does not match: ${def}`)
//     },
//   }
// }
//
// // ----------------------
// // 6) Usage
// // ----------------------
//
// // ✅ autocomplete after you type: 'uuid | '
// const User = type(')
//
// // inferred: string
// export type UserT = Infer<typeof User.def>
//
// // ❌ compile-time error: "asdf" not allowed
// // let bad: Build<'uuid | asdf | asdf'> = 'uuid | asdf | asdf'
//
// // ❌ compile-time error in call:
// // const BadUser = type('uuid | asdf')
//
