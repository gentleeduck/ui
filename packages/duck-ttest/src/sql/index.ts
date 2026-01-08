// --- SQL-to-TypeScript primitive mapping ---
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
  JSON: any
}

// --- Whitespace utils ---
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

export type Trim<S extends string> = S extends ` ${infer R}` ? Trim<R> : S extends `${infer R} ` ? Trim<R> : S

export type NormalizeSQL<S extends string> = CollapseWhitespaceSafe<S>

// --- Capitalization and type cleaning ---
export type UppercaseWord<S extends string> = S extends `${infer C1}${infer Rest}`
  ? `${Uppercase<C1>}${UppercaseWord<Rest>}`
  : ''

export type NormalizeType<S extends string> = S extends `${infer T}(${string})` ? T : S

// --- Reference extraction ---
export type Ref<Table extends string, Column extends string> = {
  __ref: true
  table: Table
  column: Column
}

export type ExtractReferences<S extends string> = S extends `${string} REFERENCES ${infer T}(${infer C})${string}`
  ? Ref<Trim<T>, Trim<C>>
  : null

// --- Enum extraction ---
export type ExtractEnum<S extends string> = S extends `${string}ENUM(${infer Values})${string}`
  ? ParseEnumValues<Values>
  : never

export type ParseEnumValues<S extends string> = S extends `'${infer First}',${infer Rest}`
  ? First | ParseEnumValues<Trim<Rest>>
  : S extends `'${infer Only}'`
    ? Only
    : never

// --- Constraint detection ---
export type HasDefault<S extends string> = S extends `${string} DEFAULT ${string}` ? true : false
export type IsNotNull<S extends string> = S extends `${string} NOT NULL` ? true : false
export type IsPrimaryKey<S extends string> = S extends `${string} PRIMARY KEY` ? true : false
export type IsAutoIncrement<S extends string> = S extends `${string} AUTOINCREMENT`
  ? true
  : S extends `${string} AUTO_INCREMENT`
    ? true
    : false

// --- Constraint stripping for type extraction ---
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

// --- Parenthesis-aware Splitter for columns ---
type Inc<D extends any[]> = [any, ...D]
type Dec<D extends any[]> = D extends [any, ...infer R] ? R : []

export type SplitColumns<
  S extends string,
  Sep extends string = ',',
  Depth extends any[] = [],
  Curr extends string = '',
  Acc extends string[] = [],
> = S extends ''
  ? [...Acc, Trim<Curr>]
  : S extends `(${infer Rest}`
    ? SplitColumns<Rest, Sep, Inc<Depth>, `${Curr}(`, Acc>
    : S extends `)${infer Rest}`
      ? SplitColumns<Rest, Sep, Dec<Depth>, `${Curr})`, Acc>
      : Depth extends []
        ? S extends `${Sep}${infer Rest}`
          ? SplitColumns<Rest, Sep, Depth, '', [...Acc, Trim<Curr>]>
          : S extends `${infer F}${infer R}`
            ? SplitColumns<R, Sep, Depth, `${Curr}${F}`, Acc>
            : never
        : S extends `${infer F}${infer R}`
          ? SplitColumns<R, Sep, Depth, `${Curr}${F}`, Acc>
          : never

// --- Determine if field should be nullable ---
export type IsNullable<S extends string> =
  HasDefault<S> extends true // DEFAULT ⇒ non-nullable
    ? false
    : IsAutoIncrement<S> extends true // AUTO_INCREMENT ⇒ non-nullable
      ? false
      : IsNotNull<S> extends true // NOT NULL ⇒ non-nullable
        ? false
        : IsPrimaryKey<S> extends true // PRIMARY KEY ⇒ non-nullable
          ? false
          : true // otherwise nullable

// --- Determine if field should be optional ---
export type IsOptional<S extends string> =
  HasDefault<S> extends true // DEFAULT ⇒ optional
    ? true
    : IsPrimaryKey<S> extends true // PK ⇒ optional if auto-inc only
      ? IsAutoIncrement<S> extends true
        ? true
        : false
      : IsNotNull<S> extends true // NOT NULL without default ⇒ required
        ? false
        : true // otherwise optional

// --- Base type resolution ---
export type GetBaseType<S extends string> =
  ExtractReferences<S> extends Ref<infer T, infer C>
    ? Ref<T, C>
    : ExtractEnum<S> extends never
      ? CleanSQLType<S> extends keyof SQLTypeMap
        ? SQLTypeMap[CleanSQLType<S>]
        : unknown
      : ExtractEnum<S>

// --- Apply nullability ---
export type ApplyNullability<Base, S extends string> = IsNullable<S> extends true ? Base | null : Base

// --- Parse column definition ---
export type ParseColumnDef<S extends string> = S extends `${infer Name} ${infer Raw}`
  ? [Trim<Name>, ApplyNullability<GetBaseType<Raw>, Raw>, IsOptional<Raw>]
  : never

// --- Extract columns and build schema ---
export type ExtractColumns<SQL extends string> =
  NormalizeSQL<SQL> extends `CREATE TABLE ${infer _} (${infer C})` ? SplitColumns<C> : never

export type UnionToIntersection<U> = (U extends any ? (x: U) => void : never) extends (x: infer I) => void ? I : never

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

// --- Reference resolution ---
export type ResolveRef<T, Schemas extends Record<string, any>> = T extends Ref<infer Tbl, infer Col>
  ? Tbl extends keyof Schemas
    ? Col extends keyof Schemas[Tbl]
      ? Schemas[Tbl][Col]
      : unknown
    : unknown
  : T

export type ResolveFields<T, Schemas extends Record<string, any>> = {
  [P in keyof T]: ResolveRef<T[P], Schemas>
}
