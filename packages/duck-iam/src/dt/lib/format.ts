import type { Explain } from '../../core/explain'
import type { AccessControl, Primitives } from '../../core/types'

export function formatAttrValue(value: Primitives.AttributeValue | undefined): string {
  if (value === undefined) return '(undefined)'
  if (value === null) return 'null'
  if (typeof value === 'string') return JSON.stringify(value)
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (Array.isArray(value)) return `[${value.map((v) => formatAttrValue(v as Primitives.AttributeValue)).join(', ')}]`
  return JSON.stringify(value)
}

export function effectColor(effect: AccessControl.Effect): string {
  return effect === 'allow' ? 'text-emerald-500' : 'text-rose-500'
}

export function resultColor(result: boolean): string {
  return result ? 'text-emerald-500' : 'text-rose-500'
}

export function safeParseJson<T = unknown>(raw: string, fallback: T): { value: T; error?: string } {
  const trimmed = raw.trim()
  if (!trimmed) return { value: fallback }
  try {
    return { value: JSON.parse(trimmed) as T }
  } catch (err) {
    return { value: fallback, error: (err as Error).message }
  }
}

export function summarizeTrace(trace: Explain.Trace): string {
  if (trace.type === 'condition') {
    return `${trace.field} ${trace.operator} ${formatAttrValue(trace.expected)}`
  }
  const logic = trace.logic.toUpperCase()
  return `${logic} (${trace.children.length})`
}

export function countConditions(trace: Explain.Trace): number {
  if (trace.type === 'condition') return 1
  return trace.children.reduce((sum, c) => sum + countConditions(c), 0)
}
