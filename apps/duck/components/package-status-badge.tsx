import { cn } from '@gentleduck/libs/cn'
import { Badge } from '@gentleduck/registry-ui/badge'
import { getPackageLifecycleMeta, type PackageLifecycleStatus } from '~/config/package-status'

export function PackageStatusBadge({
  status,
  className,
}: {
  status: PackageLifecycleStatus
  className?: string
}) {
  const meta = getPackageLifecycleMeta(status)

  return (
    <Badge
      aria-label={`${meta.label} package status`}
      className={cn('w-fit rounded-full px-2.5 py-0.5 font-semibold text-[0.65rem] uppercase tracking-[0.18em]', className)}
      variant={meta.variant}>
      {meta.label}
    </Badge>
  )
}
