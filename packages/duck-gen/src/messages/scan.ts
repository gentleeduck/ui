import { Node, VariableDeclarationKind } from 'ts-morph'
import { getDefaultMessagesConfig } from '../core/config'
import type { MessagesConfig } from '../core/types'
import type { DuckgenMessageSource } from './types'
import { isNodeModulesFile } from '../shared/utils'
import { parseDuckgenMessagesTag } from './tag'
import { getProject } from '../shared/project'

export type ScanMessagesResult = {
  messages: DuckgenMessageSource[]
  warnings: string[]
}

const YIELD_EVERY = 10

async function yieldToSpinner(counter: { i: number }): Promise<void> {
  counter.i += 1
  if (counter.i % YIELD_EVERY !== 0) return
  await new Promise<void>((resolve) => setImmediate(resolve))
}

// 🦆 Scan all source files for exported const arrays tagged with @duckgen.
export async function scanDuckgenMessages(
  config: MessagesConfig = getDefaultMessagesConfig(process.cwd()),
): Promise<ScanMessagesResult> {
  const project = getProject(config.tsconfigPath, config.sourceGlobs)
  const messages: DuckgenMessageSource[] = []
  const warnings: string[] = []
  const seenConstName = new Map<string, string>()
  const seenGroupKey = new Map<string, string>()
  const yieldCounter = { i: 0 }

  const sourceFiles = project.getSourceFiles()
  for (let i = 0; i < sourceFiles.length; i++) {
    await yieldToSpinner(yieldCounter)
    const sf = sourceFiles[i]
    const sfPath = sf.getFilePath()
    if (!config.includeNodeModules && isNodeModulesFile(sfPath)) continue
    if (sfPath.endsWith('.d.ts') || sfPath.includes('.generated.')) continue

    const sfText = sf.getFullText()
    if (!sfText.includes('@duckgen')) continue

    for (const stmt of sf.getVariableStatements()) {
      await yieldToSpinner(yieldCounter)
      if (!stmt.isExported()) continue
      const tag = parseDuckgenMessagesTag(stmt)
      if (!tag) continue

      if (stmt.getDeclarationKind() !== VariableDeclarationKind.Const) {
        warnings.push(`[duckgen] ${sfPath} has @duckgen messages on non-const declaration.`)
      }

      for (const decl of stmt.getDeclarations()) {
        const nameNode = decl.getNameNode()
        if (!Node.isIdentifier(nameNode)) {
          warnings.push(`[duckgen] ${sfPath} has @duckgen messages on a non-identifier declaration.`)
          continue
        }

        const constName = nameNode.getText()
        const existingConst = seenConstName.get(constName)
        if (existingConst) {
          warnings.push(
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

  return { messages, warnings }
}
