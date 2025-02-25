import { useState } from 'react'
import { Button } from '@duck/registry-ui-duckui/button'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Counter</h1>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <Button onClick={() => setCount(count + 1)}>Increment</Button>
    </>
  )
}

export default App
