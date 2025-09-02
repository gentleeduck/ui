import { cn } from '@gentleduck/duck-libs/cn'
import { SliderRange } from '@gentleduck/registry-ui-duckui/slider'

export default function SliderDemo() {
  return <SliderRange defaultValue={[25, 75]} max={100} className={cn('w-[60%]')} />
}
