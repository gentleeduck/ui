import { CircleCheck, Loader } from 'lucide-react'
import { Button } from '../button'
import { Progress } from '../progress'
import { UploadSonnerProps } from './sonner.types'
import { formatTime } from './sonner.libs'
import React from 'react'
import { toast } from 'sonner'
import { cn } from '@gentleduck/libs/cn'

const SonnerUpload = ({ progress, attachments, remainingTime, onCancel }: UploadSonnerProps): React.JSX.Element => {
  return (
    <div className="flex gap-3 w-full">
      <CircleCheck
        className={cn(
          'fill-primary [&_path]:stroke-primary-foreground mt-2 !size-[18px] hidden',
          progress >= 100 && 'flex',
        )}
      />
      <Loader
        className={cn(
          'animate-spin text-foreground-muted mt-2 opacity-70 !size-[18px] hidden',
          progress < 100 && 'flex',
        )}
      />
      <div className="flex flex-col gap-2 w-full">
        <div className="flex w-full justify-between">
          <p className="text-foreground text-sm">
            {progress >= 100
              ? `Upload complete`
              : attachments
                ? `Uploading ${attachments} file${attachments > 1 ? 's' : ''}...`
                : `Uploading...`}
          </p>
          <div className="flex items-center gap-2">
            {progress <= 100 && (
              <p className="text-foreground-light text-sm font-mono">{`${remainingTime && !isNaN(remainingTime) && isFinite(remainingTime) && remainingTime !== 0 ? `${formatTime(remainingTime)} remaining – ` : ''}`}</p>
            )}
            <p className="text-foreground-light text-sm font-mono">{`${progress}%`}</p>
          </div>
        </div>
        <Progress value={progress} className="w-full h-1" />
        <div className="flex items-center justify-between gap-2 w-full">
          <small className="text-foreground-muted text-xs">Please do not close the browser until completed</small>

          {progress <= 100 && (
            <Button
              variant="default"
              size="xs"
              border="default"
              onClick={(_) => onCancel && onCancel(_, (id: string) => toast.dismiss(id))}>
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export { SonnerUpload }
