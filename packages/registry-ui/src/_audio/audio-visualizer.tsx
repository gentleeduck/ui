import { useDirection } from '@gentleduck/primitives/direction'
import { useTheme } from 'next-themes'
import * as React from 'react'

export const newAudio = (url: string) => new Audio(url)

// Calculate bar data
export interface IDataPoint {
  max: number
  min: number
}
export type IdataPoint = IDataPoint

export interface ICalculateBarDataParams {
  buffer: AudioBuffer
  width: number
  height: number
  barWidth: number
  gap: number
}

export const calculateBarDataHandler = (() => {
  const cache = new Map<string, IDataPoint[]>()

  return ({ buffer, width, height, barWidth, gap }: ICalculateBarDataParams): IDataPoint[] => {
    // Create a unique key based on the input parameters
    const key = `${buffer.length}-${width}-${height}-${barWidth}-${gap}`

    // Check if the result is already cached
    const cachedData = cache.get(key)
    if (cachedData) return cachedData

    const bufferData = buffer.getChannelData(0)
    const units = Math.floor(width / (barWidth + gap))
    if (units <= 0) return []
    const step = Math.floor(bufferData.length / units)
    const amp = height / 2

    const data: IDataPoint[] = new Array(units)
    let maxDataPoint = 0

    for (let i = 0; i < units; i++) {
      let minSum = 0
      let maxSum = 0
      let minCount = 0
      let maxCount = 0

      const startIdx = i * step
      const endIdx = Math.min(startIdx + step, bufferData.length)

      for (let j = startIdx; j < endIdx; j++) {
        const datum = bufferData[j] ?? 0
        if (datum < 0) {
          minSum += datum
          minCount++
        } else {
          maxSum += datum
          maxCount++
        }
      }

      const minAvg = minCount ? minSum / minCount : 0
      const maxAvg = maxCount ? maxSum / maxCount : 0

      const dataPoint = { max: maxAvg, min: minAvg }
      maxDataPoint = Math.max(maxDataPoint, Math.abs(dataPoint.max), Math.abs(dataPoint.min))
      data[i] = dataPoint
    }

    if (maxDataPoint > 0 && amp * 0.8 > maxDataPoint * amp) {
      const adjustmentFactor = (amp * 0.8) / maxDataPoint
      for (let i = 0; i < units; i++) {
        const dataPoint = data[i]
        if (!dataPoint) continue
        dataPoint.max *= adjustmentFactor
        dataPoint.min *= adjustmentFactor
      }
    }

    // Store the computed result in the cache
    cache.set(key, data)

    return data
  }
})()

// Draw Handler
export interface IDrawHandlerParams {
  data: IDataPoint[]
  canvas: HTMLCanvasElement | null
  barWidth: number
  gap: number
  backgroundColor: string
  barColor: string
  barPlayedColor?: string
  currentTime: number
  duration: number
  minBarHeight: number
  animationProgress: number
}

export const drawHandler = ({
  data,
  canvas,
  barWidth,
  gap,
  backgroundColor,
  barColor,
  barPlayedColor,
  currentTime = 0,
  duration = 1,
  minBarHeight = 5,
  animationProgress = 1,
}: IDrawHandlerParams): void => {
  if (!canvas || !data.length) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const amp = canvas.height / 2
  const playedPercent = currentTime / duration

  // Clear the canvas and set background
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  if (backgroundColor !== 'transparent') {
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  // Draw bars in a single loop
  const totalBars = data.length
  for (let i = 0; i < totalBars; i++) {
    const dataPoint = data[i]
    if (!dataPoint) continue
    const height = Math.max(dataPoint.max * 2 * animationProgress, minBarHeight)
    ctx.fillStyle = playedPercent > i / totalBars && barPlayedColor ? barPlayedColor : barColor
    ctx.fillRect(i * (barWidth + gap), amp - height / 2, barWidth, height)
  }
}

// Process Blob
export interface IProcessBlobParams {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  blob: Blob | null
  barWidth: number
  gap: number
  backgroundColor: string
  barColor: string
  barPlayedColor?: string
  minBarHeight: number
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  setData: React.Dispatch<React.SetStateAction<IDataPoint[]>>
  setDuration: React.Dispatch<React.SetStateAction<number>>
  setAnimationProgress: React.Dispatch<React.SetStateAction<number>>
  width: number
  height: number
}

export const processBlob = async ({
  canvasRef,
  blob,
  barWidth,
  gap,
  backgroundColor,
  barColor,
  barPlayedColor,
  minBarHeight,
  setLoading,
  setData,
  setDuration,
  setAnimationProgress,
  width,
  height,
}: IProcessBlobParams): Promise<void> => {
  if (!canvasRef.current || !blob) return

  const defaultBars = Array.from({ length: Math.floor(width / (barWidth + gap)) }, () => ({
    max: minBarHeight,
    min: minBarHeight,
  }))

  drawHandler({
    animationProgress: 1,
    backgroundColor,
    barColor,
    barPlayedColor,
    barWidth,
    canvas: canvasRef.current,
    currentTime: 0,
    data: defaultBars,
    duration: 1,
    gap,
    minBarHeight: 1,
  })

  const audioContext = new AudioContext()
  try {
    const audioBuffer = await blob.arrayBuffer()
    const buffer = await audioContext.decodeAudioData(audioBuffer)
    if (!canvasRef.current) return

    setDuration(buffer.duration)

    // Calculate the waveform data for the entire audio buffer
    const barsData = calculateBarDataHandler({
      barWidth,
      buffer,
      gap,
      height,
      width,
    })

    // Set the calculated data for rendering
    setData(barsData)

    // Set up for animation
    let startTime: number | null = null
    const animate = (time: number) => {
      if (!startTime) startTime = time

      const elapsedTime = time - startTime
      const progress = Math.min(elapsedTime / 1000, 1)

      // Update animation progress using a ref
      setAnimationProgress(progress)

      drawHandler({
        animationProgress: progress,
        backgroundColor,
        barColor,
        barPlayedColor,
        barWidth,
        canvas: canvasRef.current,
        currentTime: 0,
        data: barsData,
        duration: buffer.duration,
        gap,
        minBarHeight,
      })

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setLoading(false)
      }
    }

    // Start the animation
    requestAnimationFrame(animate)
  } finally {
    void audioContext.close().catch(() => undefined)
  }
}

export interface IThemeColor {
  light: string
  dark: string
}

export interface IAudioVisualizerProps {
  blob: Blob | null
  width: number
  height: number
  dir?: 'ltr' | 'rtl'
  barWidth?: number
  gap?: number
  backgroundColor?: IThemeColor
  barColor?: IThemeColor
  barPlayedColor?: IThemeColor
  currentTime?: number
  minBarHeight?: number
  style?: React.CSSProperties
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const AudioVisualizer = React.forwardRef<HTMLCanvasElement, IAudioVisualizerProps>(
  (
    {
      blob,
      width,
      height,
      dir,
      barWidth = 2,
      gap = 1,
      backgroundColor = { dark: 'transparent', light: 'transparent' },
      barColor = { dark: '#ffffff69', light: 'rgb(184, 184, 184)' },
      barPlayedColor = { dark: '#fafafa', light: '#18181b' },
      currentTime = 0,
      minBarHeight = 2,
      style,
      setLoading,
    },
    ref,
  ) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const [data, setData] = React.useState<IDataPoint[]>([])
    const [duration, setDuration] = React.useState(0)
    const [animationProgress, setAnimationProgress] = React.useState(0)
    const direction = useDirection(dir)

    const { resolvedTheme } = useTheme()

    const colors = {
      dark: {
        backgroundColor: backgroundColor.dark,
        barColor: barColor.dark,
        barPlayedColor: barPlayedColor.dark,
      },
      light: {
        backgroundColor: backgroundColor.light,
        barColor: barColor.light,
        barPlayedColor: barPlayedColor.light,
      },
    } satisfies Record<'dark' | 'light', { backgroundColor: string; barColor: string; barPlayedColor: string }>

    const currentColors = resolvedTheme === 'dark' ? colors.dark : colors.light

    React.useEffect(() => {
      setLoading(true)
      void processBlob({
        backgroundColor: currentColors.backgroundColor,
        barColor: currentColors.barColor,
        barPlayedColor: currentColors.barPlayedColor,
        barWidth,
        blob,
        canvasRef,
        gap,
        height,
        minBarHeight,
        setAnimationProgress,
        setData,
        setDuration,
        setLoading,
        width,
      })
    }, [
      blob,
      barWidth,
      currentColors.backgroundColor,
      currentColors.barColor,
      currentColors.barPlayedColor,
      gap,
      height,
      minBarHeight,
      setLoading,
      width,
    ])

    React.useEffect(() => {
      if (!canvasRef.current) return
      drawHandler({
        animationProgress,
        backgroundColor: currentColors.backgroundColor,
        barColor: currentColors.barColor,
        barPlayedColor: currentColors.barPlayedColor,
        barWidth,
        canvas: canvasRef.current,
        currentTime,
        data: data.length
          ? data
          : Array.from({ length: Math.floor(width / (barWidth + gap)) }, () => ({
              max: minBarHeight,
              min: minBarHeight,
            })),
        duration,
        gap,
        minBarHeight,
      })
    }, [
      data,
      width,
      currentTime,
      duration,
      animationProgress,
      barWidth,
      currentColors.backgroundColor,
      currentColors.barColor,
      currentColors.barPlayedColor,
      gap,
      minBarHeight,
    ])

    return (
      <canvas
        aria-label="Audio waveform visualization"
        dir={direction}
        height={height}
        ref={(node) => {
          canvasRef.current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) ref.current = node
        }}
        role="img"
        style={style}
        width={width}
      />
    )
  },
)

AudioVisualizer.displayName = 'AudioVisualizer'

export { AudioVisualizer }
