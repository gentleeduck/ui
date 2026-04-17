import type { Adapter, Calendar as CalendarTypes, Grid, Selection, UseCalendar } from '@gentleduck/calendar'
import type * as React from 'react'
import type { Scope } from '../libs/create-context'
import type { Primitive } from '../primitive-elements'

export namespace ICalendar {
  export type IScoped<TProps> = TProps & { __scopeCalendar?: Scope }

  export type IContext = UseCalendar.IUseCalendarReturn<Date, Selection.SelectionMode> & {
    adapter: Adapter.IDateAdapter<Date>
    mode: Selection.SelectionMode
    locale?: CalendarTypes.ICalendarLocaleConfig
  }

  type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>
  type PrimitiveButtonProps = React.ComponentPropsWithoutRef<typeof Primitive.button>

  type ConflictingProps = 'onSelect' | 'disabled' | 'children'

  export interface IRootProps
    extends Omit<PrimitiveDivProps, ConflictingProps>,
      UseCalendar.IUseCalendarConfig<Date, Selection.SelectionMode> {
    children?: React.ReactNode
  }

  export interface IDayProps extends PrimitiveButtonProps {
    day: Grid.ICalendarDay<Date>
  }

  export interface IGridProps extends PrimitiveDivProps {}

  export interface IHeaderProps extends PrimitiveDivProps {
    formatMonth?: (month: Date, adapter: Adapter.IDateAdapter<Date>) => string
  }

  export interface IMonthViewProps extends PrimitiveDivProps {}

  export interface INavProps extends PrimitiveDivProps {}

  export interface IPrevButtonProps extends PrimitiveButtonProps {
    __scopeCalendar?: Scope
  }

  export interface INextButtonProps extends PrimitiveButtonProps {
    __scopeCalendar?: Scope
  }

  export interface IWeekdaysProps extends PrimitiveDivProps {
    renderWeekday?: (weekday: string, index: number) => React.ReactNode
  }

  export interface IYearViewProps extends PrimitiveDivProps {}
}
