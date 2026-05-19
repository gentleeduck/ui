import { cn } from '@gentleduck/libs/cn'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next/types'
import { ChartDisplay } from '~/components/charts'
import { absoluteUrl } from '~/lib'
import { charts } from '../charts'

export const revalidate = false
export const dynamic = 'force-static'
export const dynamicParams = false

interface IChartPageProps {
  params: Promise<{
    type: string
  }>
}

const chartTypes = ['area', 'bar', 'line', 'pie', 'radar', 'radial', 'tooltip'] as const
type ChartType = (typeof chartTypes)[number]

export async function generateStaticParams() {
  return chartTypes.map((type) => ({
    type,
  }))
}

export async function generateMetadata({ params }: IChartPageProps): Promise<Metadata> {
  const { type } = await params
  return {
    alternates: {
      canonical: absoluteUrl(`/charts/${type}`),
    },
  }
}

export default async function ChartPage({ params }: IChartPageProps) {
  const { type } = await params

  if (!chartTypes.includes(type as ChartType)) {
    return notFound()
  }

  const chartType = type as ChartType
  const chartList = charts[chartType]

  return (
    <div className="grid flex-1 gap-12 pb-16 lg:gap-24 lg:pb-24">
      <h2 className="sr-only">{type.charAt(0).toUpperCase() + type.slice(1)} Charts</h2>
      <div className="grid flex-1 scroll-mt-20 items-stretch gap-10 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:gap-10">
        {Array.from({ length: 12 }).map((_, index) => {
          const chart = chartList[index]
          return (
            chart && (
              <ChartDisplay
                className={cn(chart.fullWidth && 'md:col-span-2 lg:col-span-3')}
                key={chart.id}
                name={chart.id}>
                <chart.component />
              </ChartDisplay>
            )
          )
        })}
      </div>
    </div>
  )
}
