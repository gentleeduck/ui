import { Slider } from '@gentleduck/registry-ui-duckui/slider'

export default function SliderRtlDemo() {
  return (
    <div dir="rtl">
      <Slider defaultValue={[75]} max={100} step={1} className="mx-auto w-full max-w-xs" />
    </div>
  )
}
