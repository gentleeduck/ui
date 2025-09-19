import svgToMiniDataURI from 'mini-svg-data-uri'

import React from 'react'

/**
 * Hook to convert React SVG elements into mini data URIs
 * and provide a hidden renderer node for both states
 * and style props for an input using CSS variables.
 */
export function useSvgIndicator({
  indicator,
  checkedIndicator,
}: {
  indicator?: React.ReactNode
  checkedIndicator?: React.ReactNode
}) {
  const refOff = React.useRef<HTMLDivElement>(null)
  const refOn = React.useRef<HTMLDivElement>(null)
  const [uriOff, setUriOff] = React.useState<string>('')
  const [uriOn, setUriOn] = React.useState<string>('')
  const [indicatorReady, setIndicatorReady] = React.useState<boolean>(false)
  const [checkedIndicatorReady, setCheckedIndicatorReady] = React.useState<boolean>(false)

  React.useEffect(() => {
    const hasOff = Boolean(refOff.current?.innerHTML.trim())
    const hasOn = Boolean(refOn.current?.innerHTML.trim())
    const newUriOff = hasOff ? svgToMiniDataURI(refOff.current?.innerHTML.trim()) : ''
    const newUriOn = hasOn ? svgToMiniDataURI(refOn.current?.innerHTML.trim()) : ''

    setUriOff(newUriOff)
    setUriOn(newUriOn)
    setIndicatorReady(hasOff)
    setCheckedIndicatorReady(hasOn)
  }, [indicator, checkedIndicator])

  // CSS style to attach to the input element with both variables
  const inputStyle: React.CSSProperties = {
    ...(uriOff ? { '--svg-off': `url("${uriOff}")` } : {}),
    ...(uriOn ? { '--svg-on': `url("${uriOn}")` } : {}),
  } as React.CSSProperties

  // Combined hidden node rendering both SVGs
  const SvgIndicator: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => (
    <>
      {indicator && (
        <div aria-hidden hidden {...props} ref={refOff}>
          {indicator}
        </div>
      )}
      {checkedIndicator && (
        <div aria-hidden hidden {...props} ref={refOn}>
          {checkedIndicator}
        </div>
      )}
    </>
  )

  return {
    checkedIndicatorReady,
    indicatorReady,
    inputStyle,
    SvgIndicator,
  }
}
