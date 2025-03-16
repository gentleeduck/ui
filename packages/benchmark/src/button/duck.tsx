import { Button } from '@gentelduck/registry-ui-duckui/button'
import { TooltipProvider } from '@gentelduck/registry-ui-duckui/tooltip'
import { useState } from 'react'

function DuckButton() {
  const [count, setCount] = useState(0)

  return (
    <>
      <TooltipProvider>
        <Button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </Button>
      </TooltipProvider>
    </>
  )
}

export default DuckButton
