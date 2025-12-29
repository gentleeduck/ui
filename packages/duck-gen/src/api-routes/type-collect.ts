import path from 'node:path'
import { type Type, ts } from 'ts-morph'
import { isNodeModulesFile, isTsLibFile, relImport } from '../shared/utils'

type CompilerTypeWithId = ts.Type & { id?: number }

type TypeSymbolImportInfo = {
  name: string
  filePath: string
}

function getCompilerTypeId(type: Type): number | undefined {
  return (type.compilerType as CompilerTypeWithId).id
}

function getNamedDeclarationIdentifier(decl: ts.Declaration): string | undefined {
  if (!('name' in decl)) return undefined
  const namedDecl = decl as ts.NamedDeclaration
  if (!namedDecl.name) return undefined
  if (ts.isIdentifier(namedDecl.name)) return namedDecl.name.text
  return undefined
}

// 🦆 Collect all referenced symbols for a type (union/intersection/generics).
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
  return { name, filePath }
}

export function addTypeImport(
  typeImports: Map<string, Set<string>>,
  outFile: string,
  symbolInfo: TypeSymbolImportInfo,
): void {
  const p = relImport(outFile, symbolInfo.filePath)
  if (!typeImports.has(p)) typeImports.set(p, new Set())
  typeImports.get(p)!.add(symbolInfo.name)
}

export function shouldSkipSelfTypeImport(
  symbolInfo: TypeSymbolImportInfo,
  controllerName: string,
  controllerFilePath: string,
): boolean {
  return symbolInfo.name === controllerName && path.resolve(symbolInfo.filePath) === path.resolve(controllerFilePath)
}
