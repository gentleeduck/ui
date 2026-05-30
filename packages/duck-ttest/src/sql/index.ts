import type { JSONValue } from '~/json'
import type { Trim } from '~/template'
import type { UnionToIntersection } from '~/union'

// Re-export shared helpers so existing `from '~/sql'` imports keep resolving.
/** @deprecated Re-exported from canonical home; import from `~/template` instead. */
export type { Trim } from '~/template'
/** @deprecated Re-exported from canonical home; import from `~/union` instead. */
export type { UnionToIntersection } from '~/union'

export type SQLTypeMap = {
  INT: number
  INTEGER: number
  TEXT: string
  VARCHAR: string
  CHAR: string
  BOOLEAN: boolean
  FLOAT: number
  DOUBLE: number
  'DOUBLE PRECISION': number
  UUID: string
  DATE: string
  DATETIME: string
  TIMESTAMP: string
  TIME: string
  DECIMAL: number
  NUMERIC: number
  BLOB: Uint8Array
  JSON: JSONValue
}

export type WhitespaceChar = ' ' | '\n' | '\t' | '\r'

export type CollapseWhitespaceSafe<
  S extends string,
  InSpace extends boolean = false,
  Acc extends string = '',
> = S extends `${infer Char}${infer Rest}`
  ? Char extends WhitespaceChar
    ? InSpace extends true
      ? CollapseWhitespaceSafe<Rest, true, Acc>
      : CollapseWhitespaceSafe<Rest, true, `${Acc} `>
    : CollapseWhitespaceSafe<Rest, false, `${Acc}${Char}`>
  : Trim<Acc>

export type NormalizeSQL<S extends string> = CollapseWhitespaceSafe<S>

export type UppercaseWord<S extends string> = S extends `${infer C1}${infer Rest}`
  ? `${Uppercase<C1>}${UppercaseWord<Rest>}`
  : ''

export type NormalizeType<S extends string> = S extends `${infer T}(${string})` ? T : S

export type Ref<Table extends string, Column extends string> = {
  __ref: true
  table: Table
  column: Column
}

export type ExtractReferences<S extends string> = S extends `${string} REFERENCES ${infer T}(${infer C})${string}`
  ? Ref<Trim<T>, Trim<C>>
  : null

export type ExtractEnum<S extends string> = S extends `${string}ENUM(${infer Values})${string}`
  ? ParseEnumValues<Values>
  : never

export type ParseEnumValues<S extends string> = S extends `'${infer First}',${infer Rest}`
  ? First | ParseEnumValues<Trim<Rest>>
  : S extends `'${infer Only}'`
    ? Only
    : never

export type HasDefault<S extends string> = S extends `${string} DEFAULT ${string}` ? true : false
export type IsNotNull<S extends string> = S extends `${string} NOT NULL` ? true : false
export type IsPrimaryKey<S extends string> = S extends `${string} PRIMARY KEY` ? true : false
export type IsAutoIncrement<S extends string> = S extends `${string} AUTOINCREMENT`
  ? true
  : S extends `${string} AUTO_INCREMENT`
    ? true
    : false

export type StripConstraints<S extends string> = S extends `${infer H} DEFAULT ${string}`
  ? StripConstraints<H>
  : S extends `${infer H} PRIMARY KEY`
    ? StripConstraints<H>
    : S extends `${infer H} NOT NULL`
      ? StripConstraints<H>
      : S extends `${infer H} UNIQUE`
        ? StripConstraints<H>
        : S extends `${infer H} AUTOINCREMENT`
          ? StripConstraints<H>
          : S extends `${infer H} AUTO_INCREMENT`
            ? StripConstraints<H>
            : S extends `${infer H} REFERENCES ${string}`
              ? StripConstraints<H>
              : S

export type CleanSQLType<S extends string> = UppercaseWord<NormalizeType<StripConstraints<S>>>

// Parenthesis-aware column splitter. Depth tracked via tuple length —
// `unknown[]` rather than `any[]` for stylistic consistency.
type _IncDepth<D extends unknown[]> = [unknown, ...D]
type _DecDepth<D extends unknown[]> = D extends [unknown, ...infer R] ? R : []

export type SplitColumns<
  S extends string,
  Sep extends string = ',',
  Depth extends unknown[] = [],
  Curr extends string = '',
  Acc extends string[] = [],
> = S extends ''
  ? [...Acc, Trim<Curr>]
  : S extends `(${infer Rest}`
    ? SplitColumns<Rest, Sep, _IncDepth<Depth>, `${Curr}(`, Acc>
    : S extends `)${infer Rest}`
      ? SplitColumns<Rest, Sep, _DecDepth<Depth>, `${Curr})`, Acc>
      : Depth extends []
        ? S extends `${Sep}${infer Rest}`
          ? SplitColumns<Rest, Sep, Depth, '', [...Acc, Trim<Curr>]>
          : S extends `${infer F}${infer R}`
            ? SplitColumns<R, Sep, Depth, `${Curr}${F}`, Acc>
            : never
        : S extends `${infer F}${infer R}`
          ? SplitColumns<R, Sep, Depth, `${Curr}${F}`, Acc>
          : never

// SQL column constraints — DEFAULT, AUTO_INCREMENT, NOT NULL, or PRIMARY KEY
// make a column non-nullable. Distinct from the TS `IsNullable` in `~/primitive`
// (which talks about `null | undefined` in a TS type) — hence the SQL prefix.
export type IsSQLNullable<S extends string> =
  HasDefault<S> extends true
    ? false
    : IsAutoIncrement<S> extends true
      ? false
      : IsNotNull<S> extends true
        ? false
        : IsPrimaryKey<S> extends true
          ? false
          : true

// Optional when: DEFAULT present, or PK + AUTO_INCREMENT, or lacks NOT NULL.
// Distinct from the TS `IsOptional` in `~/primitive` (which checks whether
// `undefined` is in the type) — hence the SQL prefix.
export type IsSQLOptional<S extends string> =
  HasDefault<S> extends true
    ? true
    : IsPrimaryKey<S> extends true
      ? IsAutoIncrement<S> extends true
        ? true
        : false
      : IsNotNull<S> extends true
        ? false
        : true

export type GetBaseType<S extends string> =
  ExtractReferences<S> extends Ref<infer T, infer C>
    ? Ref<T, C>
    : ExtractEnum<S> extends never
      ? CleanSQLType<S> extends keyof SQLTypeMap
        ? SQLTypeMap[CleanSQLType<S>]
        : unknown
      : ExtractEnum<S>

export type ApplyNullability<Base, S extends string> = IsSQLNullable<S> extends true ? Base | null : Base

export type ParseColumnDef<S extends string> = S extends `${infer Name} ${infer Raw}`
  ? [Trim<Name>, ApplyNullability<GetBaseType<Raw>, Raw>, IsSQLOptional<Raw>]
  : never

export type ExtractColumns<SQL extends string> =
  NormalizeSQL<SQL> extends `CREATE TABLE ${infer _} (${infer C})` ? SplitColumns<C> : never

export type BuildSchemaType<Cols extends readonly string[]> = UnionToIntersection<
  {
    [I in keyof Cols]: ParseColumnDef<Cols[I]> extends [infer N extends string, infer T, infer O extends boolean]
      ? O extends true
        ? { [K in N]?: T }
        : { [K in N]: T }
      : never
  }[number]
>

export type InferSchema<S extends string> =
  ExtractColumns<S> extends infer Cols extends readonly string[]
    ? { [K in keyof BuildSchemaType<Cols>]: BuildSchemaType<Cols>[K] }
    : never

export type ResolveRef<T, Schemas extends Record<string, unknown>> =
  T extends Ref<infer Tbl, infer Col>
    ? Tbl extends keyof Schemas
      ? Schemas[Tbl] extends infer Row
        ? Col extends keyof Row
          ? Row[Col]
          : unknown
        : unknown
      : unknown
    : T

export type ResolveFields<T, Schemas extends Record<string, unknown>> = {
  [P in keyof T]: ResolveRef<T[P], Schemas>
}
