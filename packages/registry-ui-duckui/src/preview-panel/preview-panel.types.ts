import type React from 'react'

export type PreviewPanelState = {
  zoom: number
  x: number
  y: number
}

export interface PreviewPanelProps extends React.HTMLProps<HTMLDivElement> {
  /** Maximum height of the panel container. */
  maxHeight?: string
  /** Minimum zoom level. Default 0.25. */
  minZoom?: number
  /** Maximum zoom level. Default 4. */
  maxZoom?: number
  /** Initial zoom level. Default 1. */
  initialZoom?: number
  /** Whether to show zoom controls. Default true. */
  showControls?: boolean
  /** Raw HTML string to render inside the panel. Takes priority over children. */
  html?: string
  /** Called whenever zoom or position changes. Use to sync with another panel. */
  onStateChange?: (state: PreviewPanelState) => void
  /** External state to apply. When set, the panel syncs to this state. */
  syncState?: PreviewPanelState
}

export interface PreviewPanelDialogProps {
  /** Content to render in both the inline panel and the dialog panel. */
  children?: React.ReactNode
  /** Raw HTML string to render. Takes priority over children. */
  html?: string
  /** Class name for the inline panel wrapper. */
  className?: string
  /** Class name applied to both PreviewPanel instances. */
  panelClassName?: string
  /** Maximum height of the inline panel. */
  maxHeight?: string
  /** Minimum zoom level. Default 0.25. */
  minZoom?: number
  /** Maximum zoom level. Default 4. */
  maxZoom?: number
  /** Initial zoom level. Default 1. */
  initialZoom?: number
  /** Whether to show zoom controls. Default true. */
  showControls?: boolean
  /** Whether to sync zoom and position between inline and dialog panels. Default true. */
  syncPanels?: boolean
}
