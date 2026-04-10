import { Kbd, KbdGroup } from '@gentleduck/registry-ui/kbd'

export default function Demo() {
  return (
    <div dir="rtl">
      <div className="flex flex-col items-center gap-4">
        <div dir="ltr">
          <KbdGroup>
            <Kbd>Ctrl</Kbd>
            <Kbd>Shift</Kbd>
            <Kbd>Alt</Kbd>
            <Kbd>Fn</Kbd>
          </KbdGroup>
        </div>

        <div dir="ltr">
          <KbdGroup>
            <Kbd>Ctrl</Kbd>
            <span>+</span>
            <Kbd>S</Kbd>
          </KbdGroup>
        </div>
      </div>
    </div>
  )
}
