import { type Node, Symbol, SyntaxKind, type Type, TypeFormatFlags, ts } from 'ts-morph'

export interface ExpandTypeOptions {
  normalizeAnyToUnknown?: boolean
}

export function expandType(
  type: Type,
  node?: Node,
  options: ExpandTypeOptions = {},
  seen = new Map<string, string>(),
): string {
  // Basic types
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

  // Handle Date
  const symbol = type.getAliasSymbol() || type.getSymbol()
  if (symbol && symbol.getName() === 'Date') {
    return 'Date'
  }

  // Recursion Check (by unique name if available)
  // Only for named types to prevent infinite expansion of self-referencing named types
  // But we want to expand structure if possible.
  // If we have seen this type text before, use the name.
  const typeText = type.getText(node, TypeFormatFlags.UseFullyQualifiedType | TypeFormatFlags.NoTruncation)
  if (seen.has(typeText)) {
    // Fallback to text which usually uses the name.
    return typeText
  }

  // Handle Arrays
  if (type.isArray()) {
    const elemType = type.getArrayElementType()
    if (elemType) {
      return `${expandType(elemType, node, options, seen)}[]`
    }
    return options.normalizeAnyToUnknown ? 'unknown[]' : 'any[]'
  }

  // Handle Union
  if (type.isUnion()) {
    const parts = type.getUnionTypes().map((t) => expandType(t, node, options, seen))
    return Array.from(new Set(parts)).join(' | ')
  }

  // Handle Objects
  if (type.isObject() || type.isIntersection()) {
    if (symbol && symbol.getName() === 'Promise') {
      const args = type.getTypeArguments()
      if (args.length > 0) return expandType(args[0], node, options, seen)
      return options.normalizeAnyToUnknown ? 'Promise<unknown>' : 'Promise<any>'
    }

    const newSeen = new Map(seen)
    newSeen.set(typeText, typeText)

    const props = type.getProperties()
    if (props.length === 0) {
      // Check for empty object literal vs other things
      // Some types might be empty interfaces
      const text = type.getText(node, TypeFormatFlags.NoTruncation)
      if (text === '{}') return '{}'
      // Fallback
      return text
    }

    const lines: string[] = []
    for (const prop of props) {
      // Filter out methods
      const valDeclaration = prop.getValueDeclaration()
      if (
        valDeclaration &&
        (valDeclaration.getKind() === SyntaxKind.MethodDeclaration ||
          valDeclaration.getKind() === SyntaxKind.MethodSignature)
      ) {
        continue
      }

      const name = prop.getName()
      let propType: Type | undefined
      if (node) {
        propType = prop.getTypeAtLocation(node) // Contextual resolution
      }

      if (!propType) {
        // Should not happen easily but fallback
        lines.push(`${name}: any`)
        continue
      }

      // Handle optionality
      const isOptional = (prop.getFlags() & ts.SymbolFlags.Optional) !== 0
      const q = isOptional ? '?' : ''

      // Strip undefined from union if optional
      if (isOptional && propType.isUnion()) {
        const unionTypes = propType.getUnionTypes().filter((t) => !t.isUndefined())
        if (unionTypes.length === 1) {
          propType = unionTypes[0]
        } else {
          // Reconstruct union without undefined
          // Not easy to construct a Type object, but we can just expand the parts
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

  // Fallback
  return type.getText(node, TypeFormatFlags.NoTruncation | TypeFormatFlags.UseFullyQualifiedType)
}
