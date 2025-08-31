import type * as RechartsPrimitive from 'recharts'
import type { THEMES } from './chart'
export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & ({ color?: string; theme?: never } | { color?: never; theme: Record<keyof typeof THEMES, string> })
}

export type ChartContextProps = {
  config: ChartConfig
}

export type ChartContainerProps = React.HTMLProps<HTMLDivElement> & {
  config: ChartConfig
  children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>['children']
}
export type ChartStyleProps = { id: string; config: ChartConfig }

export type ChartTooltipContentProps = React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
  React.HTMLProps<HTMLDivElement> & {
    hideLabel?: boolean
    hideIndicator?: boolean
    indicator?: 'line' | 'dot' | 'dashed'
    nameKey?: string
    labelKey?: string
  }

export type ChartLegendContentProps = React.HTMLProps<HTMLDivElement> &
  Pick<RechartsPrimitive.LegendProps, 'payload' | 'verticalAlign'> & {
    hideIcon?: boolean
    nameKey?: string
  }
