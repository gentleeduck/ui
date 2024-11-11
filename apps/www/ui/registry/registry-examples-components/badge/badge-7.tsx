import { Badge } from '@/registry/registry-ui-components'

export default function Badge7Demo() {
  return (
    <Badge
      arial-label="Badge"
      role="button"
      variant={'outline'}
      label={{
        showLabel: true,
        children: 'Badge',
      }}
    >
      Badge
    </Badge>
  )
}
