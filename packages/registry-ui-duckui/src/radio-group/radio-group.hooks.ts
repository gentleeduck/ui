import React from 'react'
import { RadioGroupContext } from './radio-group'

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

    // handle click on each item
    function handleClick(itemInput: HTMLInputElement, item: HTMLLIElement) {
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

      item.setAttribute('aria-checked', 'true')
      if (itemInput) {
        itemInput?.setAttribute('aria-checked', 'true')
        itemInput.checked = true
      }
    }

    // handle all the items
    for (let i = 0; i < itemsRef.current.length; i++) {
      const item = itemsRef.current[i] as HTMLLIElement
      const itemInput = item.querySelector('input') as HTMLInputElement
      const itemLabel = item.querySelector('label') as HTMLLabelElement

      // Handle default value
      if (defaultValue === item.id) {
        item.setAttribute('aria-checked', 'true')
        itemInput?.setAttribute('aria-checked', 'true')
        itemInput.checked = true
      }

      itemInput?.addEventListener('click', () => handleClick(itemInput, item))
      itemLabel.addEventListener('click', () => handleClick(itemInput, item))
    }
  }, [wrapperRef])

  return {
    wrapperRef,
    selectedItemRef,
    itemsRef,
  }
}
