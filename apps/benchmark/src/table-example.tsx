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
import { useAtomValue, useSetAtom } from '@gentleduck/state/primitive'
import { duck_table } from './main'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@gentleduck/registry-ui-duckui/select'
import React from 'react'
export function TableDemo() {
  // return
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
  const [open, setOpen] = React.useState(false)
  const columns = useAtomValue(duck_table.atoms.columns)
  const setRows = useSetAtom(duck_table.atoms.mutatedRows)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          setRows((prev) => {
            console.log(prev)
            return [
              ...prev,
              {
                id: crypto.randomUUID(),
                invoice: 'INV011',
                method: 'Credit Card',
                status: 'Unpaid',
                amount: '$600.00',
              },
            ]
          })
          setOpen(false)
        }}>
        <DialogTrigger size={'sm'} variant={'outline'} asChild>
          <Button icon={<Plus />}>Add</Button>
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
                  <Select id={key} onValueChange={(e) => console.log(e)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a value" />
                    </SelectTrigger>
                    <SelectContent className="z-50 w-[179.7px]">
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
          <DialogFooter className="[&_button]:w-[120px]">
            <DialogClose variant={'outline'}>Cancel</DialogClose>
            <Button type="submit">Add Row</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
