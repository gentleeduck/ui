import { Italic } from "lucide-react"

import { Toggle } from "@/registry/default/ui/toggle"

export default function ToggleSm() {
  return (
    <Toggle aria-label="Toggle italic" size="sm">
      <Italic className="h-4 w-4" />
    </Toggle>
  )
}
