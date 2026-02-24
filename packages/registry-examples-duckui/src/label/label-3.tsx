import { Checkbox } from '@gentleduck/registry-ui-duckui/checkbox'
import { Label } from '@gentleduck/registry-ui-duckui/label'

export default function LabelRtlDemo() {
  return (
    <div dir="rtl">
      <div className="flex items-center gap-2">
        <Checkbox id="tterms" />
        <Label htmlFor="tterms">قبول الشروط والاحكام</Label>
      </div>
    </div>
  )
}
