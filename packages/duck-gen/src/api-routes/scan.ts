import type { ts } from 'ts-morph'
import { getDefaultApiRoutesConfig } from '../core/config'
import type { ApiRoutesConfig } from '../core/types'
import { addTypeImport, collectTypeSymbols, shouldSkipSelfTypeImport, symbolToImportInfo } from './type-collect'
import type { ImportMaps, Route } from './types'
import {
  buildKeyedObjectType,
  getDecoratorFirstStringArg,
  getParamDecoratorKey,
  getTypeText,
  joinUrl,
  mergeTypes,
  pickHttpMethodDecoratorName,
  toHttpMethod,
} from './utils'
import { isNodeModulesFile } from '../shared/utils'
import { getProject } from '../shared/project'

type ScanResult = {
  routes: Route[]
  imports: ImportMaps
  warnings: string[]
}

const YIELD_EVERY = 10

function pushPart(acc: string[], part: string) {
  if (!part) return
  acc.push(part)
}

function shouldSkipFile(sfPath: string): boolean {
  if (sfPath.endsWith('.d.ts')) return true
  if (sfPath.includes('.generated.')) return true
  return false
}

async function yieldToSpinner(counter: { i: number }): Promise<void> {
  counter.i += 1
  if (counter.i % YIELD_EVERY !== 0) return
  await new Promise<void>((resolve) => setImmediate(resolve))
}

// 🦆 Scan the project for NestJS controllers and build the route map.
export async function scanApiRoutes(
  config: ApiRoutesConfig = getDefaultApiRoutesConfig(process.cwd()),
  outFile: string,
): Promise<ScanResult> {
  const resolvedOutFile = outFile
  const project = getProject(config.tsconfigPath, config.sourceGlobs)

  const routes: Route[] = []
  const typeImports = new Map<string, Set<string>>()
  const warnings: string[] = []
  const yieldCounter = { i: 0 }

  const sourceFiles = project.getSourceFiles()
  for (let i = 0; i < sourceFiles.length; i++) {
    await yieldToSpinner(yieldCounter)
    const sf = sourceFiles[i]
    const sfPath = sf.getFilePath()
    if (!config.includeNodeModules && isNodeModulesFile(sfPath)) continue
    if (shouldSkipFile(sfPath)) continue

    const sfText = sf.getFullText()
    if (!sfText.includes('@Controller')) continue

    for (const cls of sf.getClasses()) {
      await yieldToSpinner(yieldCounter)
      const controllerDec = cls.getDecorator('Controller')
      if (!controllerDec) continue

      const controllerPrefix = getDecoratorFirstStringArg(controllerDec)
      if (controllerPrefix === undefined) continue // 🦆 non-literal, skip

      const controllerName = cls.getName()
      if (!controllerName) continue

      addTypeImport(typeImports, resolvedOutFile, { name: controllerName, filePath: sfPath })

      for (const m of cls.getMethods()) {
        await yieldToSpinner(yieldCounter)
        const httpDecName = pickHttpMethodDecoratorName(m)
        if (!httpDecName) continue

        const httpDec = m.getDecorator(httpDecName) ?? undefined
        if (!httpDec) continue

        const methodPath = getDecoratorFirstStringArg(httpDec)
        if (methodPath === undefined) continue // 🦆 non-literal, skip

        const fullPath = joinUrl(config.globalPrefix, controllerPrefix, methodPath)
        const httpMethod = toHttpMethod(httpDecName)

        const bodyParts: string[] = []
        const queryParts: string[] = []
        const paramsParts: string[] = []
        const headersParts: string[] = []

        const symbolsToImport = new Set<ts.Symbol>()

        for (const p of m.getParameters()) {
          await yieldToSpinner(yieldCounter)
          const pTypeText = getTypeText(p, config.normalizeAnyToUnknown)

          for (const d of p.getDecorators()) {
            const decName = d.getName()

            if (decName === 'Body') {
              const key = getParamDecoratorKey(d)
              const part = key ? buildKeyedObjectType(key, pTypeText, 'body') : pTypeText
              pushPart(bodyParts, part)
              collectTypeSymbols(p.getType(), symbolsToImport)
            }

            if (decName === 'Query') {
              const key = getParamDecoratorKey(d)
              const part = key ? buildKeyedObjectType(key, pTypeText, 'query') : pTypeText
              pushPart(queryParts, part)
              collectTypeSymbols(p.getType(), symbolsToImport)
            }

            if (decName === 'Param') {
              const key = getParamDecoratorKey(d)
              const part = key ? buildKeyedObjectType(key, pTypeText, 'params') : pTypeText
              pushPart(paramsParts, part)
              collectTypeSymbols(p.getType(), symbolsToImport)
            }

            if (decName === 'Headers') {
              const key = getParamDecoratorKey(d)
              const part = key ? buildKeyedObjectType(key, pTypeText, 'headers') : pTypeText
              pushPart(headersParts, part)
              collectTypeSymbols(p.getType(), symbolsToImport)
            }
          }
        }

        const returnType = m.getReturnType()
        if (config.normalizeAnyToUnknown && returnType.isAny()) {
          warnings.push(
            `[any-return] ${controllerName}.${m.getName()} at ${sfPath} has return type any. Consider typing the return.`,
          )
        }

        // 🦆 emit type-only imports for referenced symbols
        for (const sym of symbolsToImport) {
          const info = symbolToImportInfo(sym)
          if (!info) continue
          if (shouldSkipSelfTypeImport(info, controllerName, sfPath)) continue
          addTypeImport(typeImports, resolvedOutFile, info)
        }

        const bodyType = mergeTypes(bodyParts)
        const queryType = mergeTypes(queryParts)
        const paramsType = mergeTypes(paramsParts)
        const headersType = mergeTypes(headersParts)

        const resType = `Awaited<ReturnType<${controllerName}['${m.getName()}']>>`

        routes.push({
          bodyType,
          fullPath,
          headersType,
          httpMethod,
          paramsType,
          queryType,
          resType,
        })
      }
    }
  }

  return {
    imports: { typeImports },
    routes,
    warnings,
  }
}
