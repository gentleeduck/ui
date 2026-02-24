import { ToggleGroup, ToggleGroupItem } from '@gentleduck/registry-ui-duckui/toggle-group'
import { Bold, Italic, Underline } from 'lucide-react'

export default function ToggleGroupRtlDemo() {
  return (
    <ToggleGroup type="single" dir="rtl">
      <ToggleGroupItem aria-label="تبديل الخط العريض" value="bold">
        <Bold className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem aria-label="تبديل الخط المائل" value="italic">
        <Italic className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem aria-label="تبديل التسطير" value="underline">
        <Underline className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
