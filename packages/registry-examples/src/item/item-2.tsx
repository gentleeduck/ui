import { Button } from '@gentleduck/registry-ui/button'
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@gentleduck/registry-ui/item'

export default function Demo() {
  return (
    <div className="flex flex-col gap-6">
      <Item>
        <ItemContent>
          <ItemTitle>File Upload Complete</ItemTitle>
          <ItemDescription>report-q4.pdf was uploaded successfully to shared drive.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm" variant="outline">
            Open
          </Button>
        </ItemActions>
      </Item>
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Payment Received</ItemTitle>
          <ItemDescription>Invoice #1042 has been paid. Amount: $2,400.00.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm" variant="outline">
            Details
          </Button>
        </ItemActions>
      </Item>
      <Item variant="muted">
        <ItemContent>
          <ItemTitle>Archived Project</ItemTitle>
          <ItemDescription>Landing page redesign was archived on Jan 15, 2026.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm" variant="outline">
            Restore
          </Button>
        </ItemActions>
      </Item>
    </div>
  )
}
