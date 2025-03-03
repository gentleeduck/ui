import { Button } from '@/registry/registry-ui-components/button'
import { Textarea } from '@/registry/registry-ui-components/textarea'

export default function Textarea6Demo() {
  return (
    <div className="grid w-full gap-2">
      <Textarea placeholder="Type your message here." />
      <Button>Send message</Button>
    </div>
  )
}
