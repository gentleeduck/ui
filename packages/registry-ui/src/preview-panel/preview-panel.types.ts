import type React from 'react'

export interface IPreviewPanelState {
  zoom: number
  x: number
  y: number
}
export type PreviewPanelState = IPreviewPanelState

export interface IPreviewPanelProps extends React.HTMLProps<HTMLDivElement> {
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
  /**
   * Raw HTML string rendered verbatim via `dangerouslySetInnerHTML`. Takes
   * priority over children.
   *
   * SECURITY: this value is NOT sanitised. The caller MUST pass only HTML it
   * fully trusts (e.g. a build-time constant). Never wire user-, CMS-, or
   * URL-derived markup into this prop — doing so is an XSS sink. Pass React
   * `children` instead for untrusted content.
   */
  unsafeHtml?: string
  /** Called whenever zoom or position changes. Use to sync with another panel. */
  onStateChange?: (state: IPreviewPanelState) => void
  /** External state to apply. When set, the panel syncs to this state. */
  syncState?: IPreviewPanelState
}

export interface IPreviewPanelDialogProps {
  /** Content to render in both the inline panel and the dialog panel. */
  children?: React.ReactNode
  /**
   * Raw HTML string rendered verbatim via `dangerouslySetInnerHTML`. Takes
   * priority over children.
   *
   * SECURITY: this value is NOT sanitised. The caller MUST pass only HTML it
   * fully trusts. Never wire untrusted markup into this prop.
   */
  unsafeHtml?: string
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
