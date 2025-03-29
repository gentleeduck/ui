// import NativeButton from './duck/button/native'
// import NativeTextarea from './duck/textarea/native'
// import DuckButton from './duck/button/duck'
// import ShadcnButton from './duck/button/button'
// import DuckTextarea from './duck/textarea/duck'
// import ShadcnTextarea from './duck/textarea/textarea'
// import DuckTabs from './duck/tabs/duck'
// import ShadcnTabs from './duck/tabs/tabs'
// import DuckToggleGroup from './duck/toggle-group/duck'
// import ShadcnToggleGroup from './duck/toggle-group/toggle-group'
// import DuckToggle from './duck/toggle/duck'
// import ShadcnToggle from './duck/toggle/toggle'
// import DuckBadge from './duck/badge/duck'
// import ShadcnBadge from './duck/badge/badge'

// import { lazy } from 'react'

// import DuckLabel from './duck/label/duck'
// import ShadcnLabel from './duck/label/label'
// import DuckCheckbox from './duck/checkbox/duck'
// import ShadcnCheckbox from './duck/checkbox/checkbox'
// import DuckSwitch from './duck/switch/duck'
// import ShadcnSwitch from './duck/switch/switch'
// const ShadcnSwitch = lazy(()=> import('./duck/switch/switch'))
// const DuckSwitch = lazy(()=> import('./duck/switch/duck'))

function Ui() {
  return (<>
    {/* <div className='flex flex-col gap-4 p-4'>
      <NativeButton />
      <NativeTextarea />
    </div> */}

    {/* <div className='flex flex-col gap-4 p-4'>
      <DuckButton />
      <DuckTextarea />
      <DuckTabs />
      <DuckToggleGroup />
      <DuckToggle />
      <DuckBadge />
      <DuckLabel />
      <DuckCheckbox />
      <DuckSwitch />
    </div>

    <div className='flex flex-col gap-4 p-4'>
      <ShadcnButton />
      <ShadcnTextarea />
      <ShadcnTabs />
      <ShadcnToggleGroup />
      <ShadcnToggle />
      <ShadcnBadge />
      <ShadcnLabel />
      <ShadcnCheckbox />
      <ShadcnSwitch />
    </div> */}
  </>

  )
}

function App() {
  return (
    <div className='flex flex-col w-11/12 mx-10 h-screen justify-center  items-center gap-4'>
      <Ui />
      {/* <ShadcnSwitch />
      <DuckSwitch /> */}

    </div>
  )
}

export default App
