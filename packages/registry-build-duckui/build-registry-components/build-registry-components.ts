import fs from 'node:fs/promises'
import path from 'node:path'
import { create_temp_source_file, project } from '../main'
import { ScriptKind, SourceFile } from 'ts-morph'
import {
  GenTempSourceFilesParams,
  GetFileContentParams,
  GetFileTargetParams,
} from './build-registry-components.types'
import { Logger } from '../logger'

// ----------------------------------------------------------------------------

/**
 * Determines the target path for a given file based on the registry entry type.
 *
 * @param {GetFileTargetParams} params - Parameters containing the registry item and file data.
 * @returns {Promise<string | undefined>} The computed target path or `undefined` if no target is found.
 */
export async function get_file_target({
  item,
  file,
}: GetFileTargetParams): Promise<string | undefined> {
  try {
    let target = file.target

    if (!target || target.trim() === '') {
      const fileName = file.path.split('/').pop()
      if (!fileName) {
        throw new Error('Invalid file path structure.')
      }

      switch (item.type) {
        case 'registry:block':
        case 'registry:component':
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
      }
    }

    Logger.success('File target determined successfully', target)
    return target
  } catch (error) {
    Logger.error(
      `Failed to determine file target: ${
        error instanceof Error ? error.message : String(error)
      }`,
    )
    return undefined
  }
}

// ----------------------------------------------------------------------------

/**
 * Reads the content of a given file from the registry directory.
 *
 * @param {GetFileContentParams} params - Parameters containing the file data.
 * @returns {Promise<string | undefined>} The file content as a string, or undefined if reading fails.
 */
export async function get_file_content({
  file,
}: GetFileContentParams): Promise<string | undefined> {
  try {
    const filePath = path.join(process.cwd(), 'registry', file.path)
    const content = await fs.readFile(filePath, 'utf8')
    Logger.success('File content read successfully', filePath)
    return content
  } catch (error) {
    Logger.error(
      `Failed to read file content: ${error instanceof Error ? error.message : String(error)}`,
    )
    return undefined
  }
}

// ----------------------------------------------------------------------------

/**
 * Generates a temporary TypeScript source file.
 *
 * @param {GenTempSourceFilesParams} params - Parameters including the file data and optional content.
 * @returns {Promise<SourceFile | undefined>} The generated temporary source file, or undefined if processing fails.
 */
export async function gen_temp_source_files({
  file,
  content,
}: GenTempSourceFilesParams): Promise<SourceFile | undefined> {
  try {
    const tempFilePath = await create_temp_source_file(file.path)
    const sourceFile = project.createSourceFile(tempFilePath, content, {
      scriptKind: ScriptKind.TSX,
    })

    // Remove specific variable declarations if they exist
    sourceFile.getVariableDeclaration('iframeHeight')?.remove()
    sourceFile.getVariableDeclaration('containerClassName')?.remove()
    sourceFile.getVariableDeclaration('description')?.remove()

    Logger.success('Temporary source file generated successfully', tempFilePath)
    return sourceFile
  } catch (error) {
    Logger.error(
      `Failed to generate temporary source file: ${error instanceof Error ? error.message : String(error)}`,
    )
    return undefined
  }
}
