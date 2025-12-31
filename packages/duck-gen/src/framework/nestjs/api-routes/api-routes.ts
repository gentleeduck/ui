import type { Project, SourceFile, ts } from 'ts-morph'
import { spinner } from '../../..'
import type { DuckGenConfig } from '../../../config/config.dto'
import { isNodeModulesFile } from '../../../shared/utils'
import { emitApiRoutesFile } from './api-routes.emit'
import {
  addTypeImport,
  buildKeyedObjectType,
  collectTypeSymbols,
  getDecoratorFirstStringArg,
  getParamDecoratorKey,
  getTypeText,
  joinUrl,
  mergeTypes,
  pickHttpMethodDecoratorName,
  pushPart,
  shouldSkipFile,
  shouldSkipSelfTypeImport,
  symbolToImportInfo,
  toHttpMethod,
} from './api-routes.libs'
import type { Route } from './api-routes.types'

export async function processNestJsApiRoutes(
  project: Project,
  { shared, apiRoutes: apiRoutes }: DuckGenConfig['extensions'],
  outFile: string,
) {
  const routes: Route[] = []
  const typeImports = new Map<string, Set<string>>()

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
      if (controllerPrefix === undefined) continue // 🦆 non-literal, skip

      const controllerName = cls.getName()
      if (!controllerName) continue

      addTypeImport(typeImports, outFile, { filePath: sfPath, name: controllerName })

      for (const m of cls.getMethods()) {
        const httpDecName = pickHttpMethodDecoratorName(m)
        if (!httpDecName) continue

        const httpDec = m.getDecorator(httpDecName) ?? undefined
        if (!httpDec) continue

        const methodPath = getDecoratorFirstStringArg(httpDec)
        if (methodPath === undefined) continue // 🦆 non-literal, skip

        const fullPath = joinUrl(apiRoutes.globalPrefix, controllerPrefix, methodPath)
        const httpMethod = toHttpMethod(httpDecName)

        const bodyParts: string[] = []
        const queryParts: string[] = []
        const paramsParts: string[] = []
        const headersParts: string[] = []

        const symbolsToImport = new Set<ts.Symbol>()

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

        const returnType = m.getReturnType()
        if (apiRoutes.normalizeAnyToUnknown && returnType.isAny()) {
          spinner.warn(
            `[any-return] ${controllerName}.${m.getName()} at ${sfPath} has return type any. Consider typing the return.`,
          )
        }

        // 🦆 emit type-only imports for referenced symbols
        for (const sym of symbolsToImport) {
          const info = symbolToImportInfo(sym)
          if (!info) continue
          if (shouldSkipSelfTypeImport(info, controllerName, sfPath)) continue
          addTypeImport(typeImports, outFile, info)
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

  emitApiRoutesFile(outFile, routes, { typeImports })
}
