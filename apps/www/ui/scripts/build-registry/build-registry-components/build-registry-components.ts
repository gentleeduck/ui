import fs from 'fs/promises'
import path from 'path'
import { z } from 'zod'
import { registry_entry_schema, registry_schema } from '@/registry'
import { REGISTRY_INDEX_WHITELIST } from '../main'

export async function build_registry_components(item: z.infer<typeof registry_schema>[0]) {
  if (!REGISTRY_INDEX_WHITELIST.includes(item.type)) {
    return
  }

  let files
  if (item.files) {
    files = await Promise.all(
      item.files.map(async _file => {
        const file =
          typeof _file === 'string'
            ? {
                path: _file,
                type: item.type,
                content: '',
                target: '',
              }
            : _file

        console.log(file)
        // let content: string
        // try {
        //   content = await fs.readFile(path.join(process.cwd(), 'registry', file.path), 'utf8')
        //
        //   // // Only fix imports for v0- blocks.
        //   // if (item.name.startsWith('v0-')) {
        //   //   content = fixImport(content)
        //   // }
        // } catch (error) {
        //   return
        // }
        //
        // const tempFile = await createTempSourceFile(file.path)
        // const sourceFile = project.createSourceFile(tempFile, content, {
        //   scriptKind: ScriptKind.TSX,
        // })
        //
        // sourceFile.getVariableDeclaration('iframeHeight')?.remove()
        // sourceFile.getVariableDeclaration('containerClassName')?.remove()
        // sourceFile.getVariableDeclaration('description')?.remove()
        //
        // let target = file.target
        //
        // if ((!target || target === '') && item.name.startsWith('v0-')) {
        //   const fileName = file.path.split('/').pop()
        //   if (
        //     file.type === 'registry:block' ||
        //     file.type === 'registry:component' ||
        //     file.type === 'registry:example'
        //   ) {
        //     target = `components/${fileName}`
        //   }
        //
        //   if (file.type === 'registry:ui') {
        //     target = `components/ui/${fileName}`
        //   }
        //
        //   if (file.type === 'registry:hook') {
        //     target = `hooks/${fileName}`
        //   }
        //
        //   if (file.type === 'registry:lib') {
        //     target = `lib/${fileName}`
        //   }
        // }
        //
        // return {
        //   path: file.path,
        //   type: file.type,
        //   content: sourceFile.getText(),
        //   target,
        // }
      })
    )
  }

  // const payload = registry_entry_schema
  //   .omit({
  //     source: true,
  //     category: true,
  //     subcategory: true,
  //     chunks: true,
  //   })
  //   .safeParse({
  //     ...item,
  //     files,
  //   })
  //
  // if (payload.success) {
  //   await fs.writeFile(path.join(targetPath, `${item.name}.json`), JSON.stringify(payload.data, null, 2), 'utf8')
  // }
}
