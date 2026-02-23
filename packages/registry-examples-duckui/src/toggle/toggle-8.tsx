import { Toggle } from '@gentleduck/registry-ui-duckui/toggle'
import { Bold } from 'lucide-react'

export default function ToggleRtlDemo() {
  return (
    <div dir="rtl">
      <Toggle aria-label="\u062A\u0628\u062F\u064A\u0644 \u0627\u0644\u062E\u0637 \u0627\u0644\u0639\u0631\u064A\u0636">
        <Bold className="h-4 w-4" />
      </Toggle>
    </div>
  )
}
