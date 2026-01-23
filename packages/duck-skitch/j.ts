// expr-types.ts
type Primitive = 'string' | 'number' | 'boolean' | 'null' | 'undefined'
type Literal = `'${string}'` | `"${string}"`
type Atom = Primitive | Literal

type OR = ' | '

type Expr1 = Atom
type Expr2 = `${Expr1}${OR}${Atom}`
type Expr3 = `${Expr2}${OR}${Atom}`
type Expr4 = `${Expr3}${OR}${Atom}`
type Expr5 = `${Expr4}${OR}${Atom}`

// pick how long unions can be (increase if you want)
export type Expr = Expr1 | Expr2 | Expr3 | Expr4 | Expr5

export type Schema = Record<string, Expr>

// optional keys like "version?"
export type OptionalKey<K extends string> = `${K}?`

declare function type<const S extends Schema>(s: S): S

const User = type({
  name: 'string',
  platform: "'android' | 'ios'",
  'version?': 'number | string',
} satisfies Schema)
