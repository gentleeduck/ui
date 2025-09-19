import { Input } from '@gentleduck/registry-ui-duckui/input'
import { Label } from '@gentleduck/registry-ui-duckui/label'

export default function InputWithButton() {
  return (
    <div className="flex w-full max-w-sm flex-col space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input placeholder="Email" type="email" />
    </div>
  )
}
