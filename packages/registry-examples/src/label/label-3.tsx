import { Checkbox } from '@gentleduck/registry-ui/checkbox'
import { Label } from '@gentleduck/registry-ui/label'

export default function Demo() {
  return (
    <div dir="rtl">
      <div className="flex items-center gap-2">
        <Checkbox id="tterms" />
        <Label htmlFor="tterms">قبول الشروط والاحكام</Label>
      </div>
    </div>
  )
}
