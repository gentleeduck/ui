import { Italic } from "lucide-react"

import { Toggle } from "@/registry/default/ui/toggle"

export default function ToggleLg() {
  return (
    <Toggle aria-label="Toggle italic" size="lg">
      <Italic className="h-4 w-4" />
    </Toggle>
  )
}
