import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

function ShadcnButton() {
  return (
    <>
    <div className='grid w-full gap-1.5'>
      <Label htmlFor='message'>Your message</Label>
      <Textarea placeholder='Type your message here.' id='message' />
    </div>
    </>
  )
}

export default ShadcnButton
