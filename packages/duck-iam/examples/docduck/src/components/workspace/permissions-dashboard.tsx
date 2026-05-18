'use client'

import { CheckIcon, ShieldIcon, XIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAccess } from '@/lib/access-client'

const PERMISSION_CHECKS: Array<{ action: string; resource: string; label: string }> = [
  { action: 'create', resource: 'document', label: 'Create documents' },
  { action: 'read', resource: 'document', label: 'Read documents' },
  { action: 'update', resource: 'document', label: 'Update documents' },
  { action: 'delete', resource: 'document', label: 'Delete documents' },
  { action: 'share', resource: 'document', label: 'Share documents' },
  { action: 'update', resource: 'workspace', label: 'Update workspace' },
  { action: 'delete', resource: 'workspace', label: 'Delete workspace' },
  { action: 'manage', resource: 'member', label: 'Manage members' },
]

export function PermissionsDashboard() {
  const { can } = useAccess()

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <ShieldIcon className="h-4 w-4 text-muted-foreground" />
          Permission Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {PERMISSION_CHECKS.map(({ action, resource, label }) => {
            const allowed = can(action, resource)
            return (
              <div
                key={`${action}:${resource}`}
                className="flex items-center justify-between px-6 py-2.5 transition-colors hover:bg-muted/50">
                <span className="text-sm">{label}</span>
                <Badge variant={allowed ? 'default' : 'destructive'} className="gap-1">
                  {allowed ? (
                    <>
                      <CheckIcon className="h-3 w-3" /> Allowed
                    </>
                  ) : (
                    <>
                      <XIcon className="h-3 w-3" /> Denied
                    </>
                  )}
                </Badge>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
