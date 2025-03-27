import { Label } from '@gentelduck/registry-ui-duckui/label'
import { Switch } from '@gentelduck/registry-ui-duckui/switch'

export function SwitchDemo() {
  return (
    <div className='flex items-center space-x-2'>
      <Switch id='airplane-mode' />
      <Label htmlFor='airplane-mode'>Airplane Mode</Label>
    </div>
  )
}
