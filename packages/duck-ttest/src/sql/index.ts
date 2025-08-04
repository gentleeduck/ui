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
export type ExtractEnum<S extends string> = S extends `${string}ENUM(${infer EnumValues})${string}`
  ? ParseEnumValues<EnumValues>
  : never

export type ParseEnumValues<S extends string> = S extends `'${infer First}'`
  ? First
  : S extends `'${infer First}',${infer Rest}`
    ? First | ParseEnumValues<Trim<Rest>>
    : S extends `'${infer First}', ${infer Rest}`
      ? First | ParseEnumValues<Trim<Rest>>
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
export type StripConstraints<S extends string> = S extends `${infer Head} DEFAULT ${string}`
  ? StripConstraints<Head>
  : S extends `${infer Head} PRIMARY KEY`
    ? StripConstraints<Head>
    : S extends `${infer Head} NOT NULL`
      ? StripConstraints<Head>
      : S extends `${infer Head} UNIQUE`
        ? StripConstraints<Head>
        : S extends `${infer Head} AUTOINCREMENT`
          ? StripConstraints<Head>
          : S extends `${infer Head} AUTO_INCREMENT`
            ? StripConstraints<Head>
            : S extends `${infer Head} REFERENCES ${string}`
              ? StripConstraints<Head>
              : S

export type CleanSQLType<S extends string> = UppercaseWord<NormalizeType<StripConstraints<S>>>

// --- Parenthesis-aware Splitter for columns ---
// Helper to increment/decrement depth via tuple lengths
type Inc<D extends any[]> = [any, ...D]
type Dec<D extends any[]> = D extends [any, ...infer Rest] ? Rest : []

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
          : S extends `${infer First}${infer Rest}`
            ? SplitColumns<Rest, Sep, Depth, `${Curr}${First}`, Acc>
            : never
        : S extends `${infer First}${infer Rest}`
          ? SplitColumns<Rest, Sep, Depth, `${Curr}${First}`, Acc>
          : never

// --- Determine if field should be nullable ---
export type IsNullable<S extends string> = IsNotNull<S> extends true
  ? false
  : IsPrimaryKey<S> extends true
    ? false
    : true

// --- Determine if field should be optional ---
export type IsOptional<S extends string> = HasDefault<S> extends true
  ? true
  : IsPrimaryKey<S> extends true
    ? IsAutoIncrement<S> extends true
      ? true
      : false
    : IsNotNull<S> extends true
      ? false
      : true

// --- Get the base TypeScript type ---
export type GetBaseType<S extends string> = ExtractReferences<S> extends Ref<infer T, infer C>
  ? Ref<T, C>
  : ExtractEnum<S> extends never
    ? CleanSQLType<S> extends keyof SQLTypeMap
      ? SQLTypeMap[CleanSQLType<S>]
      : unknown
    : ExtractEnum<S>

// --- Apply nullability ---
export type ApplyNullability<BaseType, S extends string> = IsNullable<S> extends true ? BaseType | null : BaseType

// --- Parse individual column ---
export type ParseColumnDef<S extends string> = S extends `${infer Name} ${infer Raw}`
  ? [Trim<Name>, ApplyNullability<GetBaseType<Raw>, Raw>, IsOptional<Raw>]
  : never

// --- Extract columns from CREATE TABLE ---
export type ExtractColumns<SQL extends string> = NormalizeSQL<SQL> extends `CREATE TABLE ${infer _} (${infer Columns})`
  ? SplitColumns<Columns>
  : never

// --- Build the final schema type ---
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never

export type BuildSchemaType<Cols extends readonly string[]> = UnionToIntersection<
  {
    [I in keyof Cols]: ParseColumnDef<Cols[I]> extends [infer N extends string, infer T, infer O extends boolean]
      ? O extends true
        ? { [K in N]?: T }
        : { [K in N]: T }
      : never
  }[number]
>
type hay = ExtractColumns<TestSQL1>
type hay1 = BuildSchemaType<hay>

// --- Entry point ---
export type InferSchema<S extends string> = ExtractColumns<S> extends infer Cols extends readonly string[]
  ? { [K in keyof BuildSchemaType<Cols>]: BuildSchemaType<Cols>[K] }
  : never

// --- Reference resolution ---
export type ResolveRef<T, Schemas extends Record<string, any>> = T extends Ref<infer Table, infer Col>
  ? Table extends keyof Schemas
    ? Col extends keyof Schemas[Table]
      ? Schemas[Table][Col]
      : unknown
    : unknown
  : T

export type ResolveFields<T, Schemas extends Record<string, any>> = {
  [P in keyof T]: ResolveRef<T[P], Schemas>
}

// --- Example usage and test types ---

// Test case 1: Basic table with various constraints
type TestSQL1 = `
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    age INT DEFAULT 18,
    bio TEXT,
    status ENUM('active', 'inactive', 'pending') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`

// Test case 2: Table with foreign keys and nullable fields
type TestSQL2 = `
  CREATE TABLE posts (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    user_id INT REFERENCES users(id),
    published BOOLEAN DEFAULT false,
    category ENUM('tech', 'lifestyle', 'business') NOT NULL
  )
`

// Test case 3: Table with no auto-increment primary key
type TestSQL3 = `
  CREATE TABLE settings (
    key VARCHAR(50) PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false
  )
`

// Test the inferred schemas
type UserSchema = InferSchema<TestSQL1>
type PostSchema = InferSchema<TestSQL2>
type SettingsSchema = InferSchema<TestSQL3>
