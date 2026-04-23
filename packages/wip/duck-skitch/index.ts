// namespace T {
//   export type UUID = `${string}-${string}-${string}-${string}-${string}`
//   export type Integer = number
//   export type Float = number
//   export type Decimal = number
//   export type Boolean = boolean
//   export type VarChar<L extends number = 255> = L extends number ? string : never
//   export type Text = string
//   export type LongText = string
//
//   export type Enum<T extends string> = T
//   export type JSONPrimitive = string | number
//   export type JSON = { [key: JSONPrimitive | symbol]: JSON | string }
//   export type JSONB = { [key: JSONPrimitive | symbol]: JSONB | JSONPrimitive | boolean }
// }
// namespace P {
//   export type UUID = 'uuidv4' | 'uuidv7'
//   export type ID<T extends string> = T extends UUID | string ? T : never
//   export type PK<T> = T
//   export type Unique<T> = T
//   export type ForeignKey<T> = PK<T>
//   export type Nullable<T> = T | null
//
//   export type TimeValues = Date | 'timestamp' | 'timestampz'
//   export type Time<T extends TimeValues> = T
//
//   export type DefaultValue<T> = T extends TimeValues ? 'now' : T extends string ? UUID : T extends number ? 0 : never
//
//   export type Default<T, D extends DefaultValue<T>> = { key: T; default: D }
//   export type ActionsFallBack = 'CASCADE' | 'RESTRICT'
//   export type OnDelete<T, P extends ActionsFallBack> = T
//   export type OnUpdate<T, P extends ActionsFallBack> = T
//
//   export type GreaterThan<T extends number, U extends number> = T
//   export type LessThan<T extends number, U extends number> = T
// }
//
// namespace S {
//   export type Table<T> = T
//   export type Relation<T extends Table<any>, U extends keyof T> = T
// }
//
// // Tables
// export type User = S.Table<{
//   id: P.Default<P.PK<P.Unique<T.UUID>>, 'uuidv7'>
//   name: P.PK<T.VarChar<255>>
//   bio: T.Text
//   role: T.Enum<'admin' | 'user'>
//   platform: T.Enum<'android' | 'ios'>
//   versions: T.VarChar<255> | P.Default<T.Integer, 0>
//   updated_at: P.Default<P.Time<'timestamp'>, 'now'>
//   created_at: P.Default<P.Time<'timestamp'>, 'now'>
// }>
//
// export type Course = S.Table<{
//   id: P.PK<P.UUID>
//   name: P.PK<T.VarChar<255>>
//   progress: P.GreaterThan<T.Integer, 0> & P.LessThan<T.Integer, 100>
//   other_information: T.JSONB
//   user_id: P.OnUpdate<P.OnDelete<P.PK<S.Relation<User, 'id'>>, 'CASCADE'>, 'RESTRICT'>
// }>
