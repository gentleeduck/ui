import * as React from 'react'

function usePrevious<T>(value: T) {
  const ref = React.useRef({ value, previous: value })

  // compare-before-update so previous persists across re-renders with unchanged `value`
  return React.useMemo(() => {
    if (ref.current.value !== value) {
      ref.current.previous = ref.current.value
      ref.current.value = value
    }
    return ref.current.previous
  }, [value])
}

export { usePrevious }
