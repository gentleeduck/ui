import { CardsDemo } from '~/components/cards'

export const dynamic = 'force-static'
export const revalidate = false

import 'public/duck-ui/themes.css'
export default function ThemesPage() {
  return <CardsDemo />
}
