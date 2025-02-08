import { ToastT } from '../duck-toast.types'

export type StartTimerArgs = {
  closeTimerStartTimeRef: React.MutableRefObject<number>
  timeoutId: NodeJS.Timeout | undefined
  remainingTime: React.MutableRefObject<number>
  toast: ToastT
  deleteToast: () => void
}

export type PauseTimerArgs = {
  lastCloseTimerStartTimeRef: React.MutableRefObject<number>
  closeTimerStartTimeRef: React.MutableRefObject<number>
  remainingTime: React.MutableRefObject<number>
}
