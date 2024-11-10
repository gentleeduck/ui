import { Badge } from '@/registry/registry-ui-components'

export default function Badge1Demo() {
  return (
    <Badge
      arial-label="Badge"
      role="button"
      variant={'outline'}
      label={{
        children: 'Badge',
      }}
    >
      Badge
    </Badge>
  )
}
