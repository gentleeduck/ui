import dynamic from 'next/dynamic'

const CardsDemo = dynamic(() => import('~/components/cards').then((m) => ({ default: m.CardsDemo })))

export default function ThemesPage() {
  return <CardsDemo />
}
