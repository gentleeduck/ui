import { Input } from '@gentelduck/registry-ui-duckui/input'
import { Label } from '@gentelduck/registry-ui-duckui/label'

export function InputWithLabel() {
  return (
    <div className='grid w-full max-w-sm items-center gap-1.5'>
      <Label htmlFor='email'>Email</Label>
      <Input type='email' id='email' placeholder='Email' />
    </div>
  )
}
