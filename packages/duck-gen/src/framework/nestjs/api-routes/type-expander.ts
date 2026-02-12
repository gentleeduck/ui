import { type Node, type Symbol, SyntaxKind, type Type, TypeFormatFlags, ts } from 'ts-morph'
import { sanitizeTypeText } from '../../../shared/utils'

export interface ExpandTypeOptions {
  normalizeAnyToUnknown?: boolean
}

const DISPLAY_TYPE_FLAGS = TypeFormatFlags.NoTruncation | TypeFormatFlags.UseAliasDefinedOutsideCurrentScope

function inferColumnDataTypeText(prop: Symbol): string | undefined {
  const decl = prop.getValueDeclaration() ?? prop.getDeclarations()[0]
  if (!decl) return undefined
  if (decl.getKind() !== SyntaxKind.PropertyAssignment) return undefined

  const init = decl.getInitializer()
  if (!init) return undefined

  const initType = init.getType()
  const typeArgs = initType.getTypeArguments()
  if (!typeArgs.length) return undefined

  const config = typeArgs[0]
  const dataProp = config.getProperty('data')
  if (!dataProp) return undefined

  const dataType = dataProp.getTypeAtLocation(init)
  let text = dataType.getText(init, DISPLAY_TYPE_FLAGS)

  const notNullProp = config.getProperty('notNull')
  if (notNullProp) {
    const notNullType = notNullProp.getTypeAtLocation(init)
    const notNullText = notNullType.getText(init, DISPLAY_TYPE_FLAGS)
    if (notNullText === 'false' && !text.includes('null')) {
      text = `${text} | null`
    }
  }

  return text
}

function expandInferReturning(
  type: Type,
  node: Node | undefined,
  options: ExpandTypeOptions,
  seen: Map<string, string>,
): string | undefined {
  const alias = type.getAliasSymbol()
  if (!alias || alias.getName() !== 'InferReturning') return undefined

  const args = type.getAliasTypeArguments()
  const shape = args[0]
  if (!shape) return undefined

  const props = shape.getProperties()
  if (props.length === 0) return '{}'

  const lines: string[] = []
  for (const prop of props) {
    const name = prop.getName()
    if (name.startsWith('__')) continue

    const isOptional = (prop.getFlags() & ts.SymbolFlags.Optional) !== 0
    const q = isOptional ? '?' : ''

    let inferredText = inferColumnDataTypeText(prop)

    if (!inferredText) {
      let propType: Type | undefined
      if (node) {
        propType = prop.getTypeAtLocation(node)
      }
      if (!propType) {
        const decl = prop.getValueDeclaration() ?? prop.getDeclarations()[0]
        if (decl) propType = prop.getTypeAtLocation(decl)
      }

      if (!propType) {
        lines.push(`${name}${q}: any`)
        continue
      }

      inferredText = expandType(propType, node, options, new Map(seen))
    }

    lines.push(`${name}${q}: ${inferredText}`)
  }

  if (lines.length === 0) return '{}'
  return `{ ${lines.join('; ')} }`
}

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
  const inferredReturning = expandInferReturning(type, node, options, seen)
  if (inferredReturning) return inferredReturning

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

  if (type.isStringLiteral()) return type.getText()
  if (type.isNumberLiteral()) return type.getText()
  if (type.isBooleanLiteral()) return type.getText()
  if (type.isEnumLiteral()) return sanitizeTypeText(type.getText())

  const symbol = type.getAliasSymbol() || type.getSymbol()
  if (symbol && symbol.getName() === 'Date') {
    return 'Date'
  }

  const typeText = sanitizeTypeText(type.getText(node, TypeFormatFlags.NoTruncation))
  if (seen.has(typeText)) {
    return typeText
  }

  if (isArrayLikeType(type, symbol, node)) {
    if (type.isTuple()) {
      const elements = type.getTupleElements()
      const expanded = elements.map((t) => expandType(t, node, options, seen))
      return `[${expanded.join(', ')}]`
    }

    const elementType = type.getArrayElementType()
    if (elementType) {
      const expanded = expandType(elementType, node, options, seen)
      const needsParens = expanded.includes(' | ') || expanded.includes(' & ')
      const readonlyPrefix = type.isReadonlyArray() ? 'readonly ' : ''
      return needsParens ? `${readonlyPrefix}(${expanded})[]` : `${readonlyPrefix}${expanded}[]`
    }

    return sanitizeTypeText(type.getText(node, DISPLAY_TYPE_FLAGS))
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

    const newSeen = new Map(seen)
    newSeen.set(typeText, typeText)

    const props = type.getProperties()
    if (props.length === 0) {
      const stringIndex = type.getStringIndexType()
      const numberIndex = type.getNumberIndexType()
      if (stringIndex) {
        const expanded = expandType(stringIndex, node, options, newSeen)
        return `{ [key: string]: ${expanded} }`
      }
      if (numberIndex) {
        const expanded = expandType(numberIndex, node, options, newSeen)
        return `{ [key: number]: ${expanded} }`
      }
      const text = type.getText(node, TypeFormatFlags.NoTruncation)
      if (text === '{}') return '{}'
      return sanitizeTypeText(text)
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

      let inferredText: string | undefined
      if (propType.isAny() || propType.isUnknown()) {
        inferredText = inferColumnDataTypeText(prop)
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

      const expandedPropType = inferredText ?? expandType(propType, node, options, newSeen)
      lines.push(`${name}${q}: ${expandedPropType}`)
    }

    if (lines.length === 0) return '{}'
    return `{ ${lines.join('; ')} }`
  }

  return sanitizeTypeText(type.getText(node, TypeFormatFlags.NoTruncation))
}
