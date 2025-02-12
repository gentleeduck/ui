import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './alert-dialog'
import { SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '../sheet'
import { DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '../drawer'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../dialog'

/**
 * Alert Dialog State
 */
export interface StateType {
  shape: boolean
  alert: boolean
}

/**
 * UseDuckAlertReturnType
 */
export type UseDuckAlertReturnType = {
  handleAlertCancel: () => void
  handleAlertContinue: () => void
  handleOpenChange: (drawerState: boolean) => void
  state: StateType
  setState: React.Dispatch<React.SetStateAction<StateType>>
}

/**
 * UserDuckAlertProps
 */
export type UserDuckAlertProps<T> = Pick<AlertDialogSheetProps<T>, 'state'>

export type AlertDialogWrapperType = {
  alertTrigger: React.ComponentPropsWithoutRef<typeof AlertDialogTrigger>
  alertContent: React.ComponentPropsWithoutRef<typeof AlertDialogContent> & {
    _header?: React.ComponentPropsWithoutRef<typeof AlertDialogHeader> & {
      _title?: React.ComponentPropsWithoutRef<typeof AlertDialogTitle>
      _description?: React.ComponentPropsWithoutRef<typeof AlertDialogDescription>
    }
    _footer?: React.ComponentPropsWithoutRef<typeof AlertDialogFooter> & {
      _cancel?: React.ComponentPropsWithoutRef<typeof AlertDialogCancel>
      _submit?: React.ComponentPropsWithoutRef<typeof AlertDialogAction>
    }
  }
  duckHook?: UseDuckAlertReturnType
}

/**
 * AlertDialogSheetProps
 */
export type AlertDialogSheetProps<T = string> = {
  state: T
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
} & AlertDialogWrapperType

/**
 * AlertDialogDrawerProps
 */
export type AlertDialogDrawerProps<T = string> = {
  state: T
  alertTrigger: React.ComponentPropsWithoutRef<typeof AlertDialogTrigger>
  alertContent: React.ComponentPropsWithoutRef<typeof AlertDialogContent> & {
    _header?: React.ComponentPropsWithoutRef<typeof AlertDialogHeader> & {
      _title?: React.ComponentPropsWithoutRef<typeof AlertDialogTitle>
      _description?: React.ComponentPropsWithoutRef<typeof AlertDialogDescription>
    }
    _footer?: React.ComponentPropsWithoutRef<typeof AlertDialogFooter> & {
      _cancel?: React.ComponentPropsWithoutRef<typeof AlertDialogCancel>
      _submit?: React.ComponentPropsWithoutRef<typeof AlertDialogAction>
    }
  }
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
}

/**
 * AlertDialogDialogProps
 */
export type AlertDialogDialogProps<T = string> = {
  state: T
  alertTrigger: React.ComponentPropsWithoutRef<typeof AlertDialogTrigger>
  alertContent: React.ComponentPropsWithoutRef<typeof AlertDialogContent> & {
    _header?: React.ComponentPropsWithoutRef<typeof AlertDialogHeader> & {
      _title?: React.ComponentPropsWithoutRef<typeof AlertDialogTitle>
      _description?: React.ComponentPropsWithoutRef<typeof AlertDialogDescription>
    }
    _footer?: React.ComponentPropsWithoutRef<typeof AlertDialogFooter> & {
      _cancel?: React.ComponentPropsWithoutRef<typeof AlertDialogCancel>
      _submit?: React.ComponentPropsWithoutRef<typeof AlertDialogAction>
    }
  }
  content: Partial<React.ComponentPropsWithoutRef<typeof DialogContent>> & {
    _header?: React.ComponentPropsWithoutRef<typeof DialogHeader> & {
      _title?: React.ComponentPropsWithoutRef<typeof DialogTitle>
      _description?: React.ComponentPropsWithoutRef<typeof DialogDescription>
    }
    _footer?: React.ComponentPropsWithoutRef<typeof DialogFooter> & {
      _cancel?: React.ComponentPropsWithoutRef<typeof DialogClose>
      _submit?: React.HTMLProps<HTMLDivElement>
    }
  }
}
