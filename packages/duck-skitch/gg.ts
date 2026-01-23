type Whitespace = ' '

// Trim utils
type TrimLeft<S extends string> = S extends `${Whitespace}${infer R}` ? TrimLeft<R> : S

type TrimRight<S extends string> = S extends `${infer R}${Whitespace}` ? TrimRight<R> : S

type Trim<S extends string> = TrimLeft<TrimRight<S>>

// Split by delimiter
type Split<S extends string, D extends string> = string extends S
  ? string[]
  : S extends ''
    ? []
    : S extends `${infer T}${D}${infer U}`
      ? [T, ...Split<U, D>]
      : [S]

// Map trim on split result tuple
type TrimmedSplit<S extends string, D extends string> = Split<S, D> extends infer Parts
  ? Parts extends readonly string[]
    ? { [K in keyof Parts]: Trim<Parts[K] & string> }
    : never
  : never

type TrimLength<T extends string> = TrimmedSplit<T, '|>'>['length']
//////

type Base = 'uuid' | 'varchar(255)' | 'text' | `enum("${string}")` | 'number' | 'timestamp'
type Modifier = 'pk' | 'unique' | 'default' | `default(${string})`

type ValueT<TString extends string> =
  TrimLength<TString> extends 1
    ? `${Base}`
    : TrimLength<TString> extends 2
      ? `${Base} |> ${RemoveDuplication<Modifier, CheckDuplication<TString>>}`
      : TrimLength<TString> extends 3
        ? `${Base} |> ${RemoveDuplication<Modifier, CheckDuplication<TString>>} |> ${RemoveDuplication<Modifier, CheckDuplication<TString>>}`
        : never

type CheckDuplication<TString extends string> = TString extends `${infer _} |> ${infer M1} |> ${infer M2}`
  ? M1 extends M2
    ? M1
    : never
  : never

// Fix: RemoveDuplication always removes the duplicate from TType
type RemoveDuplication<TType extends string, Duplication extends string> = [Duplication] extends [never]
  ? TType // no duplication to remove, return full union
  : Exclude<TType, Duplication> // remove duplication from union

type K = RemoveDuplication<Modifier, CheckDuplication<'uuid |> pk'>>

// Now table returns trimmed parts
declare function table<const T extends ValueT<T>>(value: T): T

// Usage:
const result = table('uuid |> pk')
// result has type ['user', 'id', 'uuid']
//

type increment<T extends number> = T extends 0 ? 1 : T extends 1 ? 2 : T extends 2 ? 3 : never
