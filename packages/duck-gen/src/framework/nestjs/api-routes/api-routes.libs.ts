import path from 'node:path'
import { type Decorator, type MethodDeclaration, type Node, SyntaxKind, type Type, ts } from 'ts-morph'
import { formatPropKey, isNodeModulesFile, isTsLibFile, relImport, sanitizeTypeText } from '../../../shared/utils'
import { HTTP_METHOD_BY_DECORATOR, HTTP_METHOD_DECORATORS } from './api-routes.constants'
import type { CompilerTypeWithId, HttpMethod, HttpMethodDecorator, TypeSymbolImportInfo } from './api-routes.types'

export function pushPart(acc: string[], part: string) {
  if (!part) return
  acc.push(part)
}

export function shouldSkipFile(sfPath: string): boolean {
  if (sfPath.endsWith('.d.ts')) return true
  if (sfPath.includes('.generated.')) return true
  return false
}

const TYPE_TEXT_FLAGS =
  ts.TypeFormatFlags.NoTruncation |
  ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope |
  ts.TypeFormatFlags.InTypeAlias

export function getTypeText(node: Node, normalizeAnyToUnknown: boolean): string {
  const t = node.getType()
  if (normalizeAnyToUnknown && t.isAny()) return 'unknown'
  const text = t.getText(node, TYPE_TEXT_FLAGS) || 'unknown'
  return sanitizeTypeText(text)
}

export function mergeTypes(parts: string[]): string {
  const uniq = Array.from(new Set(parts.filter(Boolean)))
  if (uniq.length === 0) return 'never'
  if (uniq.includes('any')) return 'any'
  return uniq.join(' & ')
}

export function pickHttpMethodDecoratorName(method: MethodDeclaration): HttpMethodDecorator | null {
  for (const n of HTTP_METHOD_DECORATORS) {
    const d = method.getDecorator(n)
    if (d) return n
  }
  return null
}

export function toHttpMethod(name: HttpMethodDecorator): HttpMethod {
  // Get -> GET, All -> ALL, etc
  return HTTP_METHOD_BY_DECORATOR[name]
}

export function getParamDecoratorKey(dec: Decorator): string | undefined {
  // For @Query('lang') / @Param('id') / @Headers('x-token') / @Body('user')
  const k = getDecoratorFirstStringArg(dec)
  if (k === undefined) return undefined
  if (k === '') return undefined
  return k
}

export function buildKeyedObjectType(
  key: string,
  valueType: string,
  kind: 'query' | 'headers' | 'body' | 'params',
): string {
  const prop = formatPropKey(key)
  const optional = kind === 'params' ? '' : '?'
  return `{ ${prop}${optional}: ${valueType} }`
}

export function joinUrl(...parts: Array<string | undefined>): string {
  const s = parts
    .filter((p) => p !== undefined)
    .map((p) => (p ?? '').trim())
    .filter((p) => p.length > 0)
    .map((p) => (p.startsWith('/') ? p : '/' + p))
    .join('')
  return s.replace(/\/+/g, '/')
}

export function getDecoratorFirstStringArg(dec: Decorator): string | undefined {
  const call = dec.getCallExpression()
  if (!call) return undefined
  const args = call.getArguments()
  if (args.length === 0) return ''
  const first = args[0]
  if (first && first.getKind() === SyntaxKind.StringLiteral) return first.getText().slice(1, -1)
  return undefined
}

export function getCompilerTypeId(type: Type): number | undefined {
  return (type.compilerType as CompilerTypeWithId).id
}

export function getNamedDeclarationIdentifier(decl: ts.Declaration): string | undefined {
  if (!('name' in decl)) return undefined
  const namedDecl = decl as ts.NamedDeclaration
  if (!namedDecl.name) return undefined
  if (ts.isIdentifier(namedDecl.name)) return namedDecl.name.text
  return undefined
}

export function addTypeImportSource(
  typeImportSources: Map<string, Set<string>>,
  symbolInfo: TypeSymbolImportInfo,
): void {
  const p = path.resolve(symbolInfo.filePath)
  if (!typeImportSources.has(p)) typeImportSources.set(p, new Set())
  typeImportSources.get(p)!.add(symbolInfo.name)
}

export function resolveTypeImports(
  typeImportSources: Map<string, Set<string>>,
  outFile: string,
): Map<string, Set<string>> {
  const typeImports = new Map<string, Set<string>>()
  for (const [filePath, names] of typeImportSources) {
    const p = relImport(outFile, filePath)
    if (!typeImports.has(p)) typeImports.set(p, new Set())
    const dest = typeImports.get(p)!
    for (const name of names) dest.add(name)
  }
  return typeImports
}

export function shouldSkipSelfTypeImport(
  symbolInfo: TypeSymbolImportInfo,
  controllerName: string,
  controllerFilePath: string,
): boolean {
  return symbolInfo.name === controllerName && path.resolve(symbolInfo.filePath) === path.resolve(controllerFilePath)
}

export function doc(lines: string[]): string[] {
  return ['/** 🦆', ...lines.map((l) => ` * 🦆 ${l}`), ' */']
}

// 🦆 Collect all referenced symbols for a type (union/intersection/generics/properties).
export function collectTypeSymbols(t: Type, out: Set<ts.Symbol>): void {
  const seen = new Set<number>()

  const visit = (ty: Type) => {
    const id = getCompilerTypeId(ty)
    if (typeof id === 'number') {
      if (seen.has(id)) return
      seen.add(id)
    }

    const symbol = ty.getAliasSymbol() ?? ty.getSymbol()
    if (symbol) out.add(symbol.compilerSymbol)

    for (const u of ty.getUnionTypes()) visit(u)
    for (const i of ty.getIntersectionTypes()) visit(i)
    for (const arg of ty.getTypeArguments()) visit(arg)

    // Traverse array element types
    const elementType = ty.getArrayElementType()
    if (elementType) visit(elementType)

    // Traverse object property types so getText() references have imports
    for (const prop of ty.getProperties()) {
      const decls = prop.getDeclarations()
      const decl = decls[0]
      if (decl) {
        try {
          const propType = prop.getTypeAtLocation(decl)
          visit(propType)
        } catch {
          // skip properties whose type can't be resolved
        }
      }
    }

    const apparent = ty.getApparentType()
    if (apparent !== ty) visit(apparent)
  }

  visit(t)
}

// 🦆 Convert a compiler symbol to import info (if applicable).
export function symbolToImportInfo(sym: ts.Symbol): TypeSymbolImportInfo | null {
  const decls = sym.getDeclarations() ?? []
  const decl = decls.find(Boolean)
  if (!decl) return null

  const sf = decl.getSourceFile()
  const filePath = sf.fileName

  if (isNodeModulesFile(filePath) || isTsLibFile(filePath)) return null

  // 🦆 handle "default" symbol name when possible
  let name = sym.getName()
  if (name === 'default') {
    const declName = getNamedDeclarationIdentifier(decl)
    if (typeof declName === 'string' && declName.length > 0) name = declName
    else return null
  }

  if (!name || name === '__type' || name === '__object') return null
  return { filePath, name }
}
