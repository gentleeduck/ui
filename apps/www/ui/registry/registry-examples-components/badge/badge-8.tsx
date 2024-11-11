import { Badge } from '@/registry/registry-ui-components'

export default function Badge8Demo() {
  return (
    <Badge
      arial-label="Badge"
      role="button"
      variant={'outline'}
      size={'icon'}
      label={{
        showLabel: true,
        children: 'Badge',
      }}
    >
      Badge
    </Badge>
  )
}
