const STYLE_ID = '__iam_dt_styles__'

// Chrome + minimal utility CSS. Chrome (positioning, slide animation, resize)
// is here. Utility helpers (iam-dt-*) are kept so panels can use them inline;
// they all reference Tailwind/registry-ui design tokens via CSS variables so
// the dark/light theme of the host app drives them automatically.
const CSS = `
.iam-dt-btn-wrap { position: fixed; z-index: 99998; }
.iam-dt-btn-wrap[data-pos="bottom-right"] { bottom: 20px; right: 20px; }
.iam-dt-btn-wrap[data-pos="bottom-left"]  { bottom: 20px; left: 20px; }
.iam-dt-btn-wrap[data-pos="top-right"]    { top: 20px; right: 20px; }
.iam-dt-btn-wrap[data-pos="top-left"]     { top: 20px; left: 20px; }

.iam-dt-panel-wrap {
  position: fixed; z-index: 99999;
  display: flex; flex-direction: column;
  transition: transform 240ms cubic-bezier(.32,.72,0,1), opacity 240ms ease;
  will-change: transform, opacity;
}
.iam-dt-panel-wrap[data-pos="bottom"] { left: 0; right: 0; bottom: 0; }
.iam-dt-panel-wrap[data-pos="top"]    { left: 0; right: 0; top: 0; }
.iam-dt-panel-wrap[data-pos="left"]   { top: 0; bottom: 0; left: 0; }
.iam-dt-panel-wrap[data-pos="right"]  { top: 0; bottom: 0; right: 0; }
.iam-dt-panel-wrap[data-inset="1"]    { padding: 12px; }

.iam-dt-resize { position: absolute; background: transparent; transition: background 160ms ease; }
.iam-dt-resize:hover { background: var(--ring, oklch(0.7 0 0)); }
.iam-dt-resize--ns { left: 0; right: 0; height: 4px; cursor: ns-resize; }
.iam-dt-resize--ew { top: 0; bottom: 0; width: 4px; cursor: ew-resize; }
.iam-dt-panel-wrap[data-pos="bottom"] .iam-dt-resize { top: 0; }
.iam-dt-panel-wrap[data-pos="top"] .iam-dt-resize    { bottom: 0; }
.iam-dt-panel-wrap[data-pos="left"] .iam-dt-resize   { right: 0; }
.iam-dt-panel-wrap[data-pos="right"] .iam-dt-resize  { left: 0; }

@keyframes iam-dt-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.iam-dt-spin { animation: iam-dt-spin 0.9s linear infinite; }

/* Panel utility classes — use design tokens from the host's Tailwind theme. */
.iam-dt-detail { flex: 1 1 auto; overflow: auto; min-height: 0; }
.iam-dt-detail__head {
  display: flex; flex-wrap: wrap; align-items: center; gap: 8px;
  padding: 8px 12px; background: var(--card); border-bottom: 1px solid var(--border);
  position: sticky; top: 0; z-index: 1;
}
.iam-dt-detail__head code { font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace; font-size: 11px; color: var(--foreground); font-weight: 600; }
.iam-dt-detail__meta { margin-left: auto; font-family: ui-monospace, monospace; font-size: 10px; color: var(--muted-foreground); }

.iam-dt-listshell { display: flex; flex-direction: column; height: 100%; min-height: 0; }
.iam-dt-listshell__head { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 8px 12px; background: var(--card); border-bottom: 1px solid var(--border); flex-shrink: 0; }
.iam-dt-listshell__title { font-size: 10px; font-weight: 600; color: var(--muted-foreground); text-transform: uppercase; letter-spacing: 0.18em; }

.iam-dt-trace__group { background: var(--card); border: 1px solid var(--border); border-radius: 6px; overflow: hidden; }
.iam-dt-trace__group-head { display: flex; width: 100%; align-items: center; gap: 8px; padding: 6px 10px; background: transparent; border: none; color: inherit; cursor: pointer; text-align: left; flex-wrap: wrap; transition: background 160ms ease; font-size: 11px; }
.iam-dt-trace__group-head:hover { background: color-mix(in oklab, var(--muted) 50%, transparent); }
.iam-dt-trace__group-body { padding: 8px 10px 10px 20px; display: flex; flex-direction: column; gap: 6px; border-top: 1px solid var(--border); }
.iam-dt-trace__row { display: flex; align-items: center; gap: 8px; padding: 6px 10px; background: var(--card); border: 1px solid var(--border); border-radius: 6px; flex-wrap: wrap; }
.iam-dt-trace__row code { font-family: ui-monospace, monospace; font-size: 11px; color: var(--foreground); }

.iam-dt-stat { display: flex; flex-direction: column; gap: 4px; padding: 10px 12px; background: var(--card); border: 1px solid var(--border); border-radius: 8px; }
.iam-dt-stat__label { font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.14em; color: var(--muted-foreground); }
.iam-dt-stat__value { font-family: ui-monospace, monospace; font-size: 18px; font-weight: 700; color: var(--foreground); line-height: 1.1; letter-spacing: -0.02em; }
.iam-dt-stat__hint { font-family: ui-monospace, monospace; font-size: 9px; color: var(--muted-foreground); }
.iam-dt-stat-grid { display: grid; gap: 8px; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); }

.iam-dt-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.iam-dt-col { display: flex; flex-direction: column; gap: 8px; }
.iam-dt-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
@media (max-width: 600px) { .iam-dt-grid-2 { grid-template-columns: 1fr; } }
.iam-dt-mute { color: var(--muted-foreground); font-family: ui-monospace, monospace; font-size: 10px; }
.iam-dt-soft { color: var(--muted-foreground); }
.iam-dt-pad { padding: 12px; }
.iam-dt-sep { display: inline-block; width: 3px; height: 3px; background: currentColor; opacity: 0.5; border-radius: 50%; flex-shrink: 0; }

.iam-dt-action { color: #60a5fa; font-weight: 600; }
.iam-dt-resource { color: #fbbf24; font-weight: 600; }
.iam-dt-effect-allow { color: #84cc16; font-weight: 700; }
.iam-dt-effect-deny { color: #f87171; font-weight: 700; }

.iam-dt-section__chev { display: inline-flex; align-items: center; justify-content: center; color: var(--muted-foreground); transition: transform 160ms ease; }
.iam-dt-empty { padding: 32px 20px; text-align: center; font-size: 12px; color: var(--muted-foreground); }
.iam-dt-empty--dashed { margin: 12px; padding: 20px; border: 1px dashed var(--border); border-radius: 8px; background: color-mix(in oklab, var(--card) 60%, transparent); }
`

export function ensureStylesInjected() {
  if (typeof document === 'undefined') return
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = CSS
  document.head.appendChild(style)
}
