'use client'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@gentleduck/registry-ui/select'

export default function Demo() {
  return (
    <Select dir="rtl">
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="اختر فاكهة" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>الفواكه</SelectLabel>
          <SelectItem value="apple">تفاح</SelectItem>
          <SelectItem value="banana">موز</SelectItem>
          <SelectItem value="blueberry">توت ازرق</SelectItem>
          <SelectItem value="grapes">عنب</SelectItem>
          <SelectItem value="pineapple">اناناس</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
