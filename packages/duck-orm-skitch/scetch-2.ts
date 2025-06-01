// // === Step 1: Valid types and modifiers ===
//
// type ValueT = 'uuid' | 'varchar(255)' | 'text' | `enum("${string}")` | 'number' | 'timestamp'
// type ModifierBase = 'pk' | 'unique'
// type DefaultModifier = `default(${string})`
// type Modifier = ModifierBase | DefaultModifier
//
// // === Step 2: Split and utility helpers ===
//
// type Split<S extends string, Delimiter extends string> = S extends `${infer Head}${Delimiter}${infer Tail}`
//   ? [Head, ...Split<Tail, Delimiter>]
//   : [S]
//
// type Trim<S extends string> = S extends ` ${infer T}` ? Trim<T> : S extends `${infer T} ` ? Trim<T> : S
//
// type CleanParts<Parts extends string[]> = {
//   [K in keyof Parts]: Trim<Parts[K]>
// }
//
// type BaseAndModifiers<S extends string> = CleanParts<Split<S, '|>'>>
//
// type ModifierSet = {
//   pk?: true
//   unique?: true
//   default?: string
// }
//
// type ValidateModifiers<Parts extends string[], Seen extends Record<string, boolean> = {}> = Parts extends [
//   infer Head,
//   ...infer Tail,
// ]
//   ? Head extends keyof Seen
//     ? 'Duplicate modifier error'
//     : Head extends Modifier
//       ? Tail extends string[]
//         ? ValidateModifiers<Tail, Seen & { [K in Head]: true }>
//         : true
//       : Head extends `default(${string})`
//         ? Tail extends string[]
//           ? ValidateModifiers<Tail, Seen & { default: true }>
//           : true
//         : 'Invalid modifier'
//   : true
//
// type ParseAndValidate<S extends string> = BaseAndModifiers<S>
// // extends [infer Base, ...infer Modifiers]
// //   ? Base extends ValueT
// //     ? Modifiers extends string[]
// //       ? ValidateModifiers<Modifiers>
// //       : 'Invalid modifiers'
// //     : 'Invalid base type'
// //   : 'Must include base type'
//
// declare function define<const S extends string>(schema: ParseAndValidate<S>): void
// define('uuid' as const)
