import { Label } from '@gentleduck/registry-ui-duckui/label'
import { Textarea } from '@gentleduck/registry-ui-duckui/textarea'

function DuckButton() {
  return (
    <>
      <div className="grid w-full gap-1.5">
        <Label htmlFor="message">Your message</Label>
        <Textarea placeholder="Type your message here." id="message" />
      </div>
    </>
  )
}

export default DuckButton
