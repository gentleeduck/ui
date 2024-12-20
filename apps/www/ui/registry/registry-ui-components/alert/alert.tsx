import {
  Alert,
  AlertDescription,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertTitle,
  Separator,
} from '@/registry/default/ui'
import { Button, buttonVariants } from '../button'
import { AlertCircle, Trash } from 'lucide-react'
import { cn } from '@/lib'

export const AlertDelete = ({
  itemName,
  onCancel,
  onContinue,
}: {
  itemName: string
  onCancel: () => void
  onContinue: () => void
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size={'xs'}
          className="w-full rounded-sm"
          variant={'ghost'}
          icon={{ children: Trash }}
        >
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="p-0">
        <AlertDialogHeader>
          <h5 className="text-lg font-medium p-4 pb-0"> Confirt deletion of {itemName}</h5>
          <Separator />
          <div className="p-4">
            <Alert
              variant={'destructive'}
              className="space-y-2 [&>svg]:left-6 [&>svg]:top-6 [&>svg~*]:pl-12"
            >
              <AlertCircle />
              <AlertTitle>This action cannot be undone.</AlertTitle>
              <AlertDescription>Are you sure you want to delete the selected file?</AlertDescription>
            </Alert>
          </div>
          <Separator />
        </AlertDialogHeader>

        <AlertDialogFooter className="px-4 pb-4">
          <AlertDialogCancel className={cn(buttonVariants({ variant: 'outline', className: 'px-8', size: 'sm' }))}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className={cn(
              buttonVariants({ variant: 'destructive', border: 'destructive', className: 'px-8', size: 'sm' })
            )}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
