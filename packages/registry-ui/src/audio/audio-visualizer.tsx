// @ts-noCheck

import { type Direction, useDirection } from '@gentleduck/primitives/direction'
import { useTheme } from 'next-themes'
import React from 'react'
import { useAudioDataProvider } from './audio-record'

export const new_audio = (url: string) => new Audio(url)

// Calculate bar data
export interface IdataPoint {
  max: number
  min: number
}

export interface ICalculateBarDataParams {
  buffer: AudioBuffer
  width: number
  height: number
  barWidth: number
  gap: number
}

export const calculate_bar_data_handler = (() => {
  const cache = new Map()

  return ({ buffer, width, height, barWidth, gap }: ICalculateBarDataParams): IdataPoint[] => {
    // Create a unique key based on the input parameters
    const key = `${buffer.length}-${width}-${height}-${barWidth}-${gap}`

    // Check if the result is already cached
    if (cache.has(key)) {
      return cache.get(key)
    }

    const bufferData = buffer.getChannelData(0)
    const units = Math.floor(width / (barWidth + gap))
    const step = Math.floor(bufferData.length / units)
    const amp = height / 2

    const data: IdataPoint[] = new Array(units)
    let maxDataPoint = 0

    for (let i = 0; i < units; i++) {
      let minSum = 0
      let maxSum = 0
      let minCount = 0
      let maxCount = 0

      const startIdx = i * step
      const endIdx = Math.min(startIdx + step, bufferData.length)

      for (let j = startIdx; j < endIdx; j++) {
        const datum = bufferData[j]
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

    if (amp * 0.8 > maxDataPoint * amp) {
      const adjustmentFactor = (amp * 0.8) / maxDataPoint
      for (let i = 0; i < units; i++) {
        data[i].max *= adjustmentFactor
        data[i].min *= adjustmentFactor
      }
    }

    // Store the computed result in the cache
    cache.set(key, data)

    return data
  }
})()

// Draw Handler
export interface IDrawHandlerParams {
  data: IdataPoint[]
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

export const draw_handler = ({
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
    ctx.fillStyle = 'transparent'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  // Draw bars in a single loop
  const totalBars = data.length
  for (let i = 0; i < totalBars; i++) {
    const height = Math.max(data[i].max * 2 * animationProgress, minBarHeight)
    ctx.fillStyle = playedPercent > i / totalBars && barPlayedColor ? barPlayedColor : barColor
    ctx.fillRect(i * (barWidth + gap), amp - height / 2, barWidth, height)
  }
}

// Process Blob
export interface IProcessBlobParams {
  canvasRef: React.RefObject<HTMLCanvasElement>
  blob: Blob | null
  barWidth: number
  gap: number
  backgroundColor: string
  barColor: string
  barPlayedColor?: string
  minBarHeight: number
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  setData: React.Dispatch<React.SetStateAction<IdataPoint[]>>
  setDuration: React.Dispatch<React.SetStateAction<number>>
  setAnimationProgress: React.Dispatch<React.SetStateAction<number>>
  width: number
  height: number
}

export const process_blob = async ({
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

  draw_handler({
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
  const audioBuffer = await blob.arrayBuffer()

  // Decode the entire audio data
  audioContext.decodeAudioData(audioBuffer, (buffer) => {
    if (!canvasRef.current) return

    setDuration(buffer.duration)

    // Calculate the waveform data for the entire audio buffer
    const barsData = calculate_bar_data_handler({
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
    let animationFrameId: number | null = null

    const animate = (time: number) => {
      if (!startTime) startTime = time

      const elapsedTime = time - startTime
      const progress = Math.min(elapsedTime / 1000, 1)

      // Update animation progress using a ref
      setAnimationProgress(progress)

      draw_handler({
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
        animationFrameId = requestAnimationFrame(animate)
      } else {
        setLoading(false)
      }
    }

    // Start the animation
    animationFrameId = requestAnimationFrame(animate)

    // Cleanup when the component unmounts or the animation is done
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  })
}

export interface IThemeColor {
  light: string
  dark: string
}

// Audio Visualizer
interface IAudioVisualizerProps {
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
  ref?: React.ForwardedRef<HTMLCanvasElement>
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>
}

const AudioVisualizer: React.FC<IAudioVisualizerProps> = ({
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
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const { process_audio, data, duration, animationProgress } = useAudioDataProvider()
  const direction = useDirection(dir as Direction)

  const { theme } = useTheme()

  interface ThemeColors {
    backgroundColor: string
    barColor: string
    barPlayedColor: string
  }

  const colors: Record<string, ThemeColors> = {
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
  }

  const currentColors = colors[theme as string] || colors.light

  React.useEffect(() => {
    setLoading(true)
    process_audio({
      backgroundColor: currentColors.backgroundColor,
      barColor: currentColors.barColor,
      barPlayedColor: currentColors.barPlayedColor,
      barWidth,
      blob,
      canvasRef,
      gap,
      height,
      minBarHeight,
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
    process_audio,
    setLoading,
    width,
  ])

  React.useEffect(() => {
    if (!canvasRef.current) return
    draw_handler({
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
      ref={canvasRef}
      role="img"
      style={style}
      width={width}
    />
  )
}

AudioVisualizer.displayName = 'AudioVisualizer'

export { AudioVisualizer }
