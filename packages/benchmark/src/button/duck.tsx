import { Button } from '@duck/registry-ui-duckui/button'
import { TooltipProvider } from '@duck/registry-ui-duckui/tooltip'
import React from 'react'
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
