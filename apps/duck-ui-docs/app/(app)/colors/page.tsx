import { getColors } from '@gentleduck/docs/lib'
import { ColorPalette } from '~/components/colors'

export const dynamic = 'force-static'
export const revalidate = false

export default function ColorsPage() {
  const colors = getColors()

  return (
    <div className="grid gap-8 lg:gap-16 xl:gap-20">
      {colors.map((colorPalette) => (
        <ColorPalette colorPalette={colorPalette} key={colorPalette.name} />
      ))}
    </div>
  )
}
