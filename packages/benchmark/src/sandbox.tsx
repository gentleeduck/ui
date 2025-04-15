import { Button } from "@gentelduck/registry-ui-duckui/button"
import { Dialog, DialogContent,DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@gentelduck/registry-ui-duckui/experimental/dialog"
import { Input } from "@gentelduck/registry-ui-duckui/input"
import { Label } from "@gentelduck/registry-ui-duckui/label"

export default function Sandbox() {
  return (
    <>
      <Dialog>
        <DialogTrigger className="absolute top-0 left-0" variant={'outline'}>Edit Profile</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='name' className='text-right'>
                  Name
                </Label>
                <Input id='name' value='wild duck' className='col-span-3' />
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='username' className='text-right'>
                  Username
                </Label>
                <Input
                  id='username'
                  value='@wildduck2'
                  className='col-span-3'
                />
              </div>
            </div>

            <DialogFooter>
              <Button>Save changes</Button>
            </DialogFooter>
          </DialogContent>
      </Dialog>
    </>
  )
}