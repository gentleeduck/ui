import React from 'react'

// import { atom, useAtom } from '@gentleduck/state/atom'
// import { selector } from '@gentleduck/state/selectors'
//

const counter = atom(0)

export function Button() {
  return (
    <div>
      <CounterText /> {/* Only this updates when count changes */}
      <CounterButton /> {/* This does NOT re-render when count updates */}
    </div>
  )
}

// ✅ Only re-renders when `counter` changes
function CounterText() {
  const count = useAtomValue(counter) // Read-only value
  return <h1>{count}</h1>
}

// ✅ Never re-renders unless button is clicked
function CounterButton() {
  const setCounter = useSetAtom(counter) // Only updates state, no subscription
  return <button onClick={() => setCounter((prev) => prev + 1)}>Click</button>
}
