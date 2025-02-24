import { Drawer as DrawerPrimitive } from 'vaul'
import { UseDuckAlertReturnType } from '../alert-dialog/alert-dialog.types'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './drawer'

/**
 * DrawerWrapperProps
 */
export type DrawerWrapperProps = {
  trigger?: React.ComponentPropsWithoutRef<typeof DrawerTrigger>
  content: Partial<React.ComponentPropsWithoutRef<typeof DrawerContent>> & {
    _header?: React.ComponentPropsWithoutRef<typeof DrawerHeader> & {
      _title?: React.ComponentPropsWithoutRef<typeof DrawerTitle>
      _description?: React.ComponentPropsWithoutRef<typeof DrawerDescription>
    }
    _footer?: React.ComponentPropsWithoutRef<typeof DrawerFooter> & {
      _cancel?: React.ComponentPropsWithoutRef<typeof DrawerClose>
      _submit?: React.HTMLProps<HTMLDivElement>
    }
  }
  duckHook?: UseDuckAlertReturnType
} & React.ComponentProps<typeof DrawerPrimitive.Root>
