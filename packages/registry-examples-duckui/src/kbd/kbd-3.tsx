import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Kbd } from '@gentleduck/registry-ui-duckui/kbd'

export default function KbdDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button className="pr-2" size="sm" variant="outline">
        Accept <Kbd>⏎</Kbd>
      </Button>
      <Button className="pr-2" size="sm" variant="outline">
        Cancel <Kbd>Esc</Kbd>
      </Button>
    </div>
  )
}
