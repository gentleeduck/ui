// // Helpers to parse specific types
// type ExtractEnum<T extends string> = T extends `"${infer First}","${infer Rest}`
//   ? `${First}` | ExtractEnum<`"${Rest}`>
//   : T extends `"${infer Last}"`
//     ? `${Last}`
//     : never
//
// type ExtractVarchar<T extends string> = string
// type ExtractNumber<T extends string> = number
// type ExtractTimestamp<T extends string> = Date
// type ExtractUUID<T extends string> = string
// type ExtractText<T extends string> = string
//
// // Main type parser
// type BaseType<T extends string> = T extends `uuid${string}`
//   ? ExtractUUID<T>
//   : T extends `varchar(${string})${string}`
//     ? ExtractVarchar<T>
//     : T extends `text${string}`
//       ? ExtractText<T>
//       : T extends `enum(${infer Values})${string}`
//         ? ExtractEnum<Values>
//         : T extends `number${string}`
//           ? ExtractNumber<T>
//           : T extends `timestamp${string}`
//             ? ExtractTimestamp<T>
//             : unknown
//
// // Final resolved type per field (no `undefined`)
// type ToField<T extends string> = BaseType<T>
//
// // Top-level field parser
// type ParseFields<T> = {
//   -readonly [K in keyof T]: T[K] extends string ? ToField<T[K]> : never
// }
//
// type ValueT = 'uuid' | 'varchar(255)' | 'text' | `enum("${string}")` | 'number' | 'timestamp'
// type ModifierT = 'unique' | 'pk' | `default(${string})`
//
// type Mod1 = `|> ${ModifierT}`
// type Mod2 = `${Mod1} |> ${ModifierT}`
//
// // 👇 Main type for intellisense/autocomplete
// type key =
//   | ValueT // e.g., "uuid"
//   | `${ValueT} ${Mod1}` // e.g., "uuid |> pk"
//   | `${ValueT} ${Mod2}` // e.g., "uuid |> pk |> default(...)"
//
// // Runtime stub
// declare function table<const T extends Record<string, string>, const J extends Record<string, string>>(
//   value: T,
// ): ParseFields<T>
//
// // ✅ Usage
// const user = table({
//   id: 'uuid |> unique |> pk |> default(uuidv7)',
//   // name: 'varchar(255) |> pk',
//   // bio: 'text',
//   // role: 'enum("admin","user") |> default("user")',
//   // platform: 'enum("android","ios") |> default("android")',
//   // versions: 'number > 0 < 100',
//   // updated_at: 'timestamp |> default(now)',
//   // created_at: 'timestamp |> default(now)',
// })
//
// // ✅ Inferred Type:
// type User = typeof user
//
// /*
// User = {
//   id: string;
//   name: string;
//   bio: string;
//   role: "admin" | "user";
//   platform: "android" | "ios";
//   versions: number;
//   updated_at: Date;
//   created_at: Date;
// }
// */
