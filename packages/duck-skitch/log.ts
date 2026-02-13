// export const c = {
//   reset: '\x1b[0m',
//   red: '\x1b[31m',
//   green: '\x1b[32m',
//   yellow: '\x1b[33m',
//   blue: '\x1b[34m',
//   magenta: '\x1b[35m',
//   cyan: '\x1b[36m',
//   gray: '\x1b[90m',
//   bold: '\x1b[1m',
//   white: '\x1b[37m',
//   orange: '\x1b[38;5;214m', // slightly lighter orange
// }
//
// export function highlightTS(code: string): string {
//   return (
//     code
//       // 1. Single‐quoted strings -> red
//       //    Using a more robust regex so that the closing ' is always matched,
//       //    even if it’s the last character on the line, and even if the string
//       //    contains escaped quotes like 'I\'m here'.
//       .replace(/(?<=\[\s*|,\s*)'((?:\\.|[^'\\])*)'/g, `'${c.red}$1${c.reset}'`)
//       // Numeric (integers or decimals, optional leading +/−):
//
//       // 2. Double‐quoted strings -> red
//       .replace(/("(?:\\.|[^"\\])*")/g, `${c.red}$1${c.reset}`)
//
//       // 3. Special‐case “table({” -> “table” in blue, “({” in white
//       .replace(/\btable\(\{/g, `${c.blue}table${c.reset}${c.white}({${c.reset}`)
//
//       // 4. “const <identifier>” at the start -> “const” in magenta, identifier in white
//       .replace(/\bconst\s+([A-Za-z_$][\w$]*)\b/g, `${c.magenta}const${c.reset} ${c.white}$1${c.reset}`)
//
//       // 5. “as” -> blue
//       .replace(/\bas\b/g, `${c.blue}as${c.reset}`)
//
//       // 6. Any standalone “const” (e.g. “as const”) -> magenta
//       .replace(/\bconst\b/g, `${c.magenta}const${c.reset}`)
//
//       // 7. Other function‐like calls: foo(bar) -> foo in cyan, bar in green
//       .replace(/\b([a-z_]+)\((.*?)\)/g, (match, fnName, args) => {
//         return `${c.cyan}${fnName}${c.reset}(${c.green}${args}${c.reset})`
//       })
//
//       // 8. Types -> yellow
//       .replace(/\b(uuid|varchar|text|timestamp|integer|jsonb|number|boolean)\b/g, `${c.yellow}$1${c.reset}`)
//
//       // 9. Keywords -> blue
//       .replace(/\b(typeof|default|on_update|on_delete|relation|unique|pk)\b/g, `${c.blue}$1${c.reset}`)
//
//       // 10. |> operator -> white
//       .replace(/\|\>/g, `${c.white}|>${c.reset}`)
//
//       // 11. = operator -> white
//       .replace(/=/g, `${c.white}=${c.reset}`)
//
//       // 12. < and > -> gray
//       .replace(/(<|>)/g, `${c.gray}$1${c.reset}`)
//
//       // 13. Numeric literals -> orange
//       //     This matches any standalone integer (e.g. 0, 42, 123456)
//       .replace(/\b([+-]?\d+(?:\.\d+)?)\b/g, `${c.orange}$1${c.reset}`)
//   )
// }
//
// /**
//  * logCode(name: string, codeBlock: string): void
//  *
//  * Splits “codeBlock” on newlines, runs each line through
//  * highlightTS(...), and prints it with a bold, magenta heading.
//  */
// export function logCode(name: string, codeBlock: string) {
//   console.log(`\n${c.bold}${c.magenta}=== ${name} ===${c.reset}\n`)
//   for (const line of codeBlock.split('\n')) {
//     if (line.trim() === '') {
//       console.log('')
//     } else {
//       console.log(highlightTS(line))
//     }
//   }
//   console.log(`\n${c.reset}`)
// }
//
// // ────────────────────────────────────────────────────────────────────────────
// // Example usage of `logCode(...)` with your two table definitions
// // ────────────────────────────────────────────────────────────────────────────
//
// const giant = `
//       const role = ['admin', 'user'] as const
//       const platform = ['android', 'ios'] as const
//
//       const user = table({
//         id: 'uuid |> unique |> pk |> default(uuidv7)',
//         name: 'varchar(255) |> pk',
//         bio: 'text',
//         role: 'typeof role[number] |> default(user)',
//         platform: 'typeof platform[number] |> default(android)',
//         versions: 'number > 0 < 100',
//         updated_at: 'timestamp |> default(now)',
//         created_at: 'timestamp |> default(now)',
//       })
//
//       const course = table({
//         id: 'uuid |> pk',
//         name: 'varchar(255) |> pk',
//         progress: 'integer > 0 < 100',
//         other_information: 'jsonb',
//         user_id: 'uuid |> pk |> relation((typeof user)["id"]) |> on_update(cascade) |> on_delete(restrict)',
//       })
// `
//
// logCode('Schemas', giant)
// logCode(
//   'Schemas',
//   `
//
// const user = table({
//   id: 'uuid |> unique |> pk |> default(uuidv7)',
//   name: 'varchar(255) |> pk',
//   bio: 'text',
//   role: 'enum("admin", "user") |> default(user)',
//   platform: 'enum("android", "ios") |> default(android)',
//   versions: 'number > 0 < 100',
//   updated_at: 'timestamp |> default(now)',
//   created_at: 'timestamp |> default(now)',
// })
//
// const course = table({
//   id: 'uuid |> pk',
//   name: 'varchar(255) |> pk',
//   progress: 'integer > 0 < 100',
//   other_information: 'jsonb',
//   user_id: 'uuid |> pk |> relation((typeof user)["id"]) |> on_update(cascade) |> on_delete(restrict)',
// })`,
// )
