import { Node, type Project, type SourceFile, VariableDeclarationKind } from 'ts-morph'
import { spinner } from '..'
import type { DuckGenConfig } from '../config/config.dto'
import { isNodeModulesFile } from '../shared/utils'
import { emitDuckgenMessagesFile } from './messages.emit'
import { parseDuckgenMessagesTag } from './messages.libs'
import type { DuckgenMessageSource } from './messages.types'

export async function scanDuckgenMessages(
  project: Project,
  { shared }: DuckGenConfig['extensions'],
  outFiles: string[],
) {
  if (!outFiles.length) return
  const messages: DuckgenMessageSource[] = []
  const warnings: string[] = []
  const seenConstName = new Map<string, string>()
  const seenGroupKey = new Map<string, string>()

  const sourceFiles = project.getSourceFiles()
  for (let i = 0; i < sourceFiles.length; i++) {
    const sf = sourceFiles[i] as SourceFile
    const sfPath = sf.getFilePath()
    if (!shared.includeNodeModules && isNodeModulesFile(sfPath)) continue
    if (sfPath.endsWith('.d.ts') || sfPath.includes('.generated.')) continue

    const sfText = sf.getFullText()
    if (!sfText.includes('@duckgen')) continue

    for (const stmt of sf.getVariableStatements()) {
      if (!stmt.isExported()) continue
      const tag = parseDuckgenMessagesTag(stmt)
      if (!tag) continue

      if (stmt.getDeclarationKind() !== VariableDeclarationKind.Const) {
        warnings.push(`[duckgen] ${sfPath} has @duckgen messages on non-const declaration.`)
      }

      for (const decl of stmt.getDeclarations()) {
        const nameNode = decl.getNameNode()
        if (!Node.isIdentifier(nameNode)) {
          spinner.warn(`[duckgen] ${sfPath} has @duckgen messages on a non-identifier declaration.`)
          continue
        }

        const constName = nameNode.getText()
        const existingConst = seenConstName.get(constName)
        if (existingConst) {
          spinner.warn(
            `[duckgen] ${sfPath} has duplicate @duckgen message name "${constName}" (already in ${existingConst}). Skipping.`,
          )
          continue
        }

        const groupKey = (tag.groupKey ?? constName).trim()
        const finalGroupKey = groupKey.length > 0 ? groupKey : constName
        const existingGroup = seenGroupKey.get(finalGroupKey)
        if (existingGroup) {
          warnings.push(
            `[duckgen] ${sfPath} has duplicate @duckgen message group "${finalGroupKey}" (already in ${existingGroup}). Skipping.`,
          )
          continue
        }

        seenConstName.set(constName, sfPath)
        seenGroupKey.set(finalGroupKey, sfPath)
        messages.push({ constName, filePath: sfPath, groupKey: finalGroupKey })
      }
    }
  }

  for (const outFile of outFiles) {
    emitDuckgenMessagesFile(outFile, messages)
  }
}
