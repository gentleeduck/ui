import { cn } from '@gentleduck/libs/cn'
import { Slider } from '@gentleduck/registry-ui-duckui/slider'

export default function SliderDemo() {
  return <Slider className={cn('w-[60%]')} defaultValue={[50]} max={100} />
}
