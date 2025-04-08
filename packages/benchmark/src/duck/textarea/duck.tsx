import { Textarea } from '@gentelduck/registry-ui-duckui/textarea'

function DuckButton() {
  return (
    <>
    <div className='grid w-full gap-1.5'>
      <Textarea placeholder='Type your message here.' id='message' />
    </div>
    </>
  )
}

export default DuckButton