import DuckButton from './button/duck'
import NativeButton from './button/native'
import ShadcnButton from './button/shadcn'

function App() {

  return (
    <div className="flex w-full h-screen justify-center  items-center gap-4">
      <ShadcnButton />
      <NativeButton />
      <DuckButton />
    </div>
  )
}

export default App
