import { type Node, Symbol, SyntaxKind, type Type, TypeFormatFlags, ts } from 'ts-morph'

export interface ExpandTypeOptions {
  normalizeAnyToUnknown?: boolean
}

const DISPLAY_TYPE_FLAGS = TypeFormatFlags.NoTruncation | TypeFormatFlags.UseAliasDefinedOutsideCurrentScope

function isArrayLikeSymbol(symbol?: Symbol): boolean {
  const name = symbol?.getName()
  return name === 'Array' || name === 'ReadonlyArray' || name === 'ArrayLike'
}

function looksLikeArrayText(text: string): boolean {
  return (
    text.endsWith('[]') ||
    text.startsWith('Array<') ||
    text.startsWith('ReadonlyArray<') ||
    text.startsWith('ArrayLike<')
  )
}

function looksLikeArrayByProps(type: Type): boolean {
  const names = new Set(type.getProperties().map((prop) => prop.getName()))
  if (!names.has('length')) return false

  if (names.has('push') || names.has('pop')) return true
  if (names.has('map') && names.has('filter')) return true
  if (names.has('concat') && names.has('slice')) return true

  return false
}

function isArrayLikeType(type: Type, symbol?: Symbol, node?: Node): boolean {
  if (type.isArray() || type.isReadonlyArray() || type.isTuple()) return true

  const targetSymbol = type.getTargetType()?.getSymbol()
  if (isArrayLikeSymbol(symbol) || isArrayLikeSymbol(targetSymbol)) return true

  const numberIndex = type.getNumberIndexType()
  if (numberIndex) {
    // Avoid expanding array-like structures into method/property lists.
    if (type.getProperty('length')) return true
  }

  if (looksLikeArrayText(type.getText(node, DISPLAY_TYPE_FLAGS))) return true
  if (looksLikeArrayByProps(type)) return true

  return false
}

export function expandType(
  type: Type,
  node?: Node,
  options: ExpandTypeOptions = {},
  seen = new Map<string, string>(),
): string {
  if (type.isString()) return 'string'
  if (type.isNumber()) return 'number'
  if (type.isBoolean()) return 'boolean'
  if (type.isNull()) return 'null'
  if (type.isUndefined()) return 'undefined'

  if (type.isAny()) {
    return options.normalizeAnyToUnknown ? 'unknown' : 'any'
  }
  if (type.isUnknown()) return 'unknown'
  if (type.isVoid()) return 'void'

  const symbol = type.getAliasSymbol() || type.getSymbol()
  if (symbol && symbol.getName() === 'Date') {
    return 'Date'
  }

  const typeText = type.getText(node, TypeFormatFlags.UseFullyQualifiedType | TypeFormatFlags.NoTruncation)
  if (seen.has(typeText)) {
    return typeText
  }

  if (isArrayLikeType(type, symbol, node)) {
    return type.getText(node, DISPLAY_TYPE_FLAGS)
  }

  if (type.isUnion()) {
    const parts = type.getUnionTypes().map((t) => expandType(t, node, options, seen))
    return Array.from(new Set(parts)).join(' | ')
  }

  if (type.isObject() || type.isIntersection()) {
    const symName = symbol?.getName()

    if (symName === 'Promise') {
      const args = type.getTypeArguments()
      if (args.length > 0) return expandType(args[0], node, options, seen)
      return options.normalizeAnyToUnknown ? 'Promise<unknown>' : 'Promise<any>'
    }

    if (symName === 'Buffer' || symName === 'Function') {
      return symName
    }

    if (type.isTuple()) {
      const elements = type.getTupleElements()
      const expanded = elements.map((t) => expandType(t, node, options, seen))
      return `[${expanded.join(', ')}]`
    }

    const newSeen = new Map(seen)
    newSeen.set(typeText, typeText)

    const props = type.getProperties()
    if (props.length === 0) {
      const text = type.getText(node, TypeFormatFlags.NoTruncation)
      if (text === '{}') return '{}'
      return text
    }

    const lines: string[] = []
    for (const prop of props) {
      const valDeclaration = prop.getValueDeclaration()
      if (
        valDeclaration &&
        (valDeclaration.getKind() === SyntaxKind.MethodDeclaration ||
          valDeclaration.getKind() === SyntaxKind.MethodSignature)
      ) {
        continue
      }

      if (prop.getName().startsWith('__')) continue

      const name = prop.getName()

      if (
        [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor',
        ].includes(name)
      ) {
        continue
      }

      let propType: Type | undefined
      if (node) {
        propType = prop.getTypeAtLocation(node)
      }

      if (!propType) {
        lines.push(`${name}: any`)
        continue
      }

      const isOptional = (prop.getFlags() & ts.SymbolFlags.Optional) !== 0
      const q = isOptional ? '?' : ''

      if (isOptional && propType.isUnion()) {
        const unionTypes = propType.getUnionTypes().filter((t) => !t.isUndefined())
        if (unionTypes.length === 1) {
          propType = unionTypes[0]
        } else {
          const expandedParts = unionTypes.map((t) => expandType(t, node, options, newSeen))
          const joined = Array.from(new Set(expandedParts)).join(' | ')
          lines.push(`${name}${q}: ${joined}`)
          continue
        }
      }

      const expandedPropType = expandType(propType, node, options, newSeen)
      lines.push(`${name}${q}: ${expandedPropType}`)
    }

    if (lines.length === 0) return '{}'
    return `{ ${lines.join('; ')} }`
  }

  return type.getText(node, TypeFormatFlags.NoTruncation | TypeFormatFlags.UseFullyQualifiedType)
}
