import { describe, expect, test } from 'vitest'
import * as React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Carousel, CarouselNext, CarouselPrevious } from '../carousel'

describe('registry-ui carousel', () => {
  test('CarouselPrevious prefers a provided icon over the default arrow icon', () => {
    const html = renderToStaticMarkup(
      <Carousel>
        <CarouselPrevious icon={<span data-icon="custom-prev">P</span>} />
      </Carousel>,
    )

    expect(html).toContain('data-icon="custom-prev"')
    expect(html).not.toContain('lucide-arrow-left')
  })

  test('CarouselNext still renders the default arrow icon when no icon is provided', () => {
    const html = renderToStaticMarkup(
      <Carousel>
        <CarouselNext />
      </Carousel>,
    )

    expect(html).toContain('lucide-arrow-right')
  })
})
