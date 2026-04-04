import { Input } from '@gentleduck/registry-ui/input'
import { Label } from '@gentleduck/registry-ui/label'

export default function Demo() {
  return (
    <div className="flex w-full max-w-sm flex-col space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" placeholder="Email" type="email" />
    </div>
  )
}
