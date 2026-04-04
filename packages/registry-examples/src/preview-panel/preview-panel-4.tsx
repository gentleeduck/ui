import { PreviewPanel } from '@gentleduck/registry-ui/preview-panel'

export default function Demo() {
  return (
    <PreviewPanel maxHeight="400px" initialZoom={0.8} className="rounded-lg border bg-card">
      {/* biome-ignore lint/performance/noImgElement: example component demonstrating PreviewPanel with a plain img */}
      <img
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80"
        alt="Landscape"
        className="max-w-[600px] rounded-md"
        draggable={false}
      />
    </PreviewPanel>
  )
}
