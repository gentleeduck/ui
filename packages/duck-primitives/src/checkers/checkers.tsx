import svgToMiniDataURI from 'mini-svg-data-uri'

import React from 'react'

/** Renders SVG indicators to a hidden node, then exposes them as `--svg-off` / `--svg-on` data-URI CSS vars. */
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
    const offMarkup = refOff.current?.innerHTML.trim() ?? ''
    const onMarkup = refOn.current?.innerHTML.trim() ?? ''
    const hasOff = offMarkup.length > 0
    const hasOn = onMarkup.length > 0
    const newUriOff = hasOff ? svgToMiniDataURI(offMarkup) : ''
    const newUriOn = hasOn ? svgToMiniDataURI(onMarkup) : ''

    setUriOff(newUriOff)
    setUriOn(newUriOn)
    setIndicatorReady(hasOff)
    setCheckedIndicatorReady(hasOn)
  }, [])

  const inputStyle: React.CSSProperties = {
    ...(uriOff ? { '--svg-off': `url("${uriOff}")` } : {}),
    ...(uriOn ? { '--svg-on': `url("${uriOn}")` } : {}),
  } as React.CSSProperties

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
