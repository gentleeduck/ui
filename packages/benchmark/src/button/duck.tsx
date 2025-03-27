import { Button } from '@gentelduck/registry-ui-duckui/button'
import { useState } from 'react'

function DuckButton() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </Button>
    </>
  )
}

export default DuckButton
