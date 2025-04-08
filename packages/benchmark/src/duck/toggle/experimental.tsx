import { Bold } from "lucide-react"

import { Toggle } from "@gentelduck/registry-ui-duckui/experimental/toggle"

export default function ToggleDemo() {
  return (
    <div className="flex items-center space-x-8">
      <Toggle name="tg" value={1} aria-label="Toggle bold">
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle name="tg" value={2} aria-label="Toggle bold">
        <Bold className="h-4 w-4" />

      </Toggle>
      <Toggle name="tg" value={3} aria-label="Toggle bold">
        <Bold className="h-4 w-4" />
      </Toggle>
    </div>
  )
}
