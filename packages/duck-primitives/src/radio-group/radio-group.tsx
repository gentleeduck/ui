import * as React from 'react'
import { useDirection } from '../direction'
import { useControllableState } from '../hooks/use-controllable-state'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { createContextScope } from '../libs/create-context'
import { useTypeaheadListNavigation, useVimNavigation } from '../libs/list-navigation'
import { Primitive } from '../primitive-elements'
import * as RovingFocusGroup from '../roving-focus'
import { createRovingFocusGroupScope } from '../roving-focus'
import type { IRadioGroup } from './radio-group.types'

const RADIO_GROUP_NAME = 'RadioGroup'
const RADIO_GROUP_NAVIGATION_KEYS = [
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Home',
  'End',
  'PageUp',
  'PageDown',
] as const

const [createRadioGroupContext, createRadioGroupScope] = createContextScope(RADIO_GROUP_NAME, [
  createRovingFocusGroupScope,
])
const useRovingFocusGroupScope = createRovingFocusGroupScope()

const [RadioGroupProvider, useRadioGroupContext] = createRadioGroupContext<IRadioGroup.IContext>(RADIO_GROUP_NAME)

type RadioGroupElement = React.ComponentRef<typeof Primitive.div>

const RadioGroup = React.forwardRef<RadioGroupElement, IRadioGroup.IProps>(
  (props: IRadioGroup.IScoped<IRadioGroup.IProps>, forwardedRef) => {
    const {
      __scopeRadioGroup,
      value: valueProp,
      defaultValue,
      onValueChange,
      disabled = false,
      required = false,
      name,
      dir,
      orientation,
      loop = true,
      ...groupProps
    } = props
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeRadioGroup)
    const getItems = RovingFocusGroup.useCollection(rovingFocusGroupScope['__scopeRovingFocusGroup'])
    const direction = useDirection(dir)
    const isNavigationKeyPressedRef = React.useRef(false)
    const navigationResetTimerRef = React.useRef<number | null>(null)

    const [value = '', setValue] = useControllableState({
      prop: valueProp,
      defaultProp: defaultValue ?? '',
      onChange: onValueChange,
      caller: RADIO_GROUP_NAME,
    })

    const getEnabledNavigationItems = React.useCallback((): IRadioGroup.INavigationItem[] => {
      return getItems()
        .filter((item) => item.focusable)
        .map((item) => {
          const node = item.ref.current as HTMLElement | null
          if (!node) return null

          const value = node.getAttribute('data-value') ?? ''
          const textValue = (
            node.getAttribute('data-text-value') ??
            node.getAttribute('aria-label') ??
            value ??
            node.textContent ??
            ''
          ).trim()

          return {
            node,
            value,
            textValue,
          }
        })
        .filter((item): item is IRadioGroup.INavigationItem => item !== null)
    }, [getItems])

    const [, handleTypeaheadSearch, resetTypeaheadState] = useTypeaheadListNavigation<IRadioGroup.INavigationItem>({
      getItems: getEnabledNavigationItems,
      getItemElement: (item) => item.node,
      getItemTextValue: (item) => item.textValue,
      onMatch: (item) => {
        isNavigationKeyPressedRef.current = true
        setValue(item.value)

        // Keep the navigation flag true while focus changes so item onFocus can commit selection.
        setTimeout(() => {
          item.node.focus()
          isNavigationKeyPressedRef.current = false
        })
      },
    })

    const scheduleNavigationReset = React.useCallback(() => {
      if (navigationResetTimerRef.current !== null) {
        window.clearTimeout(navigationResetTimerRef.current)
      }
      navigationResetTimerRef.current = window.setTimeout(() => {
        isNavigationKeyPressedRef.current = false
        navigationResetTimerRef.current = null
      })
    }, [])

    const handleVimKey = useVimNavigation({
      onNavigate: () => {
        resetTypeaheadState()
        isNavigationKeyPressedRef.current = true

        // useVimNavigation focuses on a timeout; clear shortly after.
        window.setTimeout(() => {
          isNavigationKeyPressedRef.current = false
        }, 16)
      },
    })

    React.useEffect(() => {
      return () => {
        if (navigationResetTimerRef.current !== null) {
          window.clearTimeout(navigationResetTimerRef.current)
        }
      }
    }, [])

    return (
      <RadioGroupProvider
        scope={__scopeRadioGroup}
        value={value}
        onValueChange={setValue}
        disabled={disabled}
        required={required}
        name={name}
        dir={direction}
        isNavigationKeyPressedRef={isNavigationKeyPressedRef}>
        <RovingFocusGroup.Root asChild {...rovingFocusGroupScope} orientation={orientation} dir={direction} loop={loop}>
          <Primitive.div
            role="radiogroup"
            data-slot="radio-group"
            aria-required={required}
            aria-orientation={orientation}
            data-disabled={disabled ? '' : undefined}
            dir={direction}
            {...groupProps}
            ref={forwardedRef}
            onKeyDown={composeEventHandlers(
              groupProps.onKeyDown,
              (event) => {
                const enabledItems = getEnabledNavigationItems()
                const nodes = enabledItems.map((item) => item.node)

                if (handleVimKey(event, nodes)) return

                const isModifierKey = event.ctrlKey || event.altKey || event.metaKey
                const isCharacterKey = event.key.length === 1 && event.key !== ' '
                if (!isModifierKey && isCharacterKey) {
                  handleTypeaheadSearch(event.key)
                }

                if ((RADIO_GROUP_NAVIGATION_KEYS as readonly string[]).includes(event.key)) {
                  isNavigationKeyPressedRef.current = true
                  resetTypeaheadState()
                  scheduleNavigationReset()
                }
              },
              { checkForDefaultPrevented: false },
            )}
            onBlur={composeEventHandlers(groupProps.onBlur, (event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                if (navigationResetTimerRef.current !== null) {
                  window.clearTimeout(navigationResetTimerRef.current)
                  navigationResetTimerRef.current = null
                }
                isNavigationKeyPressedRef.current = false
                resetTypeaheadState()
              }
            })}
          />
        </RovingFocusGroup.Root>
      </RadioGroupProvider>
    )
  },
)

RadioGroup.displayName = RADIO_GROUP_NAME

export {
  createRadioGroupScope,
  RADIO_GROUP_NAME,
  RadioGroup,
  RadioGroupProvider,
  useRadioGroupContext,
  useRovingFocusGroupScope,
}
