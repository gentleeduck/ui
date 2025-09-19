import { cn } from '@gentleduck/libs/cn'
import { SliderRange } from '@gentleduck/registry-ui-duckui/slider'

export default function SliderDemo() {
  return <SliderRange className={cn('w-[60%]')} defaultValue={[25, 75]} max={100} />
}
