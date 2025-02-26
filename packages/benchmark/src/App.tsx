import React from 'react'
import DuckButton from './button/duck'
import NativeButton from './button/native'

function App() {
  const [count, setCount] = React.useState(0)

  return (
    <div className="flex w-full h-screen justify-center  items-center gap-4">
      <NativeButton />
      <DuckButton />
    </div>
  )
}

export default App
