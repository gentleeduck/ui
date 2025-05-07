import React from 'react'

/**
 * A simple utility component that allows passing a JSX element as a prop
 * and renders it with the passed props. If the passed element is not a JSX
 * element, it wraps it in a `div` component.
 *
 * @param {React.HTMLProps<HTMLDivElement>} [props] - The props to be passed to the rendered element.
 * @param {React.ReactNode} [props.children] - The JSX element or node to be rendered.
 * @param {React.HTMLProps<HTMLDivElement>} [...props] - Additional props to be passed to the rendered element.
 *
 * @returns {React.JSX.Element} The rendered element with the passed props.
 */
export function Slot({ children, ...props }: React.HTMLProps<HTMLDivElement>): React.JSX.Element {
  if (!React.isValidElement(children)) {
    return <div {...props}>{children}</div>
  }

  return React.cloneElement(children, {
    ...props,
    ...(children as React.JSX.Element).props,
  })
}
