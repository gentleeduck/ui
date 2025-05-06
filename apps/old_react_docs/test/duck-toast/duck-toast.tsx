'use client'

import * as React from 'react'
import ReactDOM from 'react-dom'

import { getDocumentDirection, ToastState, _cn } from './duck-toast.lib'
import { type HeightT, type ToasterProps, type ToastT, type ToastToDismiss } from './duck-toast.types'
import { GAP, TOAST_WIDTH, VIEWPORT_OFFSET, VISIBLE_TOASTS_AMOUNT } from '../duck-toast/duck-toast.constants'
import './duck-toast.style.css'
import { Toast } from './duck-toast-item'

export const Toaster = React.forwardRef<HTMLElement, ToasterProps>(function Toaster(props, ref) {
  const {
    invert,
    position = 'bottom-right',
    hotkey = ['altKey', 'KeyT'],
    expand,
    closeButton,
    className,
    offset,
    theme = 'light',
    richColors,
    duration,
    style,
    visibleToasts = VISIBLE_TOASTS_AMOUNT,
    toastOptions,
    dir = getDocumentDirection(),
    gap = GAP,
    loadingIcon,
    icons,
    containerAriaLabel = 'Notifications',
    pauseWhenPageIsHidden,
    cn = _cn,
  } = props
  const [toasts, setToasts] = React.useState<ToastT[]>([])
  const possiblePositions = React.useMemo(() => {
    return Array.from(
      new Set([position].concat(toasts.filter((toast) => toast.position).map((toast) => toast.position))),
    )
  }, [toasts, position])
  const [heights, setHeights] = React.useState<HeightT[]>([])
  const [expanded, setExpanded] = React.useState(false)
  const [interacting, setInteracting] = React.useState(false)
  const [actualTheme, setActualTheme] = React.useState(
    theme !== 'system'
      ? theme
      : typeof window !== 'undefined'
        ? window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : 'light',
  )

  const listRef = React.useRef<HTMLOListElement>(null)
  const hotkeyLabel = hotkey.join('+').replace(/Key/g, '').replace(/Digit/g, '')
  const lastFocusedElementRef = React.useRef<HTMLElement>(null)
  const isFocusWithinRef = React.useRef(false)

  const removeToast = React.useCallback((toastToRemove: ToastT) => {
    setToasts((toasts) => {
      if (!toasts.find((toast) => toast.id === toastToRemove.id)?.delete) {
        ToastState.dismiss(toastToRemove.id)
      }

      return toasts.filter(({ id }) => id !== toastToRemove.id)
    })
  }, [])

  React.useEffect(() => {
    return ToastState.subscribe((toast) => {
      if ((toast as ToastToDismiss).dismiss) {
        setToasts((toasts) => toasts.map((t) => (t.id === toast.id ? { ...t, delete: true } : t)))
        return
      }

      // Prevent batching, temp solution.
      setTimeout(() => {
        ReactDOM.flushSync(() => {
          setToasts((toasts) => {
            const indexOfExistingToast = toasts.findIndex((t) => t.id === toast.id)

            // Update the toast if it already exists
            if (indexOfExistingToast !== -1) {
              return [
                ...toasts.slice(0, indexOfExistingToast),
                { ...toasts[indexOfExistingToast], ...toast },
                ...toasts.slice(indexOfExistingToast + 1),
              ]
            }

            return [toast, ...toasts]
          })
        })
      })
    })
  }, [])

  React.useEffect(() => {
    if (theme !== 'system') {
      setActualTheme(theme)
      return
    }

    if (theme === 'system') {
      // check if current preference is dark
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // it's currently dark
        setActualTheme('dark')
      } else {
        // it's not dark
        setActualTheme('light')
      }
    }

    if (typeof window === 'undefined') return
    const darkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    try {
      // Chrome & Firefox
      darkMediaQuery.addEventListener('change', ({ matches }) => {
        if (matches) {
          setActualTheme('dark')
        } else {
          setActualTheme('light')
        }
      })
    } catch (error) {
      // Safari < 14
      darkMediaQuery.addListener(({ matches }) => {
        try {
          if (matches) {
            setActualTheme('dark')
          } else {
            setActualTheme('light')
          }
        } catch (e) {
          console.error(e)
        }
      })
    }
  }, [theme])

  React.useEffect(() => {
    // Ensure expanded is always false when no toasts are present / only one left
    if (toasts.length <= 1) {
      setExpanded(false)
    }
  }, [toasts])

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isHotkeyPressed = hotkey.every((key) => (event as any)[key] || event.code === key)

      if (isHotkeyPressed) {
        setExpanded(true)
        listRef.current?.focus()
      }

      if (
        event.code === 'Escape' &&
        (document.activeElement === listRef.current || listRef.current?.contains(document.activeElement))
      ) {
        setExpanded(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [hotkey])

  React.useEffect(() => {
    if (listRef.current) {
      return () => {
        if (lastFocusedElementRef.current) {
          lastFocusedElementRef.current.focus({ preventScroll: true })
          lastFocusedElementRef.current = null
          isFocusWithinRef.current = false
        }
      }
    }
  }, [listRef.current])

  return (
    // Remove item from normal navigation flow, only available via hotkey
    <section
      aria-label={`${containerAriaLabel} ${hotkeyLabel}`}
      tabIndex={-1}
      aria-live="polite"
      aria-relevant="additions text"
      aria-atomic="false">
      {possiblePositions.map((position, index) => {
        const [y, x] = position.split('-')

        if (!toasts.length) return null

        return (
          <ol
            key={position}
            dir={dir === 'auto' ? getDocumentDirection() : dir}
            tabIndex={-1}
            ref={listRef}
            className={className}
            data-sonner-toaster
            data-theme={actualTheme}
            data-y-position={y}
            data-lifted={expanded && toasts.length > 1 && !expand}
            data-x-position={x}
            style={
              {
                '--front-toast-height': `${heights[0]?.height || 0}px`,
                '--offset': typeof offset === 'number' ? `${offset}px` : offset || VIEWPORT_OFFSET,
                '--width': `${TOAST_WIDTH}px`,
                '--gap': `${gap}px`,
                ...style,
              } as React.CSSProperties
            }
            onBlur={(event) => {
              if (isFocusWithinRef.current && !event.currentTarget.contains(event.relatedTarget)) {
                isFocusWithinRef.current = false
                if (lastFocusedElementRef.current) {
                  lastFocusedElementRef.current.focus({ preventScroll: true })
                  lastFocusedElementRef.current = null
                }
              }
            }}
            onFocus={(event) => {
              const isNotDismissible =
                event.target instanceof HTMLElement && event.target.dataset.dismissible === 'false'

              if (isNotDismissible) return

              if (!isFocusWithinRef.current) {
                isFocusWithinRef.current = true
                lastFocusedElementRef.current = event.relatedTarget as HTMLElement
              }
            }}
            onMouseEnter={() => setExpanded(true)}
            onMouseMove={() => setExpanded(true)}
            onMouseLeave={() => {
              // Avoid setting expanded to false when interacting with a toast, e.g. swiping
              if (!interacting) {
                setExpanded(false)
              }
            }}
            onPointerDown={(event) => {
              const isNotDismissible =
                event.target instanceof HTMLElement && event.target.dataset.dismissible === 'false'

              if (isNotDismissible) return
              setInteracting(true)
            }}
            onPointerUp={() => setInteracting(false)}>
            {toasts
              .filter((toast) => (!toast.position && index === 0) || toast.position === position)
              .map((toast, index) => (
                <Toast
                  key={toast.id}
                  icons={icons}
                  index={index}
                  toast={toast}
                  defaultRichColors={richColors}
                  duration={toastOptions?.duration ?? duration}
                  className={toastOptions?.className}
                  descriptionClassName={toastOptions?.descriptionClassName}
                  invert={invert ?? false}
                  visibleToasts={visibleToasts}
                  closeButton={toastOptions?.closeButton ?? closeButton ?? false}
                  interacting={interacting}
                  position={position}
                  style={toastOptions?.style}
                  unstyled={toastOptions?.unstyled}
                  classNames={toastOptions?.classNames}
                  cancelButtonStyle={toastOptions?.cancelButtonStyle}
                  actionButtonStyle={toastOptions?.actionButtonStyle}
                  removeToast={removeToast}
                  toasts={toasts.filter((t) => t.position == toast.position)}
                  heights={heights.filter((h) => h.position == toast.position)}
                  setHeights={setHeights}
                  expandByDefault={expand ?? false}
                  gap={gap}
                  loadingIcon={loadingIcon}
                  expanded={expanded}
                  pauseWhenPageIsHidden={pauseWhenPageIsHidden ?? false}
                  cn={cn}
                />
              ))}
          </ol>
        )
      })}
    </section>
  )
})
