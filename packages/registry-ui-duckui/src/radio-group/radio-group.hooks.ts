import React from 'react'

export interface RadioGroupContextType {
  value: string
  onValueChange: (value: string) => void
  wrapperRef: React.RefObject<HTMLUListElement | null>
  itemsRef: React.RefObject<HTMLLIElement[]>
  selectedItemRef: React.RefObject<HTMLLIElement | null>
}

export const RadioGroupContext = React.createContext<RadioGroupContextType | null>(null)

export function useRadioGroupContext() {
  const context = React.useContext(RadioGroupContext)
  if (!context) {
    throw new Error('useRadioGroupContext must be used within a RadioGroup')
  }
  return context
}

export function useHandleRadioClick(defaultValue?: string, value?: string, onValueChange?: (value: string) => void) {
  const wrapperRef = React.useRef<HTMLUListElement>(null)
  const selectedItemRef = React.useRef<HTMLLIElement | null>(null)
  const itemsRef = React.useRef<HTMLLIElement[]>([])

  React.useEffect(() => {
    itemsRef.current = Array.from(wrapperRef.current?.querySelectorAll('[duck-radio-item]') ?? []) as HTMLLIElement[]

    // Handle click on each item
    function handleItemClick(itemInput: HTMLInputElement, item: HTMLLIElement) {
      for (let i = 0; i < itemsRef.current.length; i++) {
        const item = itemsRef.current[i] as HTMLLIElement
        const itemInput = item.querySelector('input') as HTMLInputElement
        item.removeAttribute('aria-checked')
        onValueChange?.(item.id)
        if (itemInput) {
          itemInput.removeAttribute('aria-checked')
          itemInput.checked = false
        }
      }

      handleItem(itemInput, item)
    }

    // Handle item styles
    function handleItem(itemInput: HTMLInputElement, item: HTMLLIElement) {
      if (itemInput) {
        item.setAttribute('aria-checked', 'true')
        itemInput?.setAttribute('aria-checked', 'true')
        itemInput.checked = true
      }
    }

    // Handle all the items
    for (let i = 0; i < itemsRef.current.length; i++) {
      const item = itemsRef.current[i] as HTMLLIElement
      const itemInput = item.querySelector('input') as HTMLInputElement
      const itemLabel = item.querySelector('label') as HTMLLabelElement

      // Handle default value
      if (defaultValue === item.id || value === item.id) {
        handleItem(itemInput, item)
      }

      itemInput?.addEventListener('click', () => handleItemClick(itemInput, item))
      itemLabel.addEventListener('click', () => handleItemClick(itemInput, item))
    }
  }, [wrapperRef])

  return {
    itemsRef,
    selectedItemRef,
    wrapperRef,
  }
}
