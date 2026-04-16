import { Arrow } from '../arrow'
import { useContentContext } from './content'
import type { IPopper } from './popper.types'

const ARROW_NAME = 'PopperArrow'

const OPPOSITE_SIDE: Record<IPopper.Side, IPopper.Side> = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
}

export function PopperArrow({ ref, ...props }: IPopper.IScoped<IPopper.IArrowProps>) {
  const { __scopePopper, ...arrowProps } = props
  const contentContext = useContentContext(ARROW_NAME, __scopePopper)
  const baseSide = OPPOSITE_SIDE[contentContext.placedSide]

  return (
    <span
      data-slot="popper-arrow"
      ref={contentContext.onArrowChange}
      style={{
        position: 'absolute',
        left: contentContext.arrowX,
        top: contentContext.arrowY,
        [baseSide]: 0,
        transformOrigin: {
          top: '',
          right: '0 0',
          bottom: 'center 0',
          left: '100% 0',
        }[contentContext.placedSide],
        transform: {
          top: 'translateY(100%)',
          right: 'translateY(50%) rotate(90deg) translateX(-50%)',
          bottom: 'rotate(180deg)',
          left: 'translateY(50%) rotate(-90deg) translateX(50%)',
        }[contentContext.placedSide],
        visibility: contentContext.shouldHideArrow ? 'hidden' : undefined,
      }}>
      <Arrow {...arrowProps} ref={ref} style={{ ...arrowProps.style, display: 'block' }} />
    </span>
  )
}

PopperArrow.displayName = ARROW_NAME
