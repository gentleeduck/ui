import { cn } from '@gentleduck/libs/cn'
import { CircleCheck, Loader } from 'lucide-react'
import type React from 'react'
import { toast } from 'sonner'
import { Button } from '../button'
import { Progress } from '../progress'
import { formatTime } from './sonner.libs'
import type { UploadSonnerProps } from './sonner.types'

const SonnerUpload = ({
  progress,
  attachments,
  remainingTime,
  onCancel,
  onComplete,
}: UploadSonnerProps): React.JSX.Element => {
  return (
    <div className="flex w-full gap-3" data-slot="content">
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
              <p className="font-mono text-foreground-light text-sm">{`${remainingTime && !Number.isNaN(remainingTime) && Number.isFinite(remainingTime) && remainingTime !== 0 ? `${formatTime(remainingTime)} remaining – ` : ''}`}</p>
            )}
            <p className="font-mono text-foreground-light text-sm">{`${progress}%`}</p>
          </div>
        </div>
        <Progress className="h-1 w-full" value={progress} />
        <div className="flex w-full items-center justify-between gap-2">
          <small className="w-full text-foreground-muted text-xs">
            {progress < 100 ? 'Please do not close the browser until completed' : 'Upload complete'}
          </small>

          {progress === 100 && (
            <Button
              border="default"
              onClick={(_) => onComplete?.(_, (id: string) => toast.dismiss(id))}
              size="sm"
              variant="default">
              Complete
            </Button>
          )}

          {progress < 100 && (
            <Button
              border="default"
              onClick={(_) => onCancel?.(_, (id: string) => toast.dismiss(id))}
              size="sm"
              variant="default">
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export { SonnerUpload }
