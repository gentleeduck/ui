// type Whitespace = ' '
//
// // Trim utils
// type TrimLeft<S extends string> = S extends `${Whitespace}${infer R}` ? TrimLeft<R> : S
// type TrimRight<S extends string> = S extends `${infer R}${Whitespace}` ? TrimRight<R> : S
// type Trim<S extends string> = TrimLeft<TrimRight<S>>
//
// // Split by delimiter
// type Split<S extends string, D extends string> = string extends S
//   ? string[]
//   : S extends ''
//   ? []
//   : S extends `${infer T}${D}${infer U}`
//   ? [T, ...Split<U, D>]
//   : [S]
//
// // Map trim on split result tuple
// type TrimmedSplit<S extends string, D extends string> = Split<S, D> extends infer Parts
//   ? Parts extends readonly string[]
//   ? { [K in keyof Parts]: Trim<Parts[K] & string> }
//   : never
//   : never
//
// type TrimLength<T extends string> = TrimmedSplit<T, '|>'>['length']
//
// // Base types
// type Base = 'uuid' | 'varchar(255)' | 'text' | `enum("${string}")` | 'number' | 'timestamp'
// type Modifier = 'pk' | 'unique' | 'default' | `default(${string})`
//
// // Recursive ValueT implementation
// type ValueT<TString extends string> = TrimLength<TString> extends infer Length extends number
//   ? Length extends 1
//   ? Base
//   : BuildChainRecursive<TString, Length>
//   : never
//
// type BuildChainRecursive<
//   TString extends string,
//   Remaining extends number,
//   Counter extends unknown[] = [unknown],
//   Acc extends string = `${Base}`,
// > = Counter['length'] extends Remaining
//   ? Acc
//   : BuildChainRecursive<
//     TString,
//     Remaining,
//     [...Counter, unknown],
//     `${Acc} |> ${RemoveDuplication<Modifier, CheckDuplication<TString>>}`
//   >
//
// type CheckDuplication<TString extends string> = TString extends `${infer _} |> ${infer M1} |> ${infer M2}`
//   ? M1 extends M2
//   ? M1
//   : never
//   : never
//
// // Fix: RemoveDuplication always removes the duplicate from TType
// type RemoveDuplication<TType extends string, Duplication extends string> = [Duplication] extends [never]
//   ? TType // no duplication to remove, return full union
//   : Exclude<TType, Duplication> // remove duplication from union
//
// // Transform object values to use ValueT
// type TransformTableSchema<T extends Record<string, string>> = {
//   [K in keyof T]: ValueT<T[K]>
// }
//
// // Table function that works with objects
// declare function table<const T extends Record<string, string>>(schema: T): TransformTableSchema<T>
//
// // Usage examples:
// const result1 = table({
//   id: 'uuid |> pk',
//   name: 'varchar(255) |> unique',
//   email: 'varchar(255) |> unique |> default',
//   age: 'number |> default',
//   created_at: 'timestamp |> default |> pk |> pk', // test deduplication
// })
//
// // Test individual types
// type TestSingle = ValueT<'uuid'>
// type TestDouble = ValueT<'uuid |> pk'>
// type TestTriple = ValueT<'uuid |> pk |> unique'>
// type TestDedup = ValueT<'uuid |> pk |> pk'>
//
// // Alternative: If you want the function to accept both string and object
// declare function tableFlexible<const T extends Record<string, string>(
//   schema: T extends string ? T : T extends Record<string, string> ? T : never,
// ): T extends string ? ValueT<T> : T extends Record<string, string> ? TransformTableSchema<T> : never
//
// // Usage with flexible function
// const flexResult1 = tableFlexible('uuid |> pk |> unique')
// const flexResult2 = tableFlexible({
//   id: '',
//   name: 'varchar(255) |> unique',
// })
