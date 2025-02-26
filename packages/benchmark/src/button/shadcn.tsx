import { Button } from "@/components/ui/button"
import { useState } from 'react'

function ShadcnButton() {
  const [count, setCount] = useState(0)

  return (
    <>
        <Button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </Button>
    </>
  )
}

export default ShadcnButton
