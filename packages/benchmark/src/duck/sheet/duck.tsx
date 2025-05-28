import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter,
} from '@gentleduck/registry-ui-duckui/sheet'
import { Label } from '@gentleduck/registry-ui-duckui/label'
import { Input } from '@gentleduck/registry-ui-duckui/input'

export default function SheetDemo({ side = 'right' }: { side?: 'left' | 'right' | 'top' | 'bottom' }) {
  return (
    <Sheet>
      <SheetTrigger>Open</SheetTrigger>
      <SheetContent renderOnce side={side}>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>Make changes to your profile here. Click save when you're done.</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" defaultValue="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" defaultValue="@peduarte" className="col-span-3" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose>Save changes</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
