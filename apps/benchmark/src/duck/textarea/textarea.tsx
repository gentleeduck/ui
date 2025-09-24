import { Textarea } from '@/components/ui/textarea'

function ShadcnButton() {
  return (
    <>
      <div className="grid w-full gap-1.5">
        <Textarea id="message" placeholder="Type your message here." />
      </div>
    </>
  )
}

export default ShadcnButton
