import { Kbd, KbdGroup } from '@gentleduck/registry-ui-duckui/kbd'

export default function KbdDemo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-muted-foreground text-sm">
        Press{' '}
        <KbdGroup>
          <Kbd>Ctrl + K</Kbd>
          <Kbd>Ctrl + P</Kbd>
        </KbdGroup>{' '}
        to jump between files quickly
      </p>
    </div>
  )
}
