import React from 'react'
import { ToastT } from './duck-toast.types'
import { ToastState } from './duck-toast.lib'

export const useIsDocumentHidden = () => {
  const [isDocumentHidden, setIsDocumentHidden] = React.useState(document.hidden)

  React.useEffect(() => {
    const callback = () => {
      setIsDocumentHidden(document.hidden)
    }
    document.addEventListener('visibilitychange', callback)
    return () => window.removeEventListener('visibilitychange', callback)
  }, [])

  return isDocumentHidden
}

export function useSonner() {
  const [activeToasts, setActiveToasts] = React.useState<ToastT[]>([])

  React.useEffect(() => {
    return ToastState.subscribe((toast) => {
      setActiveToasts((currentToasts) => {
        if ('dismiss' in toast && toast.dismiss) {
          return currentToasts.filter((t) => t.id !== toast.id)
        }

        const existingToastIndex = currentToasts.findIndex((t) => t.id === toast.id)
        if (existingToastIndex !== -1) {
          const updatedToasts = [...currentToasts]
          updatedToasts[existingToastIndex] = { ...updatedToasts[existingToastIndex], ...toast }
          return updatedToasts
        } else {
          return [toast, ...currentToasts]
        }
      })
    })
  }, [])

  return {
    toasts: activeToasts,
  }
}
