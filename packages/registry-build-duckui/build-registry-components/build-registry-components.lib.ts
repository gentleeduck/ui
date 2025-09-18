import fs from 'node:fs/promises'
import path from 'node:path'
import { ScriptKind, SourceFile } from 'ts-morph'
import { create_temp_source_file, ENV, project } from '../main'
import { GenTempSourceFilesParams, GetFileContentParams, GetFileTargetParams } from './build-registry-components.types'

// ----------------------------------------------------------------------------

/**
 * Determines the target path for a given file based on the registry entry type.
 */
export async function get_file_target({ item, file, spinner }: GetFileTargetParams): Promise<string | undefined> {
  try {
    let target = file.target
    spinner.text = `🧭 Determining file target: ${target}`

    if (!target || target.trim() === '') {
      const fileName = file.path.split('/').pop()
      if (!fileName) {
        spinner.fail('Invalid file path structure.')
        process.exit(0)
      }

      switch (item.type) {
        case 'registry:block':
        case 'registry:example':
          target = `components/${fileName}`
          break
        case 'registry:ui':
          target = `components/ui/${fileName}`
          break
        case 'registry:hook':
          target = `hooks/${fileName}`
          break
        case 'registry:lib':
          target = `lib/${fileName}`
          break
        default:
          break
      }
    }

    spinner.text = `File target determined successfully: ${target}`
    return target
  } catch (error) {
    spinner.fail(`Failed to determine file target: ${error instanceof Error ? error.message : String(error)}`)
    process.exit(1)
  }
}

// ----------------------------------------------------------------------------

/**
 * Reads the content of a given file from the registry directory.
 */
export async function get_file_content({ file, spinner }: GetFileContentParams): Promise<string | undefined> {
  try {
    const filePath = path.join(
      process.cwd(),
      `../${file.type.includes('ui') ? ENV.REGISTRY_UI_PATH : file.type.includes('example') ? ENV.REGISTRY_EXAMPLES_PATH : ENV.REGISTRY_BLOCKS_PATH}/${file.path}`,
    )
    spinner.text = `🧭 Reading file content: ${filePath}`
    const content = await fs.readFile(filePath, 'utf8')
    spinner.text = `File content read successfully: ${filePath}`

    return content
  } catch (error) {
    spinner.fail(`Failed to read file content: ${error instanceof Error ? error.message : String(error)}`)
    process.exit(1)
  }
}

// ----------------------------------------------------------------------------

/**
 * Generates a temporary TypeScript source file.
 */
export async function gen_temp_source_files({
  file,
  content,
  spinner,
}: GenTempSourceFilesParams): Promise<SourceFile | undefined> {
  try {
    const tempFilePath = await create_temp_source_file(file.path)
    spinner.text = `🧭 Generating temporary source file: ${tempFilePath}`
    const sourceFile = project.createSourceFile(tempFilePath, content, {
      scriptKind: ScriptKind.TSX,
    })

    // Remove specific variable declarations if they exist
    sourceFile.getVariableDeclaration('iframeHeight')?.remove()
    sourceFile.getVariableDeclaration('containerClassName')?.remove()
    sourceFile.getVariableDeclaration('description')?.remove()

    spinner.text = `🧭 Temporary source file generated successfully: ${tempFilePath}`
    return sourceFile
  } catch (error) {
    spinner.fail(`Failed to generate temporary source file: ${error instanceof Error ? error.message : String(error)}`)
    process.exit(1)
  }
}
