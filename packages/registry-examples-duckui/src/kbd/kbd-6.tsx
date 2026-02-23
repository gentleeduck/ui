import { Kbd, KbdGroup } from '@gentleduck/registry-ui-duckui/kbd'

export default function KbdRtlDemo() {
  return (
    <div dir="rtl">
      <div className="flex flex-col items-center gap-4">
        <KbdGroup>
          <Kbd>Ctrl</Kbd>
          <Kbd>Shift</Kbd>
          <Kbd>Alt</Kbd>
          <Kbd>Fn</Kbd>
        </KbdGroup>
        <KbdGroup>
          <Kbd>Ctrl</Kbd>
          <span>+</span>
          <Kbd>S</Kbd>
        </KbdGroup>
      </div>
    </div>
  )
}
