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
    <div className="flex w-full gap-3">
      <CircleCheck
        className={cn(
          '!size-[18px] mt-2 hidden fill-primary [&_path]:stroke-primary-foreground',
          progress >= 100 && 'flex',
        )}
      />
      <Loader
        className={cn(
          '!size-[18px] mt-2 hidden animate-spin text-foreground-muted opacity-70',
          progress < 100 && 'flex',
        )}
      />
      <div className="flex w-full flex-col gap-2">
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
              <p className="font-mono text-foreground-light text-sm">{`${remainingTime && !isNaN(remainingTime) && isFinite(remainingTime) && remainingTime !== 0 ? `${formatTime(remainingTime)} remaining – ` : ''}`}</p>
            )}
            <p className="font-mono text-foreground-light text-sm">{`${progress}%`}</p>
          </div>
        </div>
        <Progress value={progress} className="h-1 w-full" />
        <div className="flex w-full items-center justify-between gap-2">
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
