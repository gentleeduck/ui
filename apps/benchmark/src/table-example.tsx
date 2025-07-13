import { Plus, ToggleLeft } from 'lucide-react'
import {
  DuckTable,
  DuckTablePagination,
  DuckTableRowPerPage,
  DuckTableSelectedRows,
  DuckTableShape,
} from './table-advanced'
import {
  DuckTableBar,
  DuckTableColumnView,
  DuckTableLeftSide,
  DuckTableRightSide,
  DuckTableSearch,
} from './table-advanced.chunks'
import { Button } from '@gentleduck/registry-ui-duckui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@gentleduck/registry-ui-duckui/dialog'
import { Label } from '@gentleduck/registry-ui-duckui/label'
import { Input } from '@gentleduck/registry-ui-duckui/input'
import { useAtomValue } from '@gentleduck/state/primitive'
import { duck_table } from './main'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@gentleduck/registry-ui-duckui/select'
export function TableDemo() {
  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden">
      <DuckTable className="w-[765px] flex flex-col gap-2.5 border rounded-md p-4 overflow-x-hidden">
        <DuckTableBar>
          <DuckTableRightSide>
            <DuckTableSearch />
          </DuckTableRightSide>

          <DuckTableLeftSide>
            <DuckTableColumnView />
            <DuckTableAdd />
          </DuckTableLeftSide>
        </DuckTableBar>
        <DuckTableShape />

        <DuckTableBar>
          <DuckTableRightSide>
            <DuckTableSelectedRows />
          </DuckTableRightSide>

          <DuckTableLeftSide className="gap-8">
            <DuckTableRowPerPage />
            <DuckTablePagination />
          </DuckTableLeftSide>
        </DuckTableBar>
      </DuckTable>
    </div>
  )
}

export function DuckTableAdd() {
  const columns = useAtomValue(duck_table.atoms.columns)
  return (
    <Dialog>
      <form onSubmit={(e) => e.preventDefault()}>
        <DialogTrigger icon={<Plus />} size={'sm'} variant={'outline'}>
          Add
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Row</DialogTitle>
            <DialogDescription>Fill out the form below to add a new row.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 grid-cols-2">
            {Object.entries(columns).map(([key, value]) =>
              value.enum?.length ? (
                <div key={key} className="grid gap-3">
                  <Label htmlFor={key}>{key}</Label>
                  <Select name={key}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a value" />
                    </SelectTrigger>
                    <SelectContent className="z-50">
                      {value.enum.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div key={key} className="grid gap-3">
                  <Label htmlFor={key}>{key}</Label>
                  <Input id={key} name={key} placeholder={`Enter ${key}...`} />
                </div>
              ),
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Add Row</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
