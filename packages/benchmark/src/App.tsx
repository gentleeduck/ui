// import DuckButton from './button/duck'
// import NativeButton from './button/native'
// import ShadcnButton from './button/shadcn'
// import DuckTextarea from './textarea/duck'
// import NativeTextarea from './textarea/native'
// import ShadcnTextarea from './textarea/shadcn'

import { lazy } from 'react'

// const DuckButton = lazy(() => import('./button/duck'))
// const NativeButton = lazy(() => import('./button/native'))
// const ShadcnButton = lazy(() => import('./button/shadcn'))
// const DuckTextarea = lazy(() => import('./textarea/duck'))
// const NativeTextarea = lazy(() => import('./textarea/native'))
// const ShadcnTextarea = lazy(() => import('./textarea/shadcn'))
// const DuckTabs = lazy(() => import('./tabs/duck'))
// const ShadcnTabs = lazy(() => import('./tabs/shadcn'))
// const DuckToggleGroup = lazy(() => import('./toggle-group/duck'))
// const ShadcnToggleGroup = lazy(() => import('./toggle-group/toggle-group'))
const DuckToggle = lazy(() => import('./toggle/duck'))
const ShadcnToggle = lazy(() => import('./toggle/toggle'))

function App() {
  return (
    <div className='flex flex-col w-11/12 mx-10 h-screen justify-center  items-center gap-4'>
      <ShadcnToggle />
      <DuckToggle />
    </div>
  )
}

export default App
