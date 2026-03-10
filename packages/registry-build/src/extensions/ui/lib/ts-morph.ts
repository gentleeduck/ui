import path from 'node:path'
import { type Project, ScriptKind } from 'ts-morph'

/** Remove named variable declarations from source content using ts-morph. */
export function stripSourceVariables(options: {
  content: string
  filePath: string
  project: Project
  stripVariables: string[]
}) {
  const sourceFile = options.project.createSourceFile(path.join('/virtual', options.filePath), options.content, {
    overwrite: true,
    scriptKind: ScriptKind.TSX,
  })

  for (const variableName of options.stripVariables) {
    sourceFile.getVariableDeclaration(variableName)?.remove()
  }

  const transformed = sourceFile.getText()
  sourceFile.forget()

  return transformed
}
