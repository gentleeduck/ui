import Textarea from './textarea'

function DuckButton() {
  return (
    <>
      <div className="grid w-full gap-1.5">
        <Textarea id="message" placeholder="Type your message here." />
      </div>
    </>
  )
}

export default DuckButton
