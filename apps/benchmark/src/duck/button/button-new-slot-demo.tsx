import { Button } from './button-new-slot'
import { useState } from 'react'

function ShadcnButton() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Button asChild onClick={() => setCount((count) => count + 1)}>
        <a href="">count is {count}</a>
      </Button>
    </>
  )
}

export default ShadcnButton
