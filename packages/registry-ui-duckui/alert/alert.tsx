import { cn } from '@duck/libs/cn'
import { AlertCircle, Trash } from 'lucide-react'
import React from 'react'
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Separator,
} from '~/old-registry-ui'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from '../alert-dialog'
import { Button, CommandType, buttonVariants } from '../button'

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
          className={cn('justify-between w-full rounded-sm', className)}
          variant={'ghost'}
          command={command}
          icon={<Trash />}
        >
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="p-0">
        <AlertDialogHeader>
          <h5 className="text-lg font-medium p-4 pb-0">
            Confirt deletion of{' '}
            <span className="font-mono italic underline underline-offset-4">
              {itemName.split(' ')[0]}
            </span>{' '}
            {itemName.split(' ')[1]}
          </h5>
          <Separator />
          <div className="p-4">
            <Alert
              variant={'destructive'}
              className="space-y-2 [&>svg]:left-6 [&>svg]:top-6 [&>svg~*]:pl-12"
            >
              <AlertCircle />
              <AlertTitle>This action cannot be undone.</AlertTitle>
              <AlertDescription>
                Are you sure you want to delete the selected file?
              </AlertDescription>
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
            onClick={onCancel}
          >
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
            onClick={onContinue}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
