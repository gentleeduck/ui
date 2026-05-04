## About

The carousel component is built using the [Embla Carousel](https://www.embla-carousel.com/) library.

## Philosophy

Carousels are controversial  -  done wrong, they hide content behind interaction. We wrap Embla Carousel because it handles the hard parts (touch gestures, snap points, accessibility, RTL support) without opinions about visual design. Our layer adds the gentleduck/ui styling and exposes Previous/Next controls as composable elements.

## How It's Built

## Installation

  CLI
  Manual

```bash
npx @gentleduck/cli add carousel
```

Install the following dependencies:

```bash
npm install embla-carousel-react @gentleduck/libs
```

Add the `Button` component to your project.

The `Carousel` component uses the [`Button`](/duck-ui/components/button) component. Make sure you have it installed in your project.

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx showLineNumbers

  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
```

```tsx showLineNumbers

```

## Examples

### Sizes

To set the size of the items, you can use the `basis` utility class on the ``.

```tsx showLineNumbers /-ml-4/ /pl-4/
` and a negative `-ml-[VALUE]` on the ``.

} className="mt-6">
  **Why:** I have been using the `gap` property or a `grid` layout on the `
  ` but it required a lot of math and mental effort to get the
  spacing right. I found `pl-[VALUE]` and `-ml-[VALUE]` utilities much easier to
  use.

You can always adjust this in your own project if you need to.

```tsx showLineNumbers /-ml-4/ /pl-4/

## Behavior

### Options

You can pass options to the carousel using the `opts` prop. See the [Embla Carousel docs](https://www.embla-carousel.com/api/options/) for more information.

```tsx showLineNumbers {2-5}

    <CarouselItem>...</CarouselItem>
    <CarouselItem>...</CarouselItem>
    <CarouselItem>...</CarouselItem>

```

### API

Use a state and the `setApi` props to get an instance of the carousel API.

```tsx showLineNumbers {1,4,22}

export function Example() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  return (

        <CarouselItem>...</CarouselItem>
        <CarouselItem>...</CarouselItem>
        <CarouselItem>...</CarouselItem>

  )
}
```

### Events

You can listen to events using the api instance from `setApi`.

```tsx showLineNumbers {1,4-14,16}

export function Example() {
  const [api, setApi] = React.useState<CarouselApi>()

  React.useEffect(() => {
    if (!api) {
      return
    }

    api.on("select", () => {
      // Do something on select.
    })
  }, [api])

  return (

        <CarouselItem>...</CarouselItem>
        <CarouselItem>...</CarouselItem>
        <CarouselItem>...</CarouselItem>

  )
}
```

See the [Embla Carousel docs](https://www.embla-carousel.com/api/events/) for more information on using events.

### Plugins

You can use the `plugins` prop to add plugins to the carousel.

```ts showLineNumbers {1,6-10}

export function Example() {
  return (

      // ...

  )
}
```

See the [Embla Carousel docs](https://www.embla-carousel.com/api/plugins/) for more information on using plugins.

## RTL Support

Direction is resolved through the shared primitives direction module. Use a local `dir="rtl"` override when the component exposes it, or set `DirectionProvider` at app/root level for global RTL/LTR behavior.

## API Reference

### Carousel

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `opts` | `CarouselOptions` | - | Configuration options passed to `embla-carousel` |
| `plugins` | `CarouselPlugin` | - | Array of Embla plugins |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Carousel axis direction |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction override. Resolved via `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `setApi` | `(api: CarouselApi) => void` | - | Callback to expose the Embla API |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the content div |

### CarouselContent

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS classes applied to the content container |
| `children` | `React.ReactNode` | - | `CarouselItem` elements |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the content div |

### CarouselItem

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS classes applied to the item (use `basis-*` utilities to control size) |
| `children` | `React.ReactNode` | - | Slide content |
| `...props` | `React.HTMLProps<HTMLLIElement>` | - | Additional props to spread to the li element |

### CarouselPrevious

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `string` | `'outline'` | Variant prop for the `Button` component |
| `size` | `string` | `'icon'` | Size prop for the `Button` component |
| `text` | `string` | `'Previous slide'` | Accessible label for the button (`aria-label`) |
| `...props` | `React.ComponentPropsWithoutRef<typeof Button>` | - | Additional props inherited from `Button`. |

### CarouselNext

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `string` | `'outline'` | Variant prop for the `Button` component |
| `size` | `string` | `'icon'` | Size prop for the `Button` component |
| `text` | `string` | `'Next slide'` | Accessible label for the button (`aria-label`) |
| `...props` | `React.ComponentPropsWithoutRef<typeof Button>` | - | Additional props inherited from `Button`. |

### Types

```ts
type CarouselApi = UseEmblaCarouselType[1]
type CarouselOptions = Parameters<typeof useEmblaCarousel>[0]
type CarouselPlugin = Parameters<typeof useEmblaCarousel>[1]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: 'horizontal' | 'vertical'
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: CarouselApi
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
} & CarouselProps
```