import { Toast, ToastAction } from '@radix-ui/react-toast'

export type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

export type ToastActionElement = React.ReactElement<typeof ToastAction>
