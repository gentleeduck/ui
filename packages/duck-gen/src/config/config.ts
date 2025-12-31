import fs from 'node:fs/promises'
import path from 'node:path'
import { config_schema } from './config.dto'
import {
  ensure_object_at_path as ensureObjectAtPath,
  get_object_at_path as getObjectAtPath,
  parse_value,
  strip_comment as stripComment,
} from './config.libs'

export async function load_duckgen_config(cwd: string = process.cwd()) {
  const config_path = path.resolve(cwd, 'duck-gen.toml')

  let file_text: string
  try {
    file_text = await fs.readFile(config_path, 'utf8')
  } catch (e) {
    throw new Error(`Failed to read duck-gen.toml at: ${config_path}`)
  }

  const lines = file_text.split(/\r?\n/)

  // We'll build the real shape required by Zod
  const config: any = {
    extensions: {},
  }

  // Current object pointer for section writes
  let currentPath: string[] = [] // like ["extensions","shared"]

  for (let i = 0; i < lines.length; i++) {
    const original = lines[i] as string
    const lineNo = i + 1

    const line = stripComment(original).trim()
    if (!line) continue

    // Section header: [extensions.shared]
    if (line.startsWith('[') && line.endsWith(']')) {
      const sectionName = line.slice(1, -1).trim()
      if (!sectionName) {
        throw new Error(`Invalid section header on line ${lineNo}: "${original}"`)
      }

      const parts = sectionName
        .split('.')
        .map((s) => s.trim())
        .filter(Boolean)

      // Only allow sections under extensions.* based on your schema
      if (parts[0] !== 'extensions') {
        throw new Error(`Unsupported section "${sectionName}" on line ${lineNo}. Only [extensions.*] is supported.`)
      }

      currentPath = parts
      ensureObjectAtPath(config, currentPath)
      continue
    }

    // Key/value: key = value
    const eqIndex = line.indexOf('=')
    if (eqIndex === -1) {
      throw new Error(`Invalid config line (missing '=') on line ${lineNo}: "${original}"`)
    }

    const key = line.slice(0, eqIndex).trim()
    const rawValue = line.slice(eqIndex + 1).trim()

    if (!key) {
      throw new Error(`Invalid key on line ${lineNo}: "${original}"`)
    }
    if (!rawValue) {
      throw new Error(`Missing value for "${key}" on line ${lineNo}`)
    }

    const parsedValue = parse_value(rawValue, lineNo)

    if (currentPath.length === 0) {
      // top-level keys like framework = "nestjs"
      config[key] = parsedValue
    } else {
      // write under the current section
      const target = getObjectAtPath(config, currentPath)
      target[key] = parsedValue
    }
  }

  // Validate with Zod and return typed config
  const result = config_schema.safeParse(config)
  if (!result.success) {
    // Make Zod error readable
    const details = result.error.issues
      .map((iss) => {
        const p = iss.path.join('.')
        return p ? `${p}: ${iss.message}` : iss.message
      })
      .join('\n')

    throw new Error(`duck-gen.toml is invalid:\n${details}`)
  }

  return result.data
}
