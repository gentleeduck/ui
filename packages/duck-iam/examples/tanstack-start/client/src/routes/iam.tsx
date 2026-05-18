import { createFileRoute } from '@tanstack/react-router'
import { IamDevtoolsInner } from '@gentleduck/iam/dt'
import { engine, flow, metrics } from '../iam/engine'
import { useCurrentUser } from '../iam/auth-context'

export const Route = createFileRoute('/iam')({ component: IamPage })

function IamPage() {
  const me = useCurrentUser()
  return (
    <main className="page-wrap flex flex-col gap-3 px-4 pb-12 pt-14">
      <header>
        <h1 className="font-semibold text-xl">IAM devtools</h1>
        <p className="text-[var(--sea-ink-soft)] text-xs">
          Full-page view of the same devtools surface available from the floating button (bottom-left).
        </p>
      </header>
      <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3">
        <IamDevtoolsInner
          defaultRequest={{
            subjectId: me?.id ?? '',
            action: 'read',
            resourceType: 'post',
            attributesJson: '{ "ownerId": "u-alice", "published": true, "workspaceId": "workspace-alpha", "tagCount": 1 }',
            environmentJson: '{ "hour": 10 }',
            scope: me?.workspaceId ?? '',
          }}
          embedded
          engine={engine}
          flow={flow}
          metrics={metrics}
        />
      </div>
    </main>
  )
}
