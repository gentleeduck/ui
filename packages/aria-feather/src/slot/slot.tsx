import React from 'react'

/**
 * A simple utility component that allows passing a JSX element as a prop
 * and renders it with the passed props. If the passed element is not a JSX
 * element, it wraps it in a `div` component.
 *
 * @param {React.HTMLProps<HTMLDivElement>} [props] - The props to be passed to the rendered element.
 * @param {React.ReactNode} [props.children] - The JSX element or node to be rendered.
 * @param {boolean} [props.asChild] - Whether to render the passed element as a child of the component.
 * @param {React.HTMLProps<HTMLDivElement>} [...props] - Additional props to be passed to the rendered element.
 *
 * @returns {React.JSX.Element} The rendered element with the passed props.
 */
export function Slot({
  children,
  asChild = false,
  ...props
}: React.HTMLProps<HTMLDivElement> & {
  /** The JSX element or node to be rendered. */
  asChild?: boolean
}): React.JSX.Element {
  // if (React.Children.count(children) > 1) {
  //   return <div {...props}>{children}</div>
  // }
  //
  // return React.cloneElement(children as React.JSX.Element, {
  //   ...props,
  //   ...(children as React.JSX.Element).props,
  // })

  const _children = React.Children.toArray(children)
  if (_children.length > 1) {
    return <div {...props}>{children}</div>
  }

  return React.cloneElement(_children[0] as React.JSX.Element, {
    ...props,
    ...(_children[0] as React.JSX.Element).props,
  })
}
