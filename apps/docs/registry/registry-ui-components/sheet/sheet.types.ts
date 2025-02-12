import * as SheetPrimitive from '@radix-ui/react-dialog'
import { VariantProps } from 'class-variance-authority'
import { UseDuckAlertReturnType } from '../alert-dialog'
import { SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from './sheet'
import { sheetVariants } from './sheet.constants'

/**
 * Content of the sheet
 * @see https://www.radix-ui.com/docs/primitives/components/sheet
 */
export interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

/**
 * A wrapper component for the [Radix UI Sheet](https://www.radix-ui.com/docs/primitives/components/sheet)
 */
export type SheetWrapperProps = {
  trigger?: React.ComponentPropsWithoutRef<typeof SheetTrigger>
  content: Partial<React.ComponentPropsWithoutRef<typeof SheetContent>> & {
    _header?: React.ComponentPropsWithoutRef<typeof SheetHeader> & {
      _title?: React.ComponentPropsWithoutRef<typeof SheetTitle>
      _description?: React.ComponentPropsWithoutRef<typeof SheetDescription>
    }
    _footer?: React.ComponentPropsWithoutRef<typeof SheetFooter> & {
      _cancel?: React.ComponentPropsWithoutRef<typeof SheetClose>
      _submit?: React.HTMLProps<HTMLDivElement>
    }
  }
  duckHook?: UseDuckAlertReturnType
}
