import type { RegistryEntry } from '../registry-schema'

// All chart entries share the same shape: registry:block, files: [],
// rooted under `charts/<name>`, depending on `card` and `chart`. Some
// charts also need `select`. Hoisting a builder makes the deps audit-able
// at a glance and shrinks the file from ~580 LoC to ~100 LoC.
function chart(name: string, subcat: string, extraDeps: string[] = []): RegistryEntry {
  return {
    categories: ['charts', subcat],
    files: [],
    name,
    registryDependencies: ['card', 'chart', ...extraDeps],
    root_folder: `charts/${name}`,
    type: 'registry:block',
  }
}

export const registryCharts: RegistryEntry[] = [
  // Area Charts
  chart('chart-area-axes', 'charts-area'),
  chart('chart-area-default', 'charts-area'),
  chart('chart-area-gradient', 'charts-area'),
  chart('chart-area-icons', 'charts-area'),
  chart('chart-area-interactive', 'charts-area', ['select']),
  chart('chart-area-legend', 'charts-area'),
  chart('chart-area-linear', 'charts-area'),
  chart('chart-area-stacked-expand', 'charts-area'),
  chart('chart-area-stacked', 'charts-area'),
  chart('chart-area-step', 'charts-area'),

  // Bar Charts
  chart('chart-bar-active', 'charts-bar'),
  chart('chart-bar-default', 'charts-bar'),
  chart('chart-bar-horizontal', 'charts-bar'),
  chart('chart-bar-interactive', 'charts-bar'),
  chart('chart-bar-label-custom', 'charts-bar'),
  chart('chart-bar-label', 'charts-bar'),
  chart('chart-bar-mixed', 'charts-bar'),
  chart('chart-bar-multiple', 'charts-bar'),
  chart('chart-bar-negative', 'charts-bar'),
  chart('chart-bar-stacked', 'charts-bar'),

  // Line Charts
  chart('chart-line-default', 'charts-line'),
  chart('chart-line-dots-colors', 'charts-line'),
  chart('chart-line-dots-custom', 'charts-line'),
  chart('chart-line-dots', 'charts-line'),
  chart('chart-line-interactive', 'charts-line'),
  chart('chart-line-label-custom', 'charts-line'),
  chart('chart-line-label', 'charts-line'),
  chart('chart-line-linear', 'charts-line'),
  chart('chart-line-multiple', 'charts-line'),
  chart('chart-line-step', 'charts-line'),

  // Pie Charts
  chart('chart-pie-donut-active', 'charts-pie'),
  chart('chart-pie-donut-text', 'charts-pie'),
  chart('chart-pie-donut', 'charts-pie'),
  chart('chart-pie-interactive', 'charts-pie'),
  chart('chart-pie-label-custom', 'charts-pie'),
  chart('chart-pie-label-list', 'charts-pie'),
  chart('chart-pie-label', 'charts-pie'),
  chart('chart-pie-legend', 'charts-pie'),
  chart('chart-pie-separator-none', 'charts-pie'),
  chart('chart-pie-simple', 'charts-pie'),
  chart('chart-pie-stacked', 'charts-pie'),

  // Radar Charts
  chart('chart-radar-default', 'charts-radar'),
  chart('chart-radar-dots', 'charts-radar'),
  chart('chart-radar-grid-circle-fill', 'charts-radar'),
  chart('chart-radar-grid-circle-no-lines', 'charts-radar'),
  chart('chart-radar-grid-circle', 'charts-radar'),
  chart('chart-radar-grid-custom', 'charts-radar'),
  chart('chart-radar-grid-fill', 'charts-radar'),
  chart('chart-radar-grid-none', 'charts-radar'),
  chart('chart-radar-icons', 'charts-radar'),
  chart('chart-radar-label-custom', 'charts-radar'),
  chart('chart-radar-legend', 'charts-radar'),
  chart('chart-radar-lines-only', 'charts-radar'),
  chart('chart-radar-multiple', 'charts-radar'),
  chart('chart-radar-radius', 'charts-radar'),

  // Radial Charts
  chart('chart-radial-grid', 'charts-radial'),
  chart('chart-radial-label', 'charts-radial'),
  chart('chart-radial-shape', 'charts-radial'),
  chart('chart-radial-simple', 'charts-radial'),
  chart('chart-radial-stacked', 'charts-radial'),
  chart('chart-radial-text', 'charts-radial'),

  // Tooltip Variants
  chart('chart-tooltip-default', 'charts-tooltip'),
  chart('chart-tooltip-indicator-line', 'charts-tooltip'),
  chart('chart-tooltip-indicator-none', 'charts-tooltip'),
  chart('chart-tooltip-label-none', 'charts-tooltip'),
  chart('chart-tooltip-label-custom', 'charts-tooltip'),
  chart('chart-tooltip-label-formatter', 'charts-tooltip'),
  chart('chart-tooltip-formatter', 'charts-tooltip'),
  chart('chart-tooltip-icons', 'charts-tooltip'),
  chart('chart-tooltip-advanced', 'charts-tooltip'),
]
