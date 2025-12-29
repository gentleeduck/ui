import { type Decorator, type MethodDeclaration, type Node, SyntaxKind, ts } from 'ts-morph'
import { HTTP_METHOD_BY_DECORATOR, HTTP_METHOD_DECORATORS } from './constants'
import type { HttpMethod, HttpMethodDecorator } from './types'
import { formatPropKey } from '../shared/utils'

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
  if (first.getKind() === SyntaxKind.StringLiteral) return first.getText().slice(1, -1)
  return undefined
}

const TYPE_TEXT_FLAGS =
  ts.TypeFormatFlags.NoTruncation |
  ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope |
  ts.TypeFormatFlags.InTypeAlias |
  ts.TypeFormatFlags.UseFullyQualifiedType

export function getTypeText(node: Node, normalizeAnyToUnknown: boolean): string {
  const t = node.getType()
  if (normalizeAnyToUnknown && t.isAny()) return 'unknown'
  return t.getText(node, TYPE_TEXT_FLAGS) || 'unknown'
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
  // 🦆 Get -> GET, All -> ALL, etc
  return HTTP_METHOD_BY_DECORATOR[name]
}

export function getParamDecoratorKey(dec: Decorator): string | undefined {
  // 🦆 For @Query('lang') / @Param('id') / @Headers('x-token') / @Body('user')
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
