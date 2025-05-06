'use client'

import * as React from 'react'

import { CloseIcon, getAsset, Loader } from '../duck-toast.assets'
import { useIsDocumentHidden } from '../duck-toast.hook'
import { _cn } from '../duck-toast.lib'
import { isAction, type ToastProps } from '../duck-toast.types'
import { GAP, SWIPE_THRESHOLD, TIME_BEFORE_UNMOUNT, TOAST_LIFETIME } from '../duck-toast.constants'
import { pauseTimer, startTimer } from './duck-toast-item.lib'

export const Toast = (props: ToastProps) => {
  const {
    invert: ToasterInvert,
    toast,
    unstyled,
    interacting,
    setHeights,
    visibleToasts,
    heights,
    index,
    toasts,
    expanded,
    removeToast,
    defaultRichColors,
    closeButton: closeButtonFromToaster,
    style,
    cancelButtonStyle,
    actionButtonStyle,
    className = '',
    descriptionClassName = '',
    duration: durationFromToaster,
    position,
    gap = GAP,
    loadingIcon: loadingIconProp,
    expandByDefault,
    classNames,
    icons,
    closeButtonAriaLabel = 'Close toast',
    pauseWhenPageIsHidden,
    cn,
  } = props

  const [mounted, setMounted] = React.useState(false)
  const [removed, setRemoved] = React.useState(false)
  const [swiping, setSwiping] = React.useState(false)
  const [swipeOut, setSwipeOut] = React.useState(false)
  const [isSwiped, setIsSwiped] = React.useState(false)
  const [offsetBeforeRemove, setOffsetBeforeRemove] = React.useState(0)
  const [initialHeight, setInitialHeight] = React.useState(0)
  const remainingTime = React.useRef(toast.duration || durationFromToaster || TOAST_LIFETIME)
  const dragStartTime = React.useRef<Date | null>(null)
  const toastRef = React.useRef<HTMLLIElement>(null)
  const isFront = index === 0
  const isVisible = index + 1 <= visibleToasts
  const toastType = toast.type
  const dismissible = toast.dismissible !== false
  const toastClassname = toast.className || ''
  const toastDescriptionClassname = toast.descriptionClassName || ''
  // Height index is used to calculate the offset as it gets updated before the toast array, which means we can calculate the new layout faster.
  const heightIndex = React.useMemo(
    () => heights.findIndex((height) => height.toastId === toast.id) || 0,
    [heights, toast.id],
  )
  const closeButton = React.useMemo(
    () => toast.closeButton ?? closeButtonFromToaster,
    [toast.closeButton, closeButtonFromToaster],
  )
  const duration = React.useMemo(
    () => toast.duration || durationFromToaster || TOAST_LIFETIME,
    [toast.duration, durationFromToaster],
  )
  const closeTimerStartTimeRef = React.useRef(0)
  const offset = React.useRef(0)
  const lastCloseTimerStartTimeRef = React.useRef(0)
  const pointerStartRef = React.useRef<{ x: number; y: number } | null>(null)
  const [y, x] = position.split('-')

  const toastsHeightBefore = React.useMemo(() => {
    return heights.reduce((prev, curr, reducerIndex) => {
      // Calculate offset up until current  toast
      if (reducerIndex >= heightIndex) return prev
      return prev + curr.height
    }, 0)
  }, [heights, heightIndex])

  const isDocumentHidden = useIsDocumentHidden()

  const invert = toast.invert || ToasterInvert
  const disabled = toastType === 'loading'

  offset.current = React.useMemo(() => heightIndex * gap + toastsHeightBefore, [heightIndex, toastsHeightBefore])

  React.useEffect(() => {
    // Trigger enter animation without using CSS animation
    setMounted(true)
  }, [])

  React.useEffect(() => {
    const toastNode = toastRef.current
    if (toastNode) {
      const height = toastNode.getBoundingClientRect().height
      // Add toast height to heights array after the toast is mounted
      setInitialHeight(height)
      setHeights((h) => [{ toastId: toast.id, height, position: toast.position }, ...h])
      return () => setHeights((h) => h.filter((height) => height.toastId !== toast.id))
    }
  }, [setHeights, toast.id])

  React.useLayoutEffect(() => {
    if (!mounted) return
    const toastNode = toastRef.current as HTMLElement
    const originalHeight = toastNode.style.height
    toastNode.style.height = 'auto'
    const newHeight = toastNode.getBoundingClientRect().height
    toastNode.style.height = originalHeight

    setInitialHeight(newHeight)

    setHeights((heights) => {
      const alreadyExists = heights.find((height) => height.toastId === toast.id)
      if (alreadyExists) {
        return heights.map((height) => (height.toastId === toast.id ? { ...height, height: newHeight } : height))
      } else {
        return [{ toastId: toast.id, height: newHeight, position: toast.position }, ...heights]
      }
    })
  }, [mounted, toast.title, toast.description, setHeights, toast.id])

  const deleteToast = React.useCallback(() => {
    // Save the offset for the exit swipe animation
    setRemoved(true)
    setOffsetBeforeRemove(offset.current)
    setHeights((h) => h.filter((height) => height.toastId !== toast.id))

    setTimeout(() => {
      removeToast(toast)
    }, TIME_BEFORE_UNMOUNT)
  }, [toast, removeToast, setHeights, offset])

  React.useEffect(() => {
    if (
      (toast.promise && toastType === 'loading') ||
      toast.duration === Number.POSITIVE_INFINITY ||
      toast.type === 'loading'
    )
      return
    const timeoutId: NodeJS.Timeout | undefined = undefined

    if (expanded || interacting || (pauseWhenPageIsHidden && isDocumentHidden)) {
      pauseTimer({
        remainingTime,
        closeTimerStartTimeRef,
        lastCloseTimerStartTimeRef,
      })
    } else {
      startTimer({ closeTimerStartTimeRef, remainingTime, deleteToast, toast, timeoutId })
    }

    return () => clearTimeout(timeoutId)
  }, [expanded, interacting, toast, toastType, pauseWhenPageIsHidden, isDocumentHidden, deleteToast])

  React.useEffect(() => {
    if (toast.delete) {
      deleteToast()
    }
  }, [deleteToast, toast.delete])

  function getLoadingIcon() {
    if (icons?.loading) {
      return (
        <div
          className={cn(classNames?.loader, toast?.classNames?.loader, 'sonner-loader')}
          data-visible={toastType === 'loading'}>
          {icons.loading}
        </div>
      )
    }

    if (loadingIconProp) {
      return (
        <div
          className={cn(classNames?.loader, toast?.classNames?.loader, 'sonner-loader')}
          data-visible={toastType === 'loading'}>
          {loadingIconProp}
        </div>
      )
    }
    return <Loader className={cn(classNames?.loader, toast?.classNames?.loader)} visible={toastType === 'loading'} />
  }

  // const [percentile, setPercentile] = React.useState<number>(0)
  // React.useEffect(() => {
  //   const interval_id = setInterval(() => {
  //     if (percentile < 100) {
  //       setPercentile(percentile + 10)
  //     }
  //   }, 200)
  //   return () => clearInterval(interval_id)
  // }, [percentile])

  return (
    <li
      tabIndex={0}
      ref={toastRef}
      className={cn(
        className,
        toastClassname,
        classNames?.toast,
        toast?.classNames?.toast,
        classNames?.default,
        classNames?.[toastType],
        toast?.classNames?.[toastType],
      )}
      data-sonner-toast=""
      data-rich-colors={toast.richColors ?? defaultRichColors}
      data-styled={!Boolean(toast.jsx || toast.unstyled || unstyled)}
      data-mounted={mounted}
      data-promise={Boolean(toast.promise)}
      data-swiped={isSwiped}
      data-removed={removed}
      data-visible={isVisible}
      data-y-position={y}
      data-x-position={x}
      data-index={index}
      data-front={isFront}
      data-swiping={swiping}
      data-dismissible={dismissible}
      data-type={toastType}
      data-invert={invert}
      data-swipe-out={swipeOut}
      data-expanded={Boolean(expanded || (expandByDefault && mounted))}
      style={
        {
          '--index': index,
          '--toasts-before': index,
          '--z-index': toasts.length - index,
          '--offset': `${removed ? offsetBeforeRemove : offset.current}px`,
          '--initial-height': expandByDefault ? 'auto' : `${initialHeight}px`,
          ...style,
          ...toast.style,
        } as React.CSSProperties
      }
      onPointerDown={(event) => {
        if (disabled || !dismissible) return
        dragStartTime.current = new Date()
        setOffsetBeforeRemove(offset.current)
        // Ensure we maintain correct pointer capture even when going outside of the toast (e.g. when swiping)
        ;(event.target as HTMLElement).setPointerCapture(event.pointerId)
        if ((event.target as HTMLElement).tagName === 'BUTTON') return
        setSwiping(true)
        pointerStartRef.current = { x: event.clientX, y: event.clientY }
      }}
      onPointerUp={() => {
        if (swipeOut || !dismissible) return

        pointerStartRef.current = null
        const swipeAmount = Number(toastRef.current?.style.getPropertyValue('--swipe-amount').replace('px', '') || 0)
        const timeTaken = new Date().getTime() - dragStartTime.current?.getTime()
        const velocity = Math.abs(swipeAmount) / timeTaken

        // Remove only if threshold is met
        if (Math.abs(swipeAmount) >= SWIPE_THRESHOLD || velocity > 0.11) {
          setOffsetBeforeRemove(offset.current)
          toast.onDismiss?.(toast)
          deleteToast()
          setSwipeOut(true)
          setIsSwiped(false)
          return
        }

        toastRef.current?.style.setProperty('--swipe-amount', '0px')
        setSwiping(false)
      }}
      onPointerMove={(event) => {
        if (!pointerStartRef.current || !dismissible) return

        const yPosition = event.clientY - pointerStartRef.current.y
        const isHighlighted = window.getSelection()?.toString().length > 0
        const swipeAmount = y === 'top' ? Math.min(0, yPosition) : Math.max(0, yPosition)

        if (Math.abs(swipeAmount) > 0) {
          setIsSwiped(true)
        }

        if (isHighlighted) return

        toastRef.current?.style.setProperty('--swipe-amount', `${swipeAmount}px`)
      }}>
      {closeButton && !toast.jsx ? (
        <button
          aria-label={closeButtonAriaLabel}
          data-disabled={disabled}
          data-close-button
          onClick={
            disabled || !dismissible
              ? () => {}
              : () => {
                  deleteToast()
                  toast.onDismiss?.(toast)
                }
          }
          className={cn(classNames?.closeButton, toast?.classNames?.closeButton)}>
          {icons?.close ?? CloseIcon}
        </button>
      ) : null}
      {/* TODO: This can be cleaner */}
      {toast.jsx || React.isValidElement(toast.title) ? (
        toast.jsx ? (
          toast.jsx
        ) : typeof toast.title === 'function' ? (
          toast.title()
        ) : (
          toast.title
        )
      ) : (
        <>
          {toastType || toast.icon || toast.promise ? (
            <div data-icon="" className={cn(classNames?.icon, toast?.classNames?.icon)}>
              {toast.promise || (toast.type === 'loading' && !toast.icon) ? toast.icon || getLoadingIcon() : null}
              {toast.type !== 'loading' ? toast.icon || icons?.[toastType] || getAsset(toastType) : null}
            </div>
          ) : null}

          <div data-content="" className={cn(classNames?.content, toast?.classNames?.content)}>
            <div data-title="" className={cn(classNames?.title, toast?.classNames?.title)}>
              {typeof toast.title === 'function' ? toast.title() : toast.title}
            </div>
            {toast.description ? (
              <div
                data-description=""
                className={cn(
                  descriptionClassName,
                  toastDescriptionClassname,
                  classNames?.description,
                  toast?.classNames?.description,
                )}>
                {typeof toast.description === 'function' ? toast.description() : toast.description}
              </div>
            ) : null}
          </div>
          {React.isValidElement(toast.cancel) ? (
            toast.cancel
          ) : toast.cancel && isAction(toast.cancel) ? (
            <button
              data-button
              data-cancel
              style={toast.cancelButtonStyle || cancelButtonStyle}
              onClick={(event) => {
                // We need to check twice because typescript
                if (!isAction(toast.cancel)) return
                if (!dismissible) return
                toast.cancel.onClick?.(event)
                deleteToast()
              }}
              className={cn(classNames?.cancelButton, toast?.classNames?.cancelButton)}>
              {toast.cancel.label}
            </button>
          ) : null}
          {React.isValidElement(toast.action) ? (
            toast.action
          ) : toast.action && isAction(toast.action) ? (
            <button
              data-button
              data-action
              style={toast.actionButtonStyle || actionButtonStyle}
              onClick={(event) => {
                // We need to check twice because typescript
                if (!isAction(toast.action)) return
                toast.action.onClick?.(event)
                if (event.defaultPrevented) return
                deleteToast()
              }}
              className={cn(classNames?.actionButton, toast?.classNames?.actionButton)}>
              {toast.action.label}
            </button>
          ) : null}
        </>
      )}
    </li>
  )
}
