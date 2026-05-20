import type { Toaster as Sonner } from 'sonner'

export type IToasterProps = React.ComponentProps<typeof Sonner>
export type ToasterProps = IToasterProps

export interface IUploadSonnerProps {
  progress: number
  attachments: number
  remainingTime?: number
  onCancel?: (_e: React.MouseEvent<HTMLButtonElement>, onCancel: (_id: string) => void) => void
  onComplete?: (_e: React.MouseEvent<HTMLButtonElement>, onComplete: (_id: string) => void) => void
}
export type UploadSonnerProps = IUploadSonnerProps
