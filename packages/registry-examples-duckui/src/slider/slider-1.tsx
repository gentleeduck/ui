import { cn } from '@gentleduck/duck-libs/cn'
import { Slider } from '@gentleduck/registry-ui-duckui/slider'

export default function SliderDemo() {
  return <Slider defaultValue={[50]} max={100} className={cn('w-[60%]')} />
}
