import { Button } from '@gentleduck/registry-ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@gentleduck/registry-ui/empty'
import { IconChartBar } from '@tabler/icons-react'
import { RefreshCcwIcon } from 'lucide-react'

export default function Demo() {
  return (
    <Empty className="h-full bg-gradient-to-b from-30% from-muted/50 to-background">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconChartBar />
        </EmptyMedia>
        <EmptyTitle>No Analytics Data</EmptyTitle>
        <EmptyDescription>Once your site receives traffic, usage metrics and trends will appear here.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm" variant="outline">
          <RefreshCcwIcon />
          Refresh
        </Button>
      </EmptyContent>
    </Empty>
  )
}
