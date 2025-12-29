import type { ColorPalette } from '~/lib/colors'
import { Color } from './color'
import { ColorFormatSelector } from './color-format-selector'

export function ColorPalette({ colorPalette }: { colorPalette: ColorPalette }) {
  return (
    <div className="scroll-mt-20 rounded-lg" id={colorPalette.name}>
      <div className="flex items-center px-4">
        <div className="flex-1 pl-1 font-medium text-sm">
          <h2 className="capitalize">{colorPalette.name}</h2>
        </div>
        <ColorFormatSelector className="ml-auto" color={colorPalette.colors[0] as never} />
      </div>
      <div className="flex flex-col gap-4 py-4 sm:flex-row sm:gap-2">
        {colorPalette.colors.map((color) => (
          <Color color={color} key={color.hex} />
        ))}
      </div>
    </div>
  )
}
