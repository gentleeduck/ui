import { PreviewPanel } from '@gentleduck/registry-ui/preview-panel'

const SVG_HTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <rect x="10" y="10" width="80" height="80" rx="8" fill="#3b82f6" opacity="0.8"/>
  <rect x="110" y="10" width="80" height="80" rx="8" fill="#10b981" opacity="0.8"/>
  <rect x="10" y="110" width="80" height="80" rx="8" fill="#f59e0b" opacity="0.8"/>
  <rect x="110" y="110" width="80" height="80" rx="8" fill="#ef4444" opacity="0.8"/>
  <text x="100" y="105" text-anchor="middle" font-size="12" fill="currentColor">SVG Content</text>
</svg>`

export default function Demo() {
  return <PreviewPanel html={SVG_HTML} maxHeight="350px" className="rounded-lg border bg-card" />
}
