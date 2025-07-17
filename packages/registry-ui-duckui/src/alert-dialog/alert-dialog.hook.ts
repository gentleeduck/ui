import React from 'react'
import type { StateType, UseDuckAlertReturnType, UserDuckAlertProps } from './alert-dialog.types'

/**
 * Custom hook to manage the state and behavior of an alert dialog with a drawer.
 *
 * @param {Object} props - The properties for the alert dialog.
 * @param {Object} props.actions - Contains optional cancel and continue actions.
 * @param {Function} [props.actions.cancel] - Callback to execute when the alert is canceled.
 * @param {Function} [props.actions.continue] - Callback to execute when the alert is continued.
 * @param {boolean} props.state - Initial state indicating whether to show the alert.
 *
 * @returns {UseDuckAlertReturnType} An object containing handlers and state management utilities:
 *
 */
export function useDuckAlert<T>({ state: changeState }: UserDuckAlertProps<T>): UseDuckAlertReturnType {
  const [state, setState] = React.useState<StateType>({ shape: false, alert: false })
  const changeStateRef = React.useRef<typeof changeState | null>(null)

  React.useEffect(() => {
    changeStateRef.current = changeState
  }, [])

  const handleAlertCancel = React.useCallback(() => {
    setState((prevState) => ({ ...prevState, alert: false, shape: true }))
  }, [])

  const handleAlertContinue = React.useCallback(() => {
    setState((prevState) => ({ ...prevState, alert: false, shape: false }))
  }, [])

  const handleOpenChange = React.useCallback(
    (drawerState: boolean) => {
      const showAlert = !drawerState && (changeState || true) && changeStateRef.current !== changeState

      setState(() => ({
        alert: showAlert as boolean,
        shape: changeState || true ? drawerState : false,
      }))
    },
    [changeState],
  )

  return {
    handleAlertCancel,
    handleAlertContinue,
    handleOpenChange,
    state,
    setState,
  }
}
