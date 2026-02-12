import { PreviewPanel } from '@gentleduck/registry-ui-duckui/preview-panel'

export default function PreviewPanelImage() {
  return (
    <PreviewPanel maxHeight="400px" initialZoom={0.8} className="rounded-lg border bg-card">
      <img
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80"
        alt="Landscape"
        className="max-w-[600px] rounded-md"
        draggable={false}
      />
    </PreviewPanel>
  )
}
