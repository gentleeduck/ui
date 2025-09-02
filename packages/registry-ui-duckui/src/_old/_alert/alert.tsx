import { cn } from '@gentleduck/libs/cn'
import { VariantProps } from 'class-variance-authority'
import { AlertCircle, Trash } from 'lucide-react'
import React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from '../alert-dialog'
import { Button, buttonVariants } from '../button'
import { Separator } from '../separator'
import { alertVariants } from './alert.constants'

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
))
Alert.displayName = 'Alert'

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn('mb-1 font-medium leading-none tracking-tight', className)} {...props} />
  ),
)
AlertTitle.displayName = 'AlertTitle'

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-sm [&_p]:leading-relaxed', className)} {...props} />
  ),
)
AlertDescription.displayName = 'AlertDescription'

export { Alert, AlertTitle, AlertDescription }

export const UploadAlertDelete = ({
  itemName,
  className,
  command,
  onCancel,
  onContinue,
}: {
  itemName: string
  className?: string
  command?: CommandType
  onCancel: () => void
  onContinue: () => void
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size={'xs'}
          className={cn('justify-between w-full rounded-xs', className)}
          variant={'ghost'}
          command={command}
          icon={<Trash />}>
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="p-0">
        <AlertDialogHeader>
          <h5 className="text-lg font-medium p-4 pb-0">
            Confirt deletion of{' '}
            <span className="font-mono italic underline underline-offset-4">{itemName.split(' ')[0]}</span>{' '}
            {itemName.split(' ')[1]}
          </h5>
          <Separator />
          <div className="p-4">
            <Alert variant={'destructive'} className="space-y-2 [&>svg]:left-6 [&>svg]:top-6 [&>svg~*]:pl-12">
              <AlertCircle />
              <AlertTitle>This action cannot be undone.</AlertTitle>
              <AlertDescription>Are you sure you want to delete the selected file?</AlertDescription>
            </Alert>
          </div>
          <Separator />
        </AlertDialogHeader>

        <AlertDialogFooter className="px-4 pb-4">
          <AlertDialogCancel
            className={cn(
              buttonVariants({
                variant: 'outline',
                className: 'px-8',
                size: 'sm',
              }),
            )}
            onClick={onCancel}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className={cn(
              buttonVariants({
                variant: 'destructive',
                border: 'destructive',
                className: 'px-8',
                size: 'sm',
              }),
            )}
            onClick={onContinue}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
