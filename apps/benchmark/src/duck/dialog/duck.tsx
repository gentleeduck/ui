import { Button } from '@gentleduck/registry-ui-duckui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@gentleduck/registry-ui-duckui/dialog'
import { Input } from '@gentleduck/registry-ui-duckui/input'
import { Label } from '@gentleduck/registry-ui-duckui/label'
import SelectDemo from '../select/duck'

export default function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline">Edit Duck</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="name">
              Name
            </Label>
            <Input className="col-span-3" defaultValue="Pedro Duarte" id="name" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="username">
              Username
            </Label>
            <Input className="col-span-3" defaultValue="@peduarte" id="username" />
          </div>
        </div>
        <DialogFooter>
          <DialogTrigger>Save changes</DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
