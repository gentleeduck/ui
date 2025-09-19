import { Italic } from "lucide-react"

import { Toggle } from "@/registry/default/ui/toggle"

export default function ToggleOutline() {
  return (
    <Toggle aria-label="Toggle italic" variant="outline">
      <Italic className="h-4 w-4" />
    </Toggle>
  )
}
