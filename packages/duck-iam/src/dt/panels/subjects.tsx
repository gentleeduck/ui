import React from 'react'
import type { Primitives } from '../../core/types'
import { JsonTree } from '../components/json-tree'
import { DetailEmpty, Section, SplitView } from '../components/layout'
import { Alert, Badge, Button, Field, Input, TextArea } from '../components/ui'
import { safeParseJson } from '../lib/format'
import type { IDevtoolsEngine } from '../lib/types'

export function SubjectsPanel({ engine }: { engine: IDevtoolsEngine }) {
  const [subjectId, setSubjectId] = React.useState('')
  const [attrs, setAttrs] = React.useState<Primitives.Attributes | null>(null)
  const [attrsDraft, setAttrsDraft] = React.useState('{}')
  const [roleId, setRoleId] = React.useState('')
  const [scope, setScope] = React.useState('')
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [status, setStatus] = React.useState<string | null>(null)

  async function load() {
    setError(null)
    setStatus(null)
    if (!subjectId) return setError('subject id required')
    setBusy(true)
    try {
      const a = await engine.admin.getAttributes(subjectId)
      setAttrs(a)
      setAttrsDraft(JSON.stringify(a, null, 2))
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  async function saveAttrs() {
    setError(null)
    setStatus(null)
    const parsed = safeParseJson<Primitives.Attributes>(attrsDraft, {})
    if (parsed.error) return setError(`attributes JSON: ${parsed.error}`)
    setBusy(true)
    try {
      await engine.admin.setAttributes(subjectId, parsed.value)
      setAttrs(parsed.value)
      setStatus('attributes saved')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  async function assign() {
    setError(null)
    setStatus(null)
    if (!roleId) return setError('role id required')
    setBusy(true)
    try {
      await engine.admin.assignRole(subjectId, roleId, scope || undefined)
      setStatus(`assigned ${roleId}${scope ? ` @ ${scope}` : ''}`)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  async function revoke() {
    setError(null)
    setStatus(null)
    if (!roleId) return setError('role id required')
    setBusy(true)
    try {
      await engine.admin.revokeRole(subjectId, roleId, scope || undefined)
      setStatus(`revoked ${roleId}${scope ? ` @ ${scope}` : ''}`)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <SplitView
      left={
        <div className="iam-dt-listshell">
          <div className="iam-dt-listshell__head">
            <h3 className="iam-dt-listshell__title">Lookup</h3>
          </div>
          <div className="iam-dt-pad iam-dt-col">
            <Field label="subject id">
              <Input onChange={(e) => setSubjectId(e.target.value)} placeholder="user-1" value={subjectId} />
            </Field>
            <Button disabled={busy} onClick={load} variant="primary">
              load
            </Button>
            {error && <Alert kind="error">{error}</Alert>}
            {status && <Alert kind="success">{status}</Alert>}
            {attrs && (
              <div className="iam-dt-row">
                <Badge tone="info">{Object.keys(attrs).length} attrs</Badge>
              </div>
            )}
          </div>
        </div>
      }
      right={
        !subjectId ? (
          <DetailEmpty message="Enter a subject id to inspect." />
        ) : (
          <div className="iam-dt-detail">
            <div className="iam-dt-detail__head">
              <code>{subjectId}</code>
            </div>
            <Section title="Snapshot">
              {attrs ? (
                <JsonTree data={attrs} defaultOpen />
              ) : (
                <p className="iam-dt-mute" style={{ fontSize: 11 }}>
                  Load to view.
                </p>
              )}
            </Section>
            <Section defaultOpen={false} title="Edit attributes (JSON)">
              <div className="iam-dt-col">
                <TextArea onChange={(e) => setAttrsDraft(e.target.value)} rows={10} value={attrsDraft} />
                <Button disabled={busy || !subjectId} onClick={saveAttrs} variant="primary">
                  save
                </Button>
              </div>
            </Section>
            <Section defaultOpen={false} title="Role assignment">
              <div className="iam-dt-col">
                <div className="iam-dt-grid-2">
                  <Field label="role id">
                    <Input onChange={(e) => setRoleId(e.target.value)} placeholder="editor" value={roleId} />
                  </Field>
                  <Field label="scope (optional)">
                    <Input onChange={(e) => setScope(e.target.value)} placeholder="org-acme" value={scope} />
                  </Field>
                </div>
                <div className="iam-dt-row">
                  <Button disabled={busy || !subjectId} onClick={assign} variant="primary">
                    assign
                  </Button>
                  <Button disabled={busy || !subjectId} onClick={revoke} variant="danger">
                    revoke
                  </Button>
                </div>
              </div>
            </Section>
          </div>
        )
      }
    />
  )
}
