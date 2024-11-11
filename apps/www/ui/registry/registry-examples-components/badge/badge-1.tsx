import { TooltipProvider } from '@/registry/default/ui'
import { Badge } from '@/registry/registry-ui-components'

export default function Badge1Demo() {
  return (
    <TooltipProvider>
      <Badge
        arial-label="Badge"
        role="button"
        variant={'default'}
        size={'default'}
        label={{
          children: 'Badge',
        }}
      >
        Badge
      </Badge>
    </TooltipProvider>
  )
}
