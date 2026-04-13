export interface IRecordingParams {
  setRecordings: React.Dispatch<React.SetStateAction<IRecordingtType[]>>
  setRecordedDuration: React.Dispatch<React.SetStateAction<number>>
  audioChunksRef: React.RefObject<Blob[]>
}

export interface IStopRecordingHandlerParam {
  setRecording: React.Dispatch<React.SetStateAction<boolean>>
  intervalRef: React.RefObject<ReturnType<typeof setInterval> | null>
  mediaRecorderRef: React.RefObject<MediaRecorder | null>
  durationRef: React.RefObject<number>
}

export interface IDeleteRecordingHandlerParams
  extends Pick<IRecordingParams, 'audioChunksRef'>,
    IStopRecordingHandlerParam {}

export interface IStopRecordingHandlerParams
  extends Omit<IStopRecordingHandlerParam, 'setRecording' | 'mediaRecorderRef' | 'durationRef'>,
    Omit<IRecordingParams, 'setRecordedDuration'> {}

export interface IStartTimerParams
  extends Omit<IStopRecordingHandlerParam, 'setRecording' | 'mediaRecorderRef'>,
    Pick<IRecordingParams, 'setRecordedDuration'> {}

export interface IStartRecordingHandlerParams extends IStopRecordingHandlerParam, IRecordingParams {}
export interface IRecordingtType {
  id: string
  file: File | null
  url: string | null
  type: string
  name: string
  size: string
}

export interface IVisualizerClickHandlerParams {
  audioRef: React.RefObject<HTMLAudioElement | null>
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>
  event: React.MouseEvent<HTMLDivElement>
}

export interface IAttachmentType {
  id: string
  file: Blob | null
  url: string | null
  type: string
  name: string
  size: string
}
