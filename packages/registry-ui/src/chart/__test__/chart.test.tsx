import { describe, expect, test } from 'bun:test'
import * as React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Bar, BarChart, XAxis } from 'recharts'
import { ChartContainer } from '../chart'

const data = [{ name: 'alpha', value: 12 }]

describe('registry-ui chart', () => {
  test('ChartContainer server render does not emit invalid size warnings', () => {
    const originalWarn = console.warn
    const warnings: string[] = []

    console.warn = (...args: unknown[]) => {
      warnings.push(args.map((value) => String(value)).join(' '))
    }

    try {
      const html = renderToStaticMarkup(
        <ChartContainer
          config={{
            value: {
              color: 'hsl(var(--chart-1))',
              label: 'Value',
            },
          }}>
          <BarChart accessibilityLayer data={data}>
            <XAxis dataKey="name" hide />
            <Bar dataKey="value" fill="var(--color-value)" radius={8} />
          </BarChart>
        </ChartContainer>,
      )

      expect(html).toContain('data-slot="chart-container"')
      expect(warnings.some((message) => message.includes('The width(') && message.includes('height('))).toBe(false)
    } finally {
      console.warn = originalWarn
    }
  })
})
