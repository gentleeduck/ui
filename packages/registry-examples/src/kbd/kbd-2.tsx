import { Kbd, KbdGroup } from '@gentleduck/registry-ui/kbd'

export default function Demo() {
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
