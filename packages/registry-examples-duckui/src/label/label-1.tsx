import { Checkbox } from '@gentleduck/registry-ui-duckui/checkbox'
import { Label } from '@gentleduck/registry-ui-duckui/label'

export default function LabelDemo() {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Checkbox id="terms" />
        <Label htmlFor="terms">Accept terms and conditions</Label>
      </div>
    </div>
  )
}
