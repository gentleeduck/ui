import { dstyleItem, styleItem } from '../command'

export function initRefs(
  open: boolean,
  groupsRef: React.RefObject<HTMLUListElement[] | null>,
  contentRef: React.RefObject<HTMLDivElement | null>,
  selectedItemRef: React.RefObject<HTMLLIElement | null>,
  itemsRef: React.RefObject<HTMLLIElement[]>,
  setSelectedItem: (item: HTMLLIElement) => void,
  onOpenChange: (open: boolean) => void,
  value: string,
  onValueChange: (value: string) => void,
  defaultValue: string,
) {
  const items = contentRef.current?.querySelectorAll('[duck-select-item]') as never as HTMLLIElement[]
  const groups = contentRef.current?.querySelectorAll('[duck-select-group]') as never as HTMLUListElement[]

  itemsRef.current = Array.from(items ?? [])
  groupsRef.current = Array.from(groups ?? [])

  itemsRef.current = itemsRef.current.filter(
    (item) => !(item.hasAttribute('aria-disabled') || item.getAttribute('aria-disabled') === 'true'),
  )

  // Select initial item:
  if (!selectedItemRef.current) {
    let item: HTMLLIElement | null = null

    if (value) {
      item =
        itemsRef.current.find((el) => el.getAttribute('value') === value || el.getAttribute('data-value') === value) ??
        null
    } else if (defaultValue) {
      item =
        itemsRef.current.find(
          (el) => el.getAttribute('value') === defaultValue || el.getAttribute('data-value') === defaultValue,
        ) ?? null
    } else {
      item = itemsRef.current?.[0] ?? null
    }

    if (item) {
      styleItem(item)
      item.focus()
      selectedItemRef.current = item
    }
  }

  for (let i = 0; i < itemsRef.current?.length; i++) {
    const item = itemsRef.current[i] as HTMLLIElement
    if (
      selectedItemRef.current?.getAttribute('value') === item.getAttribute('value') ||
      item.getAttribute('data-value') === value
    ) {
      styleItem(item)
    }

    item.addEventListener('mouseenter', () => {
      if (open) {
        for (let i = 0; i < itemsRef.current?.length; i++) {
          const item = itemsRef.current[i] as HTMLLIElement
          dstyleItem(item)
        }

        item?.setAttribute('aria-selected', '')
        item?.focus()
        selectedItemRef.current = item
      }
    })

    item.addEventListener('click', () => {
      selectedItemRef.current = item
      setSelectedItem(item)
      onValueChange(item.getAttribute('value') as string)
      onOpenChange(false)
    })
  }
}
