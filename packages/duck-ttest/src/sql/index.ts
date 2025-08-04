// Map of SQL types to TypeScript types
export type SQLTypeMap = {
  INT: number
  INTEGER: number
  TEXT: string
  VARCHAR: string
  BOOLEAN: boolean
  FLOAT: number
  DOUBLE: number
  'DOUBLE PRECISION': number
  UUID: string
  DATE: string
}

// Whitespace handling
export type WhitespaceChar = ' ' | '\n' | '\t' | '\r'

export type CollapseWhitespaceSafe<
  S extends string,
  InSpace extends boolean = false,
  Acc extends string = '',
> = S extends `${infer Char}${infer Rest}`
  ? Char extends WhitespaceChar
    ? InSpace extends true
      ? CollapseWhitespaceSafe<Rest, true, Acc> // skip extra space
      : CollapseWhitespaceSafe<Rest, true, `${Acc} `> // add one space
    : CollapseWhitespaceSafe<Rest, false, `${Acc}${Char}`>
  : Trim<Acc>

export type Trim<S extends string> = S extends ` ${infer R}` ? Trim<R> : S extends `${infer R} ` ? Trim<R> : S

export type NormalizeSQL<S extends string> = CollapseWhitespaceSafe<S>

// Capitalization and simplification of SQL types
export type UppercaseWord<S extends string> = S extends `${infer C1}${infer Rest}`
  ? `${Uppercase<C1>}${UppercaseWord<Rest>}`
  : ''

export type StripConstraints<S extends string> = S extends `${infer Head} DEFAULT ${string}`
  ? StripConstraints<Head>
  : S extends `${infer Head} PRIMARY KEY`
    ? StripConstraints<Head>
    : S extends `${infer Head} NOT NULL`
      ? StripConstraints<Head>
      : S extends `${infer Head} UNIQUE`
        ? StripConstraints<Head>
        : S

export type NormalizeType<S extends string> = S extends `${infer T}(${string})` ? T : S

export type CleanSQLType<S extends string> = UppercaseWord<NormalizeType<StripConstraints<S>>>

// Split comma-separated column definitions
export type Split<S extends string, Sep extends string> = S extends `${infer Head}${Sep}${infer Tail}`
  ? [Trim<Head>, ...Split<Tail, Sep>]
  : S extends ''
    ? []
    : [Trim<S>]

// Parse a single column definition into [name, type]
export type ParseColumnDef<S extends string> = S extends `${infer Name} ${infer RawTypeAndConstraints}`
  ? [
      Trim<Name>,
      CleanSQLType<RawTypeAndConstraints> extends keyof SQLTypeMap
        ? SQLTypeMap[CleanSQLType<RawTypeAndConstraints>]
        : unknown,
    ]
  : never

// Extract all columns from the CREATE TABLE string
export type ExtractColumns<SQL extends string> = NormalizeSQL<SQL> extends `CREATE TABLE ${string} (${infer Columns})`
  ? Split<Columns, ','> extends infer ColDefs extends string[]
    ? {
        [P in ColDefs[number] as ParseColumnDef<P>[0]]: ParseColumnDef<P>[1]
      }
    : never
  : never

// Final entry point
export type InferSchema<S extends string> = ExtractColumns<S>
