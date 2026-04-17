'use client'

import * as Tooltip from '@gentleduck/primitives/tooltip'
import styles from './styles.module.css'

export default function TooltipDelayProviderInternalExample() {
  return (
    <Tooltip.TooltipProvider delayDuration={500} skipDelayDuration={280}>
      <Tooltip.Tooltip>
        <Tooltip.TooltipTrigger className={styles['trigger']}>Hover trigger</Tooltip.TooltipTrigger>
        <Tooltip.TooltipPortal>
          <Tooltip.TooltipContent className={styles['content']} side="top" sideOffset={8}>
            Delayed tooltip with shared provider timings.
          </Tooltip.TooltipContent>
        </Tooltip.TooltipPortal>
      </Tooltip.Tooltip>
    </Tooltip.TooltipProvider>
  )
}
