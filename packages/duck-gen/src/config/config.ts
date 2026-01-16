import fs from 'node:fs/promises'
import path from 'node:path'
import { config_schema } from './config.dto'

export async function load_duckgen_config(cwd: string = process.cwd()) {
  const config_path = path.resolve(cwd, 'duck-gen.json')

  let file_text: string
  try {
    file_text = await fs.readFile(config_path, 'utf8')
  } catch (e) {
    throw new Error(`Failed to read duck-gen.json at: ${config_path}`)
  }

  let config: unknown
  try {
    config = JSON.parse(file_text)
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    throw new Error(`duck-gen.json contains invalid JSON:\n${message}`)
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

    throw new Error(`duck-gen.json is invalid:\n${details}`)
  }

  return result.data
}
