import { Badge } from '@gentleduck/registry-ui-duckui/badge'
import { Info } from 'lucide-react'

export default function Badge8Demo() {
  return (
    <Badge
      arial-label="Badge"
      role="button"
      variant={'outline'}
      size={'icon'}
      label={{
        showLabel: true,
        children: 'Info Badge',
      }}>
      <Info />
    </Badge>
  )
}
