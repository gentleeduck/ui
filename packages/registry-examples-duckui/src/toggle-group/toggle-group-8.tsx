import { ToggleGroup, ToggleGroupItem } from '@gentleduck/registry-ui-duckui/toggle-group'
import { Bold, Italic, Underline } from 'lucide-react'

export default function ToggleGroupRtlDemo() {
  return (
    <div dir="rtl">
      <ToggleGroup type="single">
        <ToggleGroupItem
          aria-label="\u062A\u0628\u062F\u064A\u0644 \u0627\u0644\u062E\u0637 \u0627\u0644\u0639\u0631\u064A\u0636"
          value="bold">
          <Bold className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem
          aria-label="\u062A\u0628\u062F\u064A\u0644 \u0627\u0644\u062E\u0637 \u0627\u0644\u0645\u0627\u0626\u0644"
          value="italic">
          <Italic className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem
          aria-label="\u062A\u0628\u062F\u064A\u0644 \u0627\u0644\u062A\u0633\u0637\u064A\u0631"
          value="underline">
          <Underline className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
