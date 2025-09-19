// import { cn } from '@gentleduck/libs/cn'
// import {
//   ArrowBigUp,
//   Download,
//   Ellipsis,
//   Mic,
//   Pause,
//   Play,
//   Trash2,
//   Volume,
//   Volume1,
//   Volume2,
//   VolumeX,
// } from 'lucide-react'
// import * as React from 'react'
// import { uuidv7 } from 'uuidv7'
// import { Button } from '../button'
// import { Input } from '../input'
// // import { AttachmentType } from './swapy'
// import { PopoverWrapper } from '../popover'
// import { Slider } from '../slider'
// import { format_time_handler } from './audio.libs'
// import type {
//   AttachmentType,
//   DeleteRecordingHandlerParams,
//   RecordingtType,
//   StartRecordingHandlerParams,
//   StartTimerParams,
//   StopRecordingHandlerParam,
//   StopRecordingHandlerParams,
//   VisualizerClickHandlerParams,
// } from './audio.types'
// import {
//   AudioVisualizer,
//   type dataPoint,
//   new_audio,
//   type ProcessBlobParams,
//   process_blob,
//   type ThemeColor,
// } from './audio-visualizer'
//
// // import { downloadAttachment } from './comment'
//
// // Handle audio visualizer click
// const visualizer_click_handler = ({ audioRef, event, setCurrentTime }: VisualizerClickHandlerParams) => {
//   if (audioRef.current == null) return
//   const rect = event.currentTarget.getBoundingClientRect()
//   const clickX = event.clientX - rect.left
//   const duration = audioRef.current.duration
//
//   if (duration && duration > 0) {
//     const newTime = (clickX / rect.width) * duration
//     audioRef.current.currentTime = newTime
//     setCurrentTime(newTime * 1000)
//   }
// }
//
// // Start recording audio
// export const start_recording_handler = async ({
//   setRecordings,
//   setRecording,
//   setRecordedDuration,
//   durationRef,
//   intervalRef,
//   audioChunksRef,
//   mediaRecorderRef,
// }: StartRecordingHandlerParams) => {
//   const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
//   mediaRecorderRef.current = new MediaRecorder(stream)
//   audioChunksRef.current = []
//
//   mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
//     audioChunksRef.current.push(event.data)
//   }
//
//   mediaRecorderRef.current.onstop = () => {
//     setRecordedDuration((_) => 0)
//     durationRef.current > 0 &&
//       Stop_recording_handler({
//         audioChunksRef,
//         intervalRef,
//         setRecordings,
//       })
//   }
//
//   mediaRecorderRef.current.start()
//   setRecording(true)
//   durationRef.current = 0
//   start_timer_handler({ durationRef, intervalRef, setRecordedDuration })
// }
//
// // Stop recording and process audio blob
// export const Stop_recording_handler = ({ setRecordings, intervalRef, audioChunksRef }: StopRecordingHandlerParams) => {
//   const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
//
//   setRecordings((prev) => [
//     ...prev,
//     {
//       file: audioBlob as File,
//       id: uuidv7(),
//       name: 'recording.wav',
//       size: String(audioBlob.size),
//       type: 'audio/wav',
//       url: URL.createObjectURL(audioBlob),
//     },
//   ])
//   clearInterval(intervalRef.current!)
// }
//
// // Stop recording audio
// export const stop_recording_handle = ({ setRecording, intervalRef, mediaRecorderRef }: StopRecordingHandlerParam) => {
//   mediaRecorderRef.current?.stop()
//   setRecording(false)
//   clearInterval(intervalRef.current!)
// }
//
// // Delete recording
// export const deleteRecordingHandler = ({
//   setRecording,
//   intervalRef,
//   mediaRecorderRef,
//   durationRef,
//   audioChunksRef,
// }: DeleteRecordingHandlerParams) => {
//   durationRef.current = 0
//   audioChunksRef.current = []
//   stop_recording_handle({
//     durationRef,
//     intervalRef,
//     mediaRecorderRef,
//     setRecording,
//   })
// }
//
// // Start timer to track recording duration
// export const start_timer_handler = ({ durationRef, intervalRef, setRecordedDuration }: StartTimerParams) => {
//   clearInterval(intervalRef.current!)
//   intervalRef.current = setInterval(() => {
//     durationRef.current += 1000
//     setRecordedDuration(durationRef.current)
//   }, 1000)
// }
//
// // Define the type for the context
// interface AudioContextType {
//   recording: boolean
//   recordedDuration: number
//   startRecording: () => void
//   stopRecording: () => void
//   deleteRecording: () => void
// }
//
// // Default values for the context
// const AudioContext = React.createContext<AudioContextType | undefined>(undefined)
//
// // Use the custom hook to access the audio context
// export const useAudioProvider = (): AudioContextType => {
//   const context = React.useContext(AudioContext)
//   if (!context) {
//     throw new Error('useAudioContext must be used within an Audio')
//   }
//   return context
// }
//
// // AudioProvider component that will wrap the rest of the app
// const Audio: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [recordedDuration, setRecordedDuration] = React.useState<number>(0)
//   const mediaRecorderRef = React.useRef<MediaRecorder | null>(null)
//   const audioChunksRef = React.useRef<Blob[]>([])
//   const intervalRef = React.useRef<NodeJS.Timeout | null>(null)
//   const durationRef = React.useRef<number>(0)
//   const { setRecordings, setRecording, recording } = useAudioDataProvider()
//
//   // Start recording handler
//   const startRecording = () => {
//     start_recording_handler({
//       audioChunksRef,
//       durationRef,
//       intervalRef,
//       mediaRecorderRef,
//       setRecordedDuration,
//       setRecording,
//       setRecordings,
//     })
//   }
//
//   // Stop recording handler
//   const stopRecording = () => {
//     stop_recording_handle({
//       durationRef,
//       intervalRef,
//       mediaRecorderRef,
//       setRecording,
//     })
//   }
//
//   // Delete recording handler
//   const deleteRecording = () => {
//     deleteRecordingHandler({
//       audioChunksRef,
//       durationRef,
//       intervalRef,
//       mediaRecorderRef,
//       setRecording,
//     })
//   }
//
//   // Cleanup audio element and interval on unmount
//   React.useEffect(() => {
//     return () => {
//       if (intervalRef.current) clearInterval(intervalRef.current)
//     }
//   }, [])
//
//   // Provide the state and functions to the children components
//   return (
//     <AudioContext.Provider
//       value={{
//         deleteRecording,
//         recordedDuration,
//         recording,
//         startRecording,
//         stopRecording,
//       }}>
//       <div className="flex items-center gap-2">{children}</div>
//     </AudioContext.Provider>
//   )
// }
//
// export interface AudioTimerProps extends React.HTMLAttributes<HTMLDivElement> {
//   showInput?: boolean
// }
//
// export const AudioTimer = React.forwardRef<HTMLDivElement, AudioTimerProps>(({ showInput, className }, ref) => {
//   const { recording, recordedDuration } = useAudioProvider()
//   console.log(recording, recordedDuration)
//   return (
//     <div className={cn('relative', className)} ref={ref}>
//       <div
//         className={cn(
//           '-translate-y-1/2 absolute top-1/2 right-4 flex items-center gap-2 transition duration-100',
//           recording ? 'opacity-100' : 'pointer-events-none right-4 opacity-0',
//         )}>
//         <span className="font-mono">{format_time_handler(recordedDuration)}</span>
//         <span className="h-2 w-2 animate-pulse rounded-full bg-primary font-mono" />
//       </div>
//       <div>
//         {showInput && (
//           <Input
//             className={cn('fade_animation transition', recording ? '!opacity-100 w-[179px]' : 'w-[235px]')}
//             disabled={recording}
//           />
//         )}
//       </div>
//     </div>
//   )
// })
//
// export interface AudioDeleteProps extends React.ComponentPropsWithoutRef<typeof Button> {}
//
// export const AudioDelete = React.forwardRef<HTMLButtonElement, AudioDeleteProps>(
//   ({ size, type, onClick, className, ...props }, ref) => {
//     const { deleteRecording, recording } = useAudioProvider()
//     return (
//       <Button
//         className={cn(
//           'fade_animation relative rounded-full transition',
//           recording ? 'h-8 w-8 scale-1 opacity-1' : 'pointer-events-none h-0 w-0 scale-0 opacity-0',
//           className,
//         )}
//         onClick={(e) => {
//           deleteRecording()
//           onClick && onClick(e)
//         }}
//         ref={ref}
//         size={size ?? 'icon'}
//         type={type ?? 'button'}
//         {...props}>
//         <Trash2 className="-translate-y-1/2 -translate-x-1/2 fade_animation absolute top-1/2 left-1/2 size-[1rem] transition" />
//       </Button>
//     )
//   },
// )
//
// export interface AudioStartProps extends React.ComponentPropsWithoutRef<typeof Button> {}
//
// export const AudioStart = React.forwardRef<HTMLButtonElement, AudioStartProps>(
//   ({ size, type, onClick, className, ...props }, ref) => {
//     const { startRecording, stopRecording, recording } = useAudioProvider()
//     return (
//       <Button
//         className={cn('relative h-8 w-8 rounded-full transition', recording ? 'ml-2' : 'ml-0', className)}
//         onClick={(e) => {
//           recording ? stopRecording() : startRecording()
//           onClick && onClick(e)
//         }}
//         ref={ref}
//         size={size ?? 'icon'}
//         type={type ?? 'button'}
//         {...props}>
//         <Mic
//           className={cn(
//             '-translate-y-1/2 -translate-x-1/2 fade_animation absolute top-1/2 left-1/2 size-[1rem] transition',
//             recording ? 'pointer-events-none scale-0 opacity-0' : 'scale-[1] opacity-100',
//           )}
//         />
//         <ArrowBigUp
//           className={cn(
//             '-translate-y-1/2 -translate-x-1/2 fade_animation absolute top-1/2 left-1/2 size-[1.18rem] stroke-[1.5] transition',
//             recording ? 'scale-[1.1] opacity-100' : 'pointer-events-none scale-0 opacity-0',
//           )}
//         />
//       </Button>
//     )
//   },
// )
//
// const AudioVisualizerMemo = React.memo(AudioVisualizer)
//
// const AudioItemWrapper = ({
//   children,
//   loading,
//   isPlaying,
//   attachment,
//   timeLeft,
//   size = 'sm',
//   duration,
//   handlePlayPause,
// }: {
//   size: 'sm' | 'md' | 'lg'
//   children: React.ReactNode
//   attachment: AttachmentType
//   duration: number
//   loading: boolean
//   isPlaying: boolean
//   timeLeft: number
//   handlePlayPause: () => void
// }) => {
//   return (
//     <>
//       <div
//         className={cn(
//           'relative flex w-fit items-center gap-4 overflow-hidden rounded-lg bg-secondary px-4 py-2 transition hover:bg-secondary/70',
//         )}>
//         <div
//           className={cn(
//             '-left-[150%] absolute top-50% z-1 flex h-[200%] w-[150%] items-center justify-center rounded-full bg-primary/5 transition-all duration-500 ease-out',
//             isPlaying && '-left-[25%]',
//           )}
//         />
//         <Button
//           className={cn(
//             'relative z-10 rounded-full',
//             size === 'sm' ? 'h-8 w-8 [&_svg]:size-4' : size === 'md' ? 'h-10 w-10' : 'h-12 w-12',
//           )}
//           loading={loading}
//           onClick={handlePlayPause}
//           size="icon">
//           <Play
//             className={cn(
//               '-translate-y-1/2 -translate-x-1/2 fade_animation absolute top-1/2 left-1/2 transition',
//               !isPlaying && !loading ? 'scale-1 opacity-1' : 'pointer-events-none scale-0 opacity-0',
//             )}
//           />
//           <Pause
//             className={cn(
//               '-translate-y-1/2 -translate-x-1/2 fade_animation absolute top-1/2 left-1/2 transition',
//               isPlaying && !loading ? 'scale-1 opacity-1' : 'pointer-events-none scale-0 opacity-0',
//             )}
//           />
//         </Button>
//
//         {
//           <div className="z-10 flex flex-col">
//             <div className="w-fit cursor-pointer p-0">{children}</div>
//
//             <div className="mt-1 flex items-center gap-2">
//               <span className={cn('flex items-center text-accent', size === 'sm' ? 'text-xs' : 'text-sm')}>
//                 {isPlaying || timeLeft < duration
//                   ? format_time_handler(timeLeft > 0 ? timeLeft : 0)
//                   : format_time_handler(duration)}
//               </span>
//               {
//                 /* TODO: YOU SHOULD EDIT THE OBJ TO GIVE YOU VALUE OF RECIPIENT OPENED THE RECORD */
//                 <span className="h-2 w-2 rounded-full bg-green-500" />
//               }
//
//               <AudioSpeed />
//               <AudioVolume />
//               <AudioMoreOptions attachment={attachment} />
//             </div>
//           </div>
//         }
//       </div>
//     </>
//   )
// }
// export const AudioMoreOptions = ({ attachment }: { attachment: AttachmentType }) => {
//   return (
//     <PopoverWrapper
//       content={{
//         align: 'center',
//         children: (
//           <div className="flex items-center space-x-2">
//             <Button
//               icon={<Download />}
//               onClick={() => {
//                 // downloadAttachment({ attachment })
//               }}
//               size={'sm'}
//               variant={'ghost'}>
//               Download
//             </Button>
//           </div>
//         ),
//         className: 'w-fit p-2',
//         side: 'top',
//       }}
//       trigger={{
//         children: (
//           <Button
//             className={cn('h-4 w-8 rounded-full font-semibold text-[.6rem]')}
//             icon={<Ellipsis className="!size-3" />}
//             size={'sm'}
//             variant={'default'}
//           />
//         ),
//       }}
//     />
//   )
// }
//
// const VolumeIcons = {
//   0: VolumeX, // Muted
//   1: Volume, // Low volume
//   2: Volume1, // Medium volume
//   3: Volume2, // High volume
// }
//
// export const AudioVolume = () => {
//   const { volume, setVolume } = useAudioDataProvider()
//
//   const handleVolumeChange = (value: number) => {
//     // FIX: TYPE undefined
//     const newVolume = value / 100
//     setVolume(newVolume)
//   }
//
//   const getVolumeIcon = () => {
//     if (volume === 0) return VolumeIcons[0] // Muted
//     if (volume > 0 && volume <= 0.33) return VolumeIcons[1] // Low volume
//     if (volume > 0.33 && volume <= 0.66) return VolumeIcons[2] // Medium volume
//     return VolumeIcons[3] // High volume
//   }
//
//   return (
//     <PopoverWrapper
//       content={{
//         align: 'center',
//         children: (
//           <div className="flex items-center space-x-2">
//             <Slider
//               className="[&>span]:h-[4px] [&_span[role='slider']]:mt-[-6px] [&_span[role='slider']]:h-4 [&_span[role='slider']]:w-4"
//               defaultValue={volume * 100}
//               max={100}
//               onValueChange={handleVolumeChange}
//               step={1}
//             />
//           </div>
//         ),
//         className: 'w-[100px] p-2',
//         side: 'top',
//       }}
//       trigger={{
//         children: (
//           <Button
//             className={cn('h-4 w-8 rounded-full font-semibold text-[.6rem]')}
//             icon={getVolumeIcon()}
//             size={'sm'}
//             variant={'default'}
//           />
//         ),
//       }}
//     />
//   )
// }
//
// export const AudioSpeed = () => {
//   const { speed, setSpeed } = useAudioDataProvider()
//
//   return (
//     <>
//       <Button
//         className={cn('h-4 w-8 rounded-full font-semibold text-[.6rem]')}
//         onClick={() => setSpeed(speed > 1.5 ? 0.5 : speed + 0.5)}
//         size={'sm'}
//         variant={'default'}>
//         x{speed}
//       </Button>
//     </>
//   )
// }
//
// export interface AudioRecordItemProps {
//   loading?: boolean
//   size?: 'sm' | 'md' | 'lg'
//   barHeight?: number
//   barWidth?: number
//   gap?: number
//   attachment: AttachmentType
//   backgroundColor?: ThemeColor
//   barColor?: ThemeColor
//   barPlayedColor?: ThemeColor
//   minBarHeight?: number
//   style?: React.CSSProperties
//   audio: Blob | null
// }
//
// const AudioRecordItem = ({
//   size = 'sm',
//   audio,
//   loading: loadingState,
//   attachment,
//   style,
//   minBarHeight,
//   barPlayedColor,
//   gap,
//   barColor,
//   barWidth,
//   barHeight,
//   backgroundColor,
// }: AudioRecordItemProps) => {
//   const { duration: audioDuration, speed, volume } = useAudioDataProvider()
//   const duration = audioDuration * 1000
//
//   const [isPlaying, setIsPlaying] = React.useState<boolean>(false)
//   const audioRef = React.useRef<HTMLAudioElement | null>(null)
//   const [loading, setLoading] = React.useState<boolean>(loadingState ?? true)
//   const [currentTime, setCurrentTime] = React.useState<number>(0)
//   const [timeLeft, setTimeLeft] = React.useState<number>(duration)
//
//   React.useEffect(() => {
//     setTimeLeft(duration - currentTime)
//   }, [currentTime, duration])
//
//   React.useEffect(() => {
//     if (audio) {
//       const audioURL = URL.createObjectURL(audio)
//       audioRef.current = new_audio(audioURL)
//
//       // Handle end of the audio
//       audioRef.current.onended = () => {
//         setIsPlaying(false)
//         setCurrentTime(0)
//         setTimeLeft(duration)
//       }
//
//       // Update current time as the audio plays
//       audioRef.current.ontimeupdate = () => {
//         setCurrentTime(audioRef.current!.currentTime * 1000)
//       }
//
//       return () => {
//         if (audioRef.current) {
//           audioRef.current.pause()
//           audioRef.current.src = ''
//         }
//       }
//     }
//   }, [audio])
//
//   // Update the playback rate and keep the audio playing at the current time
//   React.useEffect(() => {
//     if (audioRef.current) {
//       const wasPlaying = isPlaying
//       const currentAudioTime = audioRef.current.currentTime
//
//       // Pause the audio temporarily, change playback rate, and resume if it was playing
//       audioRef.current.pause()
//       audioRef.current.playbackRate = speed
//       audioRef.current.currentTime = currentAudioTime
//       audioRef.current.volume = volume
//
//       if (wasPlaying) {
//         audioRef.current.play()
//       }
//     }
//   }, [speed, volume])
//
//   // Play or pause audio
//   const handlePlayPause = React.useCallback(() => {
//     if (isPlaying) {
//       audioRef.current?.pause()
//     } else {
//       audioRef.current?.play()
//     }
//     setIsPlaying(!isPlaying)
//   }, [isPlaying])
//
//   return (
//     <>
//       <AudioItemWrapper
//         attachment={{
//           ...attachment,
//           file: attachment.file ?? audio,
//         }}
//         children={
//           <div onClick={(event) => visualizer_click_handler({ audioRef, event, setCurrentTime })}>
//             <AudioVisualizerMemo
//               backgroundColor={backgroundColor}
//               barColor={barColor}
//               barPlayedColor={barPlayedColor}
//               barWidth={barWidth ?? 3}
//               blob={audio}
//               currentTime={currentTime / 1000}
//               gap={gap ?? 2}
//               height={barHeight ?? 27}
//               minBarHeight={minBarHeight ?? 1}
//               setCurrentTime={setCurrentTime}
//               setLoading={setLoading}
//               style={style}
//               width={barWidth ?? 180}
//             />
//           </div>
//         }
//         duration={duration}
//         handlePlayPause={handlePlayPause}
//         isPlaying={isPlaying}
//         loading={loading}
//         size={size}
//         timeLeft={timeLeft}
//       />
//     </>
//   )
// }
//
// export interface FetchAudioBlobParams {
//   url: string
//   setAudioBlob: React.Dispatch<React.SetStateAction<Blob | null>>
// }
//
// export const fetchAudioBlob = async ({ url, setAudioBlob }: FetchAudioBlobParams) => {
//   try {
//     const response = await fetch(url)
//     if (!response.ok) {
//       console.error('Failed to fetch audio:', response.statusText)
//       return setAudioBlob(null)
//     }
//
//     const blob = await response.blob()
//     setAudioBlob(blob)
//   } catch (error) {
//     setAudioBlob(null)
//     console.error('Error fetching audio:', error)
//   }
// }
//
// export interface AudioItemProps {
//   attachment: AttachmentType
// }
//
// const AudioItem: React.FC<AudioItemProps> = ({ attachment }) => {
//   const [audioBlob, setAudioBlob] = React.useState<Blob | null>(attachment.file ? attachment.file : null)
//
//   React.useEffect(() => {
//     // if (contentSchema.safeParse(attachment).error) return
//     if (!attachment.url || !attachment.url.startsWith('https://')) return
//     fetchAudioBlob({ setAudioBlob, url: attachment.url })
//   }, [attachment])
//
//   return (
//     <AudioDataProvider>
//       <AudioRecordItem attachment={attachment} audio={audioBlob} loading={audioBlob === null ? true : false} />
//     </AudioDataProvider>
//   )
// }
//
// // Audio Provider
// export interface AudioDataContextType {
//   process_audio: (args: Omit<ProcessBlobParams, 'setAnimationProgress' | 'setDuration' | 'setData'>) => Promise<void>
//   data: dataPoint[]
//   speed: number
//   setSpeed: React.Dispatch<React.SetStateAction<number>>
//   animationProgress: number
//   setAnimationProgress: React.Dispatch<React.SetStateAction<number>>
//   recordings: RecordingtType[]
//   setRecordings: React.Dispatch<React.SetStateAction<RecordingtType[]>>
//   duration: number
//   setDuration: React.Dispatch<React.SetStateAction<number>>
//   recording: boolean
//   setRecording: React.Dispatch<React.SetStateAction<boolean>>
//   volume: number
//   setVolume: React.Dispatch<React.SetStateAction<number>>
// }
//
// export const AudioDataContext = React.createContext<AudioDataContextType | undefined>(undefined)
//
// const useAudioDataProvider = (): AudioDataContextType => {
//   const context = React.useContext(AudioDataContext)
//   if (!context) {
//     throw new Error('useAudioProvider must be used within an AudioServiceProvider')
//   }
//   return context
// }
//
// export interface AudioProviderProps {
//   children: React.ReactNode
// }
//
// const AudioDataProvider: React.FC<AudioProviderProps> = ({ children }) => {
//   const [data, setData] = React.useState<dataPoint[]>([])
//   const [duration, setDuration] = React.useState<number>(0)
//   const [recordings, setRecordings] = React.useState<RecordingtType[]>([])
//   const [speed, setSpeed] = React.useState<number>(1)
//   const [volume, setVolume] = React.useState(1)
//   const [animationProgress, setAnimationProgress] = React.useState<number>(0)
//   const [recording, setRecording] = React.useState<boolean>(false)
//
//   const process_audio = React.useCallback(
//     async ({
//       canvasRef,
//       blob,
//       barWidth,
//       gap,
//       backgroundColor,
//       barColor,
//       barPlayedColor,
//       minBarHeight,
//       setLoading,
//       width,
//       height,
//     }: Omit<ProcessBlobParams, 'setAnimationProgress' | 'setDuration' | 'setData'>) => {
//       await process_blob({
//         backgroundColor,
//         barColor,
//         barPlayedColor,
//         barWidth,
//         blob,
//         canvasRef,
//         gap,
//         height,
//         minBarHeight,
//         setAnimationProgress,
//         setData,
//         setDuration,
//         setLoading,
//         width,
//       })
//     },
//     [],
//   )
//
//   return (
//     <AudioDataContext.Provider
//       value={{
//         animationProgress,
//         data,
//         duration,
//         process_audio,
//         recording,
//         recordings,
//         setAnimationProgress,
//         setDuration,
//         setRecording,
//         setRecordings,
//         setSpeed,
//         setVolume,
//         speed,
//         volume,
//       }}>
//       {children}
//     </AudioDataContext.Provider>
//   )
// }
//
// export { Audio, AudioItem, AudioRecordItem, AudioItemWrapper, AudioDataProvider, useAudioDataProvider }
