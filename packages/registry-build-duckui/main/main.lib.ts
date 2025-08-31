import ora, { type Options } from 'ora'
import path from 'node:path'
import fs from 'node:fs/promises'
import { Project } from 'ts-morph'
import { tmpdir } from 'node:os'

// ----------------------------------------------------------------------------
export async function create_temp_source_file(filename: string) {
  const dir = await fs.mkdtemp(path.join(tmpdir(), 'wildduck-'))
  return path.join(dir, filename)
}

export const project = new Project({
  compilerOptions: {},
})

export function fix_import(content: string) {
  const regex = /@\/(.+?)\/((?:.*?\/)?(?:components|ui|hooks|lib))\/([\w-]+)/g

  const replacement = (match: string, path: string, type: string, component: string) => {
    if (type.endsWith('components')) {
      return `@/components/${component}`
    } else if (type.endsWith('ui')) {
      return `@/components/ui/${component}`
    } else if (type.endsWith('hooks')) {
      return `@/hooks/${component}`
    } else if (type.endsWith('lib')) {
      return `@/lib/${component}`
    }

    return match
  }

  return content.replace(regex, replacement)
}

export function spinner(
  text: Options['text'],
  options?: {
    silent?: boolean
  },
) {
  return ora({
    color: 'yellow',
    text,
    isSilent: options?.silent,
  })
}
