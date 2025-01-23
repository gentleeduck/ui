import fs from 'fs/promises'
import path from 'path'
import { z } from 'zod'
import { registry_entry_schema, registry_item_file_schema } from '@/registry'
import { create_temp_source_file, project } from '../main'
import { ScriptKind, SourceFile } from 'ts-morph'

// ----------------------------------------------------------------------------
export async function get_file_target(
  item: z.infer<typeof registry_entry_schema>,
  _file: z.infer<typeof registry_item_file_schema>
): Promise<string | undefined> {
  let target = _file.target

  // if ((!target || target === '') && item.name.startsWith('v0-')) {
  //   const fileName = _file.path.split('/').pop()
  //   if (
  //     item.type === 'registry:block' ||
  //     item.type === 'registry:component' ||
  //     item.type === 'registry:example'
  //   ) {
  //     target = `components/${fileName}`
  //   }
  //
  //   if (item.type === 'registry:ui') {
  //     console.log(_file)
  //     target = `components/ui/${fileName}`
  //   }
  //
  //   if (item.type === 'registry:hook') {
  //     target = `hooks/${fileName}`
  //   }
  //
  //   if (item.type === 'registry:lib') {
  //     target = `lib/${fileName}`
  //   }
  // }

  return target
}

// ----------------------------------------------------------------------------
export async function get_file_content(_file: z.infer<typeof registry_item_file_schema>): Promise<string> {
  try {
    let content = await fs.readFile(path.join(process.cwd(), 'registry', _file.path), 'utf8')

    // // Only fix imports for v0- blocks.
    // if (item.name.startsWith('v0-')) {
    //   content = fixImport(content)
    // }

    return content
  } catch (error) {
    return ''
  }
}

// ----------------------------------------------------------------------------
export async function gen_temp_source_files(
  _file: z.infer<typeof registry_item_file_schema>,
  content: string
): Promise<SourceFile> {
  const temp_file = await create_temp_source_file(_file.path)
  const source_file = project.createSourceFile(temp_file, content, {
    scriptKind: ScriptKind.TSX,
  })

  source_file.getVariableDeclaration('iframeHeight')?.remove()
  source_file.getVariableDeclaration('containerClassName')?.remove()
  source_file.getVariableDeclaration('description')?.remove()

  return source_file
}
