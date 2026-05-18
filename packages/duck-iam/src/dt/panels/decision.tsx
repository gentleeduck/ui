import React from 'react'
import type { Explain } from '../../core/explain'
import type { Primitives } from '../../core/types'
import { Spinner } from '../components/icons'
import { JsonTree } from '../components/json-tree'
import { DetailEmpty, Section, SplitView } from '../components/layout'
import { Alert, Badge, Button, Field, Input, TextArea } from '../components/ui'
import { safeParseJson } from '../lib/format'
import type { IDecisionInput, IDevtoolsEngine } from '../lib/types'
import { TraceTree } from './trace-tree'

const INITIAL: IDecisionInput = {
  subjectId: '',
  action: '',
  resourceType: '',
  resourceId: '',
  attributesJson: '{}',
  environmentJson: '{}',
  scope: '',
}

export function DecisionInspector({
  engine,
  defaults,
}: {
  engine: IDevtoolsEngine
  defaults?: Partial<IDecisionInput>
}) {
  const [input, setInput] = React.useState<IDecisionInput>({ ...INITIAL, ...defaults })
  const [result, setResult] = React.useState<Explain.IResult | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [pending, setPending] = React.useState(false)

  const update = (patch: Partial<IDecisionInput>) => setInput((s) => ({ ...s, ...patch }))

  async function run() {
    setError(null)
    setPending(true)
    try {
      const attrs = safeParseJson<Record<string, Primitives.AttributeValue>>(input.attributesJson, {})
      const env = safeParseJson<Record<string, unknown>>(input.environmentJson, {})
      if (attrs.error) throw new Error(`attributes JSON: ${attrs.error}`)
      if (env.error) throw new Error(`environment JSON: ${env.error}`)
      const resource = { type: input.resourceType, id: input.resourceId || undefined, attributes: attrs.value }
      const environment = { ...env.value, ...(input.scope ? { scope: input.scope } : {}) }
      const trace = await engine.explain(input.subjectId, input.action, resource, environment)
      setResult(trace)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setPending(false)
    }
  }

  return (
    <SplitView
      left={
        <div className="iam-dt-listshell">
          <div className="iam-dt-listshell__head">
            <h3 className="iam-dt-listshell__title">Request</h3>
            <Button disabled={pending} onClick={run} variant="primary">
              {pending ? <Spinner size={10} /> : null}
              {pending ? 'running' : 'evaluate'}
            </Button>
          </div>
          <div className="iam-dt-pad iam-dt-col" style={{ overflow: 'auto' }}>
            <Field label="subject id">
              <Input
                onChange={(e) => update({ subjectId: e.target.value })}
                placeholder="user-1"
                value={input.subjectId}
              />
            </Field>
            <div className="iam-dt-grid-2">
              <Field label="action">
                <Input onChange={(e) => update({ action: e.target.value })} placeholder="read" value={input.action} />
              </Field>
              <Field label="scope">
                <Input onChange={(e) => update({ scope: e.target.value })} placeholder="org-acme" value={input.scope} />
              </Field>
            </div>
            <div className="iam-dt-grid-2">
              <Field label="resource type">
                <Input
                  onChange={(e) => update({ resourceType: e.target.value })}
                  placeholder="post"
                  value={input.resourceType}
                />
              </Field>
              <Field label="resource id">
                <Input
                  onChange={(e) => update({ resourceId: e.target.value })}
                  placeholder="p-1"
                  value={input.resourceId}
                />
              </Field>
            </div>
            <Field label="resource.attributes (JSON)">
              <TextArea
                onChange={(e) => update({ attributesJson: e.target.value })}
                rows={4}
                value={input.attributesJson}
              />
            </Field>
            <Field label="environment (JSON)">
              <TextArea
                onChange={(e) => update({ environmentJson: e.target.value })}
                rows={3}
                value={input.environmentJson}
              />
            </Field>
          </div>
        </div>
      }
      right={
        error ? (
          <Alert kind="error">{error}</Alert>
        ) : !result ? (
          <DetailEmpty message="Run an evaluation to see the trace." />
        ) : (
          <div className="iam-dt-detail">
            <div className="iam-dt-detail__head">
              <Badge tone={result.decision.allowed ? 'allow' : 'deny'}>
                {result.decision.allowed ? 'allow' : 'deny'}
              </Badge>
              <code className="iam-dt-action">{input.action}</code>
              <span className="iam-dt-mute">on</span>
              <code className="iam-dt-resource">{input.resourceType}</code>
              <span className="iam-dt-detail__meta">subject: {input.subjectId || '-'}</span>
            </div>
            <Section title="Reason">
              <p className="iam-dt-soft" style={{ fontSize: 11 }}>
                {result.summary}
              </p>
            </Section>
            <Section title="Trace">
              <TraceTree result={result} />
            </Section>
            <Section defaultOpen={false} title="Raw result">
              <JsonTree data={result} defaultOpen />
            </Section>
          </div>
        )
      }
    />
  )
}
