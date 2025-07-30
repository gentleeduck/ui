import { Input } from '@gentleduck/registry-ui-duckui/input'
import { Label } from '@gentleduck/registry-ui-duckui/label'

export default function InputWithButton() {
  return (
    <div className="flex w-full max-w-sm space-y-2 flex-col">
      <Label htmlFor="email">Email</Label>
      <Input type="email" placeholder="Email" />
    </div>
  )
}
