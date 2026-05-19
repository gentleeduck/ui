import { Checkbox } from '@gentleduck/registry-ui/checkbox'
import { Label } from '@gentleduck/registry-ui/label'

export default function Demo() {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Checkbox id="terms" />
        <Label htmlFor="terms">Accept terms and conditions</Label>
      </div>
    </div>
  )
}
