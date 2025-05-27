'use client'

import { KeyProvider, useKeyCommands } from '@gentleduck/vim'

function ComponentA() {
  useKeyCommands({
    'space+s': {
      name: 'save-file',
      execute: () => alert('Component A Save'),
    },
  })
  return <div>Component A (Press Space+S)</div>
}

function ComponentB() {
  useKeyCommands({
    'space+f': {
      name: 'format-file',
      execute: () => alert('Component B Format'),
    },
  })
  return <div>Component B (Press Space+F)</div>
}

export function App() {
  return (
    <KeyProvider debug timeoutMs={500}>
      <ComponentA />
      <ComponentB />
    </KeyProvider>
  )
}
