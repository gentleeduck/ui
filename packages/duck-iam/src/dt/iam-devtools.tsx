import { cn } from '@gentleduck/libs/cn'
import React from 'react'
import type { IFlowRecorder } from './lib/flow'
import { ensureStylesInjected } from './lib/styles'
import type { IDecisionInput, IDevtoolsEngine, IDevtoolsMetrics, PanelKey } from './lib/types'
import { DecisionInspector } from './panels/decision'
import { FlowPanel } from './panels/flow'
import { MetricsPanel } from './panels/metrics'
import { PoliciesPanel } from './panels/policies'
import { RolesPanel } from './panels/roles'
import { SubjectsPanel } from './panels/subjects'

export interface IIamDevtoolsInnerProps {
  engine: IDevtoolsEngine
  metrics?: IDevtoolsMetrics
  flow?: IFlowRecorder
  initialPanel?: PanelKey
  defaultRequest?: Partial<IDecisionInput>
  pollMs?: number
  embedded?: boolean
}

const TABS: { key: PanelKey; label: string; dot: string }[] = [
  { key: 'flow', label: 'Flow', dot: '#84cc16' },
  { key: 'decision', label: 'Decision', dot: '#60a5fa' },
  { key: 'policies', label: 'Policies', dot: '#a78bfa' },
  { key: 'roles', label: 'Roles', dot: '#34d399' },
  { key: 'subjects', label: 'Subjects', dot: '#fbbf24' },
  { key: 'metrics', label: 'Metrics', dot: '#ec4899' },
]

export function IamDevtoolsInner({
  engine,
  metrics,
  flow,
  initialPanel = 'flow',
  defaultRequest,
  pollMs,
  embedded = false,
}: IIamDevtoolsInnerProps) {
  React.useEffect(() => {
    ensureStylesInjected()
  }, [])
  const [active, setActive] = React.useState<PanelKey>(initialPanel)

  const content = (
    <>
      <nav className="flex shrink-0 flex-wrap items-center gap-1 border-b bg-card px-2 py-1.5">
        {TABS.map((tab) => {
          const isActive = active === tab.key
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActive(tab.key)}
              className={cn(
                'inline-flex h-7 items-center gap-1.5 rounded-md border px-2.5 font-medium text-[11px] transition-all',
                isActive
                  ? 'border-border bg-background text-foreground shadow-sm'
                  : 'border-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground',
              )}>
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  backgroundColor: tab.dot,
                  boxShadow: isActive ? `0 0 6px ${tab.dot}` : undefined,
                  opacity: isActive ? 1 : 0.55,
                }}
              />
              {tab.label}
            </button>
          )
        })}
      </nav>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {active === 'flow' && flow && <FlowPanel flow={flow} />}
        {active === 'flow' && !flow && (
          <div className="m-3 rounded-md border border-border/60 border-dashed bg-muted/20 p-4 text-muted-foreground text-xs">
            No flow recorder wired. Pass <code className="font-mono">flow=&#123;recorder&#125;</code> to the devtool and
            bind it to your engine's <code className="font-mono">afterEvaluate</code> hook.
          </div>
        )}
        {active === 'decision' && <DecisionInspector defaults={defaultRequest} engine={engine} />}
        {active === 'policies' && <PoliciesPanel engine={engine} />}
        {active === 'roles' && <RolesPanel engine={engine} />}
        {active === 'subjects' && <SubjectsPanel engine={engine} />}
        {active === 'metrics' && <MetricsPanel engine={engine} metrics={metrics} pollMs={pollMs} />}
      </div>
    </>
  )

  if (embedded) {
    return <div className="flex h-full min-h-0 flex-col overflow-hidden">{content}</div>
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border bg-background text-foreground">
      {content}
    </div>
  )
}
