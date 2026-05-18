import React from 'react'
import type { AccessControl } from '../../core/types'
import { ChevronDown, ChevronRight, CornerUpRight, Refresh } from '../components/icons'
import { JsonTree } from '../components/json-tree'
import { DetailEmpty, FilterBar, ListItem, ListShell, Section, SplitView } from '../components/layout'
import { Alert, Badge, Button } from '../components/ui'
import type { IDevtoolsEngine } from '../lib/types'

export function RolesPanel({ engine }: { engine: IDevtoolsEngine }) {
  const [roles, setRoles] = React.useState<AccessControl.IRole[]>([])
  const [selected, setSelected] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [filter, setFilter] = React.useState('')

  const load = React.useCallback(async () => {
    try {
      setError(null)
      setRoles(await engine.admin.listRoles())
    } catch (err) {
      setError((err as Error).message)
    }
  }, [engine])

  React.useEffect(() => {
    void load()
  }, [load])

  const filtered = roles.filter(
    (r) =>
      r.id.toLowerCase().includes(filter.toLowerCase()) || (r.name ?? '').toLowerCase().includes(filter.toLowerCase()),
  )
  const current = roles.find((r) => r.id === selected) ?? null

  return (
    <SplitView
      left={
        <ListShell
          count={filtered.length}
          title="Roles"
          toolbar={
            <Button onClick={load}>
              <Refresh size={10} /> refresh
            </Button>
          }>
          <FilterBar onChange={setFilter} placeholder="Filter roles" value={filter} />
          {error && <Alert kind="error">{error}</Alert>}
          {filtered.length === 0 && !error && <DetailEmpty message="No roles." />}
          {filtered.map((r) => (
            <ListItem
              active={selected === r.id}
              dot="#86efac"
              key={r.id}
              onClick={() => setSelected(r.id)}
              primary={r.id}
              secondary={
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  {r.permissions.length} perms
                  {r.inherits?.length ? (
                    <>
                      <span className="iam-dt-sep" />
                      <CornerUpRight size={10} /> {r.inherits.join(', ')}
                    </>
                  ) : null}
                </span>
              }
              trailing={<Badge tone="allow">{r.permissions.length}</Badge>}
            />
          ))}
        </ListShell>
      }
      right={
        !current ? (
          <DetailEmpty message="Select a role on the left." />
        ) : (
          <div className="iam-dt-detail">
            <div className="iam-dt-detail__head">
              <code>{current.id}</code>
              <span className="iam-dt-mute">{current.name}</span>
              {current.scope && <Badge tone="info">scope: {current.scope}</Badge>}
            </div>
            {current.description && (
              <Section title="Description">
                <p className="iam-dt-soft" style={{ fontSize: 11 }}>
                  {current.description}
                </p>
              </Section>
            )}
            {current.inherits && current.inherits.length > 0 && (
              <Section title="Inherits">
                <div className="iam-dt-row">
                  {current.inherits.map((id) => (
                    <Badge key={id}>{id}</Badge>
                  ))}
                </div>
              </Section>
            )}
            <Section title={`Permissions (${current.permissions.length})`}>
              <div className="iam-dt-col">
                {current.permissions.map((p, i) => (
                  <PermRow key={i} perm={p} />
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

function PermRow({ perm }: { perm: AccessControl.IPermission }) {
  const [open, setOpen] = React.useState(false)
  const hasDetail = !!perm.conditions || !!perm.scope
  return (
    <div className="iam-dt-trace__group">
      <button
        type="button"
        onClick={() => hasDetail && setOpen((o) => !o)}
        className="iam-dt-trace__group-head"
        disabled={!hasDetail}>
        <span className="iam-dt-section__chev">{hasDetail ? open ? <ChevronDown /> : <ChevronRight /> : null}</span>
        <code className="iam-dt-action">{perm.action}</code>
        <span className="iam-dt-mute">on</span>
        <code className="iam-dt-resource">{perm.resource}</code>
        {perm.scope && <Badge tone="info">{perm.scope}</Badge>}
        {perm.conditions && <Badge tone="warn">cond</Badge>}
      </button>
      {open && hasDetail && perm.conditions && (
        <div className="iam-dt-trace__group-body">
          <JsonTree data={perm.conditions} defaultOpen label="conditions" />
        </div>
      )}
    </div>
  )
}
