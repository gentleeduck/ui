import { Engine } from '@gentleduck/iam'
import { MemoryAdapter } from '@gentleduck/iam/adapters/memory'
import { createFlowRecorder } from '@gentleduck/iam/dt'
import { createMetricsAggregator } from '@gentleduck/iam/observability/metrics'
import { mockBackend } from './mock-backend'
import { POLICIES } from './policies'
import { ROLES } from './roles'
import type { AppAction, AppResource, AppRole, AppScope } from './types'

/**
 * Seed assignments. Maps mock user IDs to RBAC roles.
 */
const ASSIGNMENTS: Record<string, AppRole[]> = {
  'u-alice': ['admin'],
  'u-bob': ['author'],
  'u-cara': ['editor'],
  'u-dan': ['reader'],
}

export const adapter = new MemoryAdapter<AppAction, AppResource, AppRole, AppScope>({
  policies: POLICIES,
  roles: ROLES,
  assignments: ASSIGNMENTS,
})

export const metrics = createMetricsAggregator({ sampleSize: 500 })
export const flow = createFlowRecorder({ bufferSize: 300 })

export const engine = new Engine<AppAction, AppResource, AppRole, AppScope, 'development'>({
  adapter,
  mode: 'development',
  hooks: {
    /**
     * Enrich every request with mock environment: current hour for the
     * `publish-window` rule + a fake IP. Real backends fill this from the
     * incoming request.
     */
    beforeEvaluate: (req) => ({
      ...req,
      environment: {
        ...req.environment,
        now: Date.now(),
        hour: new Date().getHours(),
        ip: '127.0.0.1',
      },
    }),
    onMetrics: (event) => {
      metrics.record(event)
      flow.record({
        subjectId: event.subjectId,
        action: event.action,
        resource: event.resource,
        allowed: event.allowed,
        durationMs: event.durationMs,
      })
    },
    afterEvaluate: (req, decision) => {
      const list = flow.list()
      const latest = list[0]
      if (
        latest &&
        latest.subjectId === (req.subject?.id ?? '') &&
        latest.action === req.action &&
        latest.resource === req.resource.type &&
        latest.reason === undefined
      ) {
        // Enrich the entry just recorded by onMetrics with decision detail.
        ;(latest as { reason?: string }).reason = decision.reason
        ;(latest as { decidingPolicy?: string }).decidingPolicy = decision.policy
        ;(latest as { decidingRule?: string }).decidingRule = decision.rule?.id
        ;(latest as { resourceId?: string }).resourceId = req.resource.id
        ;(latest as { scope?: string }).scope = req.scope
        ;(latest as { environment?: Record<string, unknown> }).environment = req.environment
      }
    },
    onDeny: (req, decision) => {
      // eslint-disable-next-line no-console
      console.warn('[iam] denied', { subjectId: req.subject?.id, action: req.action, reason: decision.reason })
    },
    onError: (err) => {
      // eslint-disable-next-line no-console
      console.error('[iam] error', err)
    },
  },
})

/**
 * Seed user attributes into the engine on startup so condition `.attr('tier', ...)`
 * has data to evaluate against. Runs once per page load.
 */
let seedPromise: Promise<void> | null = null
export function seedSubjectAttributes(): Promise<void> {
  if (seedPromise) return seedPromise
  seedPromise = (async () => {
    const users = await mockBackend.listUsers()
    await Promise.all(
      users.map((u) =>
        engine.admin.setAttributes(u.id, {
          tier: u.tier,
          workspaceId: u.workspaceId,
          email: u.email,
        }),
      ),
    )
  })()
  return seedPromise
}
