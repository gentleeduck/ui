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

export type ChartTooltipContentProps = Partial<
  Omit<RechartsPrimitive.TooltipProps<string | number, string | number>, 'content'>
> &
  React.HTMLProps<HTMLDivElement> & {
    hideLabel?: boolean
    hideIndicator?: boolean
    indicator?: 'line' | 'dot' | 'dashed'
    nameKey?: string
    labelKey?: string
    payload?: RechartsPrimitive.TooltipPayloadEntry<string | number, string | number>[]
    active?: boolean
  }

export type ChartLegendContentProps = React.HTMLProps<HTMLDivElement> & {
  payload?: RechartsPrimitive.LegendPayload[]
  verticalAlign?: 'top' | 'middle' | 'bottom'
  hideIcon?: boolean
  nameKey?: string
}
