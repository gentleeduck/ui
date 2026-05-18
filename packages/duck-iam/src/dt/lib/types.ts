import type { Explain } from '../../core/explain'
import type { AccessControl, Primitives } from '../../core/types'
import type { Metrics } from '../../observability/metrics'

/**
 * Minimal engine surface the devtool relies on. Lets consumers pass any
 * concrete `Engine<...>` without variance issues.
 */
export interface IDevtoolsEngine {
  can(
    subjectId: string,
    action: string,
    resource: { type: string; id?: string; attributes?: Record<string, Primitives.AttributeValue> },
    environment?: Record<string, unknown>,
  ): Promise<unknown>
  explain(
    subjectId: string,
    action: string,
    resource: { type: string; id?: string; attributes?: Record<string, Primitives.AttributeValue> },
    environment?: Record<string, unknown>,
  ): Promise<Explain.IResult>
  stats(): Record<string, { hits: number; misses: number; size: number }>
  resetStats(): void
  admin: {
    listPolicies(): Promise<AccessControl.IPolicy[]>
    listRoles(): Promise<AccessControl.IRole[]>
    getPolicy(id: string): Promise<AccessControl.IPolicy | null>
    getRole(id: string): Promise<AccessControl.IRole | null>
    assignRole(subjectId: string, roleId: string, scope?: string): Promise<void>
    revokeRole(subjectId: string, roleId: string, scope?: string): Promise<void>
    setAttributes(subjectId: string, attrs: Primitives.Attributes): Promise<void>
    getAttributes(subjectId: string): Promise<Primitives.Attributes>
    export(): Promise<unknown>
  }
}

export interface IDevtoolsMetrics {
  snapshot(): Metrics.ISnapshot
  reset(): void
}

export interface IDecisionInput {
  subjectId: string
  action: string
  resourceType: string
  resourceId: string
  attributesJson: string
  environmentJson: string
  scope: string
}

export type PanelKey = 'flow' | 'decision' | 'policies' | 'roles' | 'subjects' | 'metrics'
