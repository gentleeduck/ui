import { useState } from 'react'

function NativeButton() {
  const [count, setCount] = useState(0)

  return (
    <>
      <button className='border border-background rounded-lg px-4 py-2 shadow-sm' onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </button>
    </>
  )
}

export default NativeButton