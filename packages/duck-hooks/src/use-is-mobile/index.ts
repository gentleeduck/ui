import { useMediaQuery } from '../use-media-query'

/** Mobile breakpoint in px — viewports narrower than this match `useIsMobile`. */
const MOBILE_BREAKPOINT_PX = 768

/** `max-width` is inclusive, so subtract 1 to make the breakpoint behave as strict <. */
const MOBILE_MAX_WIDTH_PX = MOBILE_BREAKPOINT_PX - 1

const MOBILE_MEDIA_QUERY = `(max-width: ${MOBILE_MAX_WIDTH_PX}px)`

export function useIsMobile(): boolean {
  return useMediaQuery(MOBILE_MEDIA_QUERY)
}
