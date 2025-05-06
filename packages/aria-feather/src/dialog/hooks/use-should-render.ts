import React from 'react'

export function useShouldRender(open: boolean, renderOnce: boolean): [boolean] {
  const [_shouldRender, setShouldRender] = React.useState<boolean>(false)
  const shouldRender = renderOnce ? _shouldRender : open

  React.useEffect(() => {
    if (open) return setShouldRender(true)
  }, [open])

  return [shouldRender]
}
