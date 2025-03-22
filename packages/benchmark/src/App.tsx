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
const DuckTabs = lazy(() => import('./tabs/duck'))
const ShadcnTabs = lazy(() => import('./tabs/shadcn'))

function App() {

  return (
    <div className="flex flex-col w-11/12 mx-10 h-screen justify-center  items-center gap-4">
      <ShadcnTabs />
      <DuckTabs /> 
    </div>
  )
}

export default App
