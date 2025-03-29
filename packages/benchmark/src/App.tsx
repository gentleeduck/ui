// import DuckButton from './button/duck'
// import NativeButton from './button/native'
// import ShadcnButton from './button/shadcn'
// import DuckTextarea from './textarea/duck'
// import NativeTextarea from './textarea/native'
// import ShadcnTextarea from './textarea/shadcn'

import { lazy } from "react"

// import DuckButton from './button/duck'
// import NativeButton from './button/native'
// import ShadcnButton from './button/shadcn'
// import DuckTextarea from './textarea/duck'
// import NativeTextarea from './textarea/native'
// import ShadcnTextarea from './textarea/shadcn'
// import DuckTabs from './tabs/duck'
// import ShadcnTabs from './tabs/shadcn'
// import DuckToggleGroup from './toggle-group/duck'
// import ShadcnToggleGroup from './toggle-group/toggle-group'
// import DuckToggle from './toggle/duck'
// import ShadcnToggle from './toggle/toggle'
const DuckBadge = lazy(()=> import('./badge/duck')) 
const ShadcnBadge = lazy(()=> import('./badge/shadcn')) 

function App() {
  return (
    <div className='flex flex-col w-11/12 mx-10 h-screen justify-center  items-center gap-4'>
      {/* <DuckButton /> */}
      {/* <NativeButton />
      <ShadcnButton /> */}
      {/* <DuckTextarea />
      <NativeTextarea />
      <ShadcnTextarea />
      <DuckTabs />
      <ShadcnTabs />
      <DuckToggleGroup />
      <ShadcnToggleGroup />
      <DuckToggle />
      <ShadcnToggle /> */}
      <DuckBadge />
      <ShadcnBadge />
    </div>
  )
}

export default App
