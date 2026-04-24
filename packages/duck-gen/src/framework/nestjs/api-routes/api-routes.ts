import type { Project, SourceFile, ts } from 'ts-morph'
import { spinner } from '../../..'
import type { DuckGenConfig } from '../../../config/config.dto'
import { isNodeModulesFile } from '../../../shared/utils'
import { emitApiRoutesFile } from './api-routes.emit'
import {
  addTypeImportSource,
  buildKeyedObjectType,
  collectTypeSymbols,
  getDecoratorFirstStringArg,
  getParamDecoratorKey,
  getTypeText,
  joinUrl,
  mergeTypes,
  pickHttpMethodDecoratorName,
  pushPart,
  resolveTypeImports,
  shouldSkipFile,
  shouldSkipSelfTypeImport,
  symbolToImportInfo,
  toHttpMethod,
} from './api-routes.libs'
import type { Route } from './api-routes.types'
import { expandType } from './type-expander'

export async function processNestJsApiRoutes(
  project: Project,
  { shared, apiRoutes }: DuckGenConfig['extensions'],
  outFiles: string[],
) {
  if (!outFiles.length) return
  const routes: Route[] = []
  const typeImportSources = new Map<string, Set<string>>()

  const sourceFiles = project.getSourceFiles()
  for (let i = 0; i < sourceFiles.length; i++) {
    const sf = sourceFiles[i] as SourceFile
    const sfPath = sf.getFilePath()

    if (!shared.includeNodeModules && isNodeModulesFile(sfPath)) continue
    if (shouldSkipFile(sfPath)) continue

    const sfText = sf.getFullText()
    if (!sfText.includes('@Controller')) continue

    for (const cls of sf.getClasses()) {
      const controllerDec = cls.getDecorator('Controller')
      if (!controllerDec) continue

      const controllerPrefix = getDecoratorFirstStringArg(controllerDec)
      if (controllerPrefix === undefined) continue

      for (const m of cls.getMethods()) {
        const httpDecName = pickHttpMethodDecoratorName(m)
        if (!httpDecName) continue

        const httpDec = m.getDecorator(httpDecName) ?? undefined
        if (!httpDec) continue

        const methodPath = getDecoratorFirstStringArg(httpDec)
        if (methodPath === undefined) continue

        const fullPath = joinUrl(apiRoutes.globalPrefix, controllerPrefix, methodPath)
        const httpMethod = toHttpMethod(httpDecName)

        const bodyParts: string[] = []
        const queryParts: string[] = []
        const paramsParts: string[] = []
        const headersParts: string[] = []

        const symbolsToImport = new Set<ts.Symbol>()

        // Request types
        for (const p of m.getParameters()) {
          const pTypeText = getTypeText(p, apiRoutes.normalizeAnyToUnknown)

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

        // Return type (emit the inner awaited type, not Promise<T>)
        const returnType = m.getReturnType()
        if (apiRoutes.normalizeAnyToUnknown && returnType.isAny()) {
          spinner.warn(`[any-return] ${cls.getName() ?? 'Controller'}.${m.getName()} at ${sfPath} is any`)
        }

        const awaited = returnType.getAwaitedType() ?? returnType
        const expanded = awaited.getApparentType()

        // include return type symbols so the generated file has the imports it needs
        collectTypeSymbols(expanded, symbolsToImport)

        // emit type-only imports for all referenced symbols (params + return)
        for (const sym of symbolsToImport) {
          const info = symbolToImportInfo(sym)
          if (!info) continue
          if (shouldSkipSelfTypeImport(info, cls.getName() ?? '', sfPath)) continue
          addTypeImportSource(typeImportSources, info)
        }

        const bodyType = mergeTypes(bodyParts)
        const queryType = mergeTypes(queryParts)
        const paramsType = mergeTypes(paramsParts)
        const headersType = mergeTypes(headersParts)

        const resType = expandType(expanded, m, {
          normalizeAnyToUnknown: apiRoutes.normalizeAnyToUnknown,
        })

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

  for (const outFile of outFiles) {
    const typeImports = resolveTypeImports(typeImportSources, outFile)
    emitApiRoutesFile(outFile, routes, { typeImports })
  }
}
