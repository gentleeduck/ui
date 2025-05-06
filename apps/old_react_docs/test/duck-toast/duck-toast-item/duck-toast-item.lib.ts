import { PauseTimerArgs, StartTimerArgs } from './duck-toast.types'

export const startTimer = ({
  toast,
  remainingTime,
  closeTimerStartTimeRef,
  timeoutId,
  deleteToast,
}: StartTimerArgs) => {
  // setTimeout(, Infinity) behaves as if the delay is 0.
  // As a result, the toast would be closed immediately, giving the appearance that it was never rendered.
  // See: https://github.com/denysdovhan/wtfjs?tab=readme-ov-file#an-infinite-timeout
  if (remainingTime.current === Number.POSITIVE_INFINITY) return

  closeTimerStartTimeRef.current = new Date().getTime()

  // Let the toast know it has started
  timeoutId = setTimeout(() => {
    toast.onAutoClose?.(toast)
    deleteToast()
  }, remainingTime.current)
}

export const pauseTimer = ({ remainingTime, closeTimerStartTimeRef, lastCloseTimerStartTimeRef }: PauseTimerArgs) => {
  if (lastCloseTimerStartTimeRef.current < closeTimerStartTimeRef.current) {
    // Get the elapsed time since the timer started
    const elapsedTime = new Date().getTime() - closeTimerStartTimeRef.current

    remainingTime.current = remainingTime.current - elapsedTime
  }

  lastCloseTimerStartTimeRef.current = new Date().getTime()
}
