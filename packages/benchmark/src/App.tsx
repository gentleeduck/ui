import { Button } from '@duck/registry-ui-duckui/button'
import { TooltipProvider } from '@duck/registry-ui-duckui/tooltip'
import React from 'react'

function App() {
  const [count, setCount] = React.useState(0)

  return (
    <div className="flex w-full h-screen justify-center  items-center gap-4">
      <TooltipProvider>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <Button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </Button>
      </TooltipProvider>
    </div>
  )
}

export default App
