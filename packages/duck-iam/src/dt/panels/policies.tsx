import React from 'react'
import type { AccessControl } from '../../core/types'
import { ChevronDown, ChevronRight, Refresh } from '../components/icons'
import { JsonTree } from '../components/json-tree'
import { DetailEmpty, FilterBar, ListItem, ListShell, Section, SplitView } from '../components/layout'
import { Alert, Badge, Button } from '../components/ui'
import type { IDevtoolsEngine } from '../lib/types'

export function PoliciesPanel({ engine }: { engine: IDevtoolsEngine }) {
  const [policies, setPolicies] = React.useState<AccessControl.IPolicy[]>([])
  const [selected, setSelected] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [filter, setFilter] = React.useState('')

  const load = React.useCallback(async () => {
    try {
      setError(null)
      setPolicies(await engine.admin.listPolicies())
    } catch (err) {
      setError((err as Error).message)
    }
  }, [engine])

  React.useEffect(() => {
    void load()
  }, [load])

  const filtered = policies.filter(
    (p) =>
      p.id.toLowerCase().includes(filter.toLowerCase()) || (p.name ?? '').toLowerCase().includes(filter.toLowerCase()),
  )
  const current = policies.find((p) => p.id === selected) ?? null

  return (
    <SplitView
      left={
        <ListShell
          count={filtered.length}
          title="Policies"
          toolbar={
            <Button onClick={load}>
              <Refresh size={10} /> refresh
            </Button>
          }>
          <FilterBar onChange={setFilter} placeholder="Filter policies" value={filter} />
          {error && <Alert kind="error">{error}</Alert>}
          {filtered.length === 0 && !error && <DetailEmpty message="No policies." />}
          {filtered.map((p) => (
            <ListItem
              active={selected === p.id}
              dot="#c4b5fd"
              key={p.id}
              onClick={() => setSelected(p.id)}
              primary={p.id}
              secondary={
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  {p.rules.length} rules
                  <span className="iam-dt-sep" />
                  {p.algorithm}
                </span>
              }
              trailing={<Badge tone="info">{p.algorithm}</Badge>}
            />
          ))}
        </ListShell>
      }
      right={
        !current ? (
          <DetailEmpty message="Select a policy on the left." />
        ) : (
          <div className="iam-dt-detail">
            <div className="iam-dt-detail__head">
              <code>{current.id}</code>
              <span className="iam-dt-mute">{current.name}</span>
              <Badge tone="info">{current.algorithm}</Badge>
              {current.version != null && <Badge>v{current.version}</Badge>}
              <span className="iam-dt-detail__meta">{current.rules.length} rules</span>
            </div>
            {current.description && (
              <Section title="Description">
                <p className="iam-dt-soft" style={{ fontSize: 11 }}>
                  {current.description}
                </p>
              </Section>
            )}
            <Section title={`Rules (${current.rules.length})`}>
              <div className="iam-dt-col">
                {current.rules.map((r) => (
                  <RuleRow key={r.id} rule={r} />
                ))}
              </div>
            </Section>
            <Section defaultOpen={false} title="Raw">
              <JsonTree data={current} defaultOpen />
            </Section>
          </div>
        )
      }
    />
  )
}

function RuleRow({ rule }: { rule: AccessControl.IRule }) {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="iam-dt-trace__group">
      <button type="button" onClick={() => setOpen((o) => !o)} className="iam-dt-trace__group-head">
        <span className="iam-dt-section__chev">{open ? <ChevronDown /> : <ChevronRight />}</span>
        <code>{rule.id}</code>
        <Badge tone={rule.effect === 'allow' ? 'allow' : 'deny'}>{rule.effect}</Badge>
        <Badge>p{rule.priority}</Badge>
        <code className="iam-dt-action">{rule.actions.join(', ')}</code>
        <span className="iam-dt-mute">on</span>
        <code className="iam-dt-resource">{rule.resources.join(', ')}</code>
      </button>
      {open && (
        <div className="iam-dt-trace__group-body">
          {rule.description && (
            <p className="iam-dt-soft" style={{ fontSize: 11 }}>
              {rule.description}
            </p>
          )}
          {rule.conditions && <JsonTree data={rule.conditions} defaultOpen label="conditions" />}
        </div>
      )}
    </div>
  )
}
