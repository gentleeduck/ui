import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@gentleduck/registry-ui/empty'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@gentleduck/registry-ui/input-group'
import { Kbd } from '@gentleduck/registry-ui/kbd'
import { SearchIcon } from 'lucide-react'

export default function Demo() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>No Results Found</EmptyTitle>
        <EmptyDescription>
          We could not find anything matching your query. Try a different search term below.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <InputGroup className="sm:w-3/4">
          <InputGroupInput placeholder="Search for something else..." />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <Kbd>/</Kbd>
          </InputGroupAddon>
        </InputGroup>
        <EmptyDescription>
          {/* biome-ignore lint/a11y/useValidAnchor: placeholder href in demo component */}
          Still stuck? <a href="#">Browse all categories</a>
        </EmptyDescription>
      </EmptyContent>
    </Empty>
  )
}
