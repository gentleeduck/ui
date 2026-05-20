import type * as RechartsPrimitive from 'recharts'
import type { THEMES } from './chart'

export interface IChartConfig {
  [key: string]:
    | {
        label?: React.ReactNode
        icon?: React.ComponentType
        color?: string
        theme?: never
      }
    | {
        label?: React.ReactNode
        icon?: React.ComponentType
        color?: never
        theme: Record<keyof typeof THEMES, string>
      }
}

export type ChartConfig = IChartConfig

export interface IChartContextProps {
  config: IChartConfig
}

export type ChartContextProps = IChartContextProps

export interface IChartContainerProps extends React.HTMLProps<HTMLDivElement> {
  config: IChartConfig
  children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>['children']
}
export type ChartContainerProps = IChartContainerProps

export interface IChartStyleProps {
  id: string
  config: IChartConfig
}
export type ChartStyleProps = IChartStyleProps

export type IChartTooltipContentProps = Partial<
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
export type ChartTooltipContentProps = IChartTooltipContentProps

export interface IChartLegendContentProps extends React.HTMLProps<HTMLDivElement> {
  payload?: RechartsPrimitive.LegendPayload[]
  verticalAlign?: 'top' | 'middle' | 'bottom'
  hideIcon?: boolean
  nameKey?: string
}
export type ChartLegendContentProps = IChartLegendContentProps
