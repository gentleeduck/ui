import * as React from 'react'
import ReactDOM from 'react-dom'
import { useLayoutEffect } from './layout'

export interface PortalProps extends React.HTMLProps<HTMLDivElement> {
  /**
   * An optional container where the portaled content should be appended.
   */
  container?: Element | DocumentFragment | null
}

function Portal({ container, ref, ...props }: PortalProps) {
  const [mounted, setMounted] = React.useState(false)

  // Wait for the component to mount before rendering the portal
  useLayoutEffect(() => setMounted(true), [])

  // Default to appending to document.body if no container is provided
  const _container = container ?? (mounted ? document.body : null)

  // Only render portal if mounted and container is available
  if (!mounted || !_container) {
    return null
  }

  // Forward ref to the portal container div
  return ReactDOM.createPortal(<div ref={ref} {...props} />, _container)
}

export { Portal }
   
   
   
  
   
   
  
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
