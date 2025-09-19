import * as dialog from '@gentleduck/registry-ui-duckui/dialog'
import { Input } from '@gentleduck/registry-ui-duckui/input'
import { Label } from '@gentleduck/registry-ui-duckui/label'

export default function DialogDemo() {
  return (
    <dialog.Dialog>
      <dialog.DialogTrigger variant="outline">Edit Profile</dialog.DialogTrigger>
      <dialog.DialogContent className="sm:max-w-[425px]" renderOnce>
        <dialog.DialogHeader>
          <dialog.DialogTitle>Edit profile</dialog.DialogTitle>
          <dialog.DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </dialog.DialogDescription>
        </dialog.DialogHeader>
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
        <dialog.DialogFooter>
          <dialog.DialogTrigger>Save changes</dialog.DialogTrigger>
        </dialog.DialogFooter>
      </dialog.DialogContent>
    </dialog.Dialog>
  )
}
