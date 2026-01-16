import fs from 'node:fs'
import path from 'node:path'
import { doc, formatPropKey, relImport, sortMap } from '../shared/utils'
import type { DuckgenMessageSource } from './messages.types'

export function emitDuckgenMessagesFile(outFile: string, messages: DuckgenMessageSource[]) {
  let out = `// 🦆 THIS FILE IS AUTO-GENERATED. DO NOT EDIT.\n\n`

  // Collect imports for message consts (arrays or objects).
  const valueImports = new Map<string, Set<string>>()
  for (const msg of messages) {
    const p = relImport(outFile, msg.filePath)
    if (!valueImports.has(p)) valueImports.set(p, new Set())
    valueImports.get(p)!.add(msg.constName)
  }

  for (const [p, names] of sortMap(valueImports)) {
    out += `import { ${Array.from(names).sort().join(', ')} } from '${p}'\n`
  }

  const sorted = [...messages].sort((a, b) => a.groupKey.localeCompare(b.groupKey))
  out += '\n'

  out += doc([
    'Duckgen message registry.',
    '',
    'Each group key points to either a const string array OR a const object record.',
    'Use the types below to build i18n dictionaries aligned with those sources.',
  ])

  out += `export type DuckgenMessageSources = {\n`
  for (const msg of sorted) {
    out += `  ${formatPropKey(msg.groupKey)}: typeof ${msg.constName},\n`
  }
  out += `}\n\n`

  out += doc(['All message group keys (for example: "auth", "users", "errors").'])
  out += `export type DuckgenMessageGroup = keyof DuckgenMessageSources\n\n`

  out += doc([
    'Message key union for a specific group.',
    'Supports both array sources (values) and object sources (keys).',
    'If G is omitted, the result is the union of all message keys across all groups.',
  ])
  out += `export type DuckgenMessageKey<G extends DuckgenMessageGroup = DuckgenMessageGroup> =\n`
  out += `  DuckgenMessageSources[G] extends readonly (infer V)[]\n`
  out += `    ? V & string\n`
  out += `    : keyof DuckgenMessageSources[G] & string\n\n`

  out += doc(['Dictionary shape for a single group.', 'Keys are enforced by DuckgenMessageKey<G>.'])
  out += `export type DuckgenMessageDictionary<G extends DuckgenMessageGroup = DuckgenMessageGroup> =\n`
  out += `  Record<DuckgenMessageKey<G>, string>\n\n`

  out += doc(['All groups mapped to their dictionaries.'])
  out += `export type DuckgenMessageDictionaryByGroup = {\n`
  out += `  [G in DuckgenMessageGroup]: DuckgenMessageDictionary<G>\n`
  out += `}\n\n`

  out += doc(['Alias: language -> all group dictionaries.'])
  out += `export type DuckGenI18nMessages = DuckgenMessageDictionaryByGroup\n\n`

  out += doc([
    'Language -> dictionary for a subset of groups (or all groups if G is omitted).',
    'Useful when you want a module-scoped i18n object.',
  ])
  out += `export type DuckgenI18n<Lang extends string, G extends DuckgenMessageGroup = DuckgenMessageGroup> =\n`
  out += `  Record<Lang, DuckgenMessageDictionary<G>>\n\n`

  out += doc(['Language -> all groups. This is the common top-level i18n shape.'])
  out += `export type DuckgenI18nByGroup<Lang extends string> =\n`
  out += `  Record<Lang, DuckGenI18nMessages>\n\n`

  out += doc([
    'Language -> scope -> messages.',
    '',
    'Two modes:',
    '1) If ScopeOrMessages is a string scope name (example: "server"), the inner value is Messages.',
    '2) If ScopeOrMessages is already a messages type, it becomes the inner value and scope keys become string.',
  ])
  out += `export type DuckgenScopedI18nByGroup<\n`
  out += `  Lang extends string,\n`
  out += `  ScopeOrMessages extends string | DuckGenI18nMessages = DuckGenI18nMessages,\n`
  out += `  Messages extends DuckGenI18nMessages = DuckGenI18nMessages,\n`
  out += `> = ScopeOrMessages extends string\n`
  out += `  ? Record<Lang, Record<ScopeOrMessages, Messages>>\n`
  out += `  : Record<Lang, Record<string, ScopeOrMessages>>\n\n`

  for (const msg of sorted) {
    out += doc([`Convenience alias for the "${msg.groupKey}" group dictionary.`])
    out += `export type ${msg.constName}Dictionary = DuckgenMessageDictionary<${JSON.stringify(msg.groupKey)}>\n`
  }

  fs.mkdirSync(path.dirname(outFile), { recursive: true })
  fs.writeFileSync(outFile, out, 'utf8')
}
