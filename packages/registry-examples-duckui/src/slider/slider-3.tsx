import { cn } from '@gentleduck/libs/cn'
import { Slider } from '@gentleduck/registry-ui-duckui/slider'

export default function Slider3() {
  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <Slider className={cn('w-[60%]')} defaultValue={[33]} max={100} orientation="horizontal" />
    </div>
  )
}
