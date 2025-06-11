import * as React from 'react'

export function Slot({ children, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  if (!React.isValidElement(children)) {
    return <div {...props}>{children}</div>
  }

  return React.cloneElement(children, {
    ...props,
    ...(children as React.JSX.Element).props,
  })
}
