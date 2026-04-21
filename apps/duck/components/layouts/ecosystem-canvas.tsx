'use client'

import { useEffect, useRef } from 'react'

const LEFT_PACKAGES = [
  { name: '@gentleduck/ui', color: '#00d4ff' },
  { name: '@gentleduck/primitives', color: '#a78bfa' },
  { name: '@gentleduck/cli', color: '#4ade80' },
  { name: '@gentleduck/calendar', color: '#fb923c' },
]

const RIGHT_PACKAGES = [
  { name: '@gentleduck/vim', color: '#f87171' },
  { name: '@gentleduck/state', color: '#818cf8' },
  { name: '@gentleduck/iam', color: '#ef4444' },
  { name: '@gentleduck/upload', color: '#3b82f6' },
]

const LAYER_COUNT = 7

export function EcosystemCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const logo = new Image()
    logo.src = '/icons/icon-dark.png'
    logo.onload = () => {} // triggers repaint on next frame naturally
    const dpr = window.devicePixelRatio || 1

    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.scale(dpr, dpr)
    }
    resize()

    const W = canvas.offsetWidth
    const H = canvas.offsetHeight
    const cx = W / 2
    const cy = H / 2

    // Isometric tile dimensions
    const tw = 180 // tile width
    const th = 104 // tile height (isometric top face)
    const lh = 18 // layer thickness (side height)
    const gap = 4 // gap between layers

    // Isometric helpers
    // Top face: diamond shape at world (gx, gy, gz)
    function isoX(gx: number, gz: number) {
      return cx + ((gx - gz) * tw) / 2
    }
    function isoY(gy: number, gx: number, gz: number) {
      return cy - gy * (lh + gap) + ((gx + gz) * th) / 2
    }

    function drawLayer(layerIdx: number, isTop: boolean, floatY: number) {
      const gy = layerIdx
      const tx = isoX(0, 0)
      const ty = isoY(gy, 0, 0) + floatY

      // Top face corners (diamond)
      const topFace = [
        { x: tx, y: ty - th / 2 }, // top
        { x: tx + tw / 2, y: ty }, // right
        { x: tx, y: ty + th / 2 }, // bottom
        { x: tx - tw / 2, y: ty }, // left
      ]

      // Left face (bottom-left side)
      const leftFace = [
        topFace[3],
        topFace[2],
        { x: topFace[2].x, y: topFace[2].y + lh },
        { x: topFace[3].x, y: topFace[3].y + lh },
      ]

      // Right face (bottom-right side)
      const rightFace = [
        topFace[2],
        topFace[1],
        { x: topFace[1].x, y: topFace[1].y + lh },
        { x: topFace[2].x, y: topFace[2].y + lh },
      ]

      function poly(pts: { x: number; y: number }[]) {
        ctx.beginPath()
        ctx.moveTo(pts[0].x, pts[0].y)
        pts.slice(1).forEach((p) => ctx.lineTo(p.x, p.y))
        ctx.closePath()
      }

      if (isTop) {
        // Top layer: gradient fill
        const grad = ctx.createLinearGradient(tx - tw / 2, ty, tx + tw / 2, ty)
        grad.addColorStop(0, '#6d28d9')
        grad.addColorStop(0.5, '#4f46e5')
        grad.addColorStop(1, '#0ea5e9')

        poly(topFace)
        ctx.fillStyle = grad
        ctx.fill()
        ctx.strokeStyle = 'rgba(139,92,246,0.6)'
        ctx.lineWidth = 1
        ctx.stroke()

        // Left face
        poly(leftFace)
        ctx.fillStyle = '#1e1b4b'
        ctx.fill()
        ctx.strokeStyle = 'rgba(99,102,241,0.4)'
        ctx.stroke()

        // Right face
        poly(rightFace)
        ctx.fillStyle = '#1e1b4b'
        ctx.fill()
        ctx.strokeStyle = 'rgba(99,102,241,0.4)'
        ctx.stroke()

        // Logo on top layer
        if (logo.complete && logo.naturalWidth > 0) {
          const logoSize = 38
          ctx.save()
          ctx.drawImage(logo, tx - logoSize / 2, ty - logoSize / 2, logoSize, logoSize)
          ctx.restore()
        }
      } else {
        // Normal layer
        const alpha = 0.5 + layerIdx * 0.07
        poly(topFace)
        ctx.fillStyle = `rgba(24,24,27,${alpha})`
        ctx.fill()
        ctx.strokeStyle = 'rgba(63,63,70,0.8)'
        ctx.lineWidth = 1
        ctx.stroke()

        poly(leftFace)
        ctx.fillStyle = `rgba(15,15,17,${alpha})`
        ctx.fill()
        ctx.strokeStyle = 'rgba(63,63,70,0.5)'
        ctx.stroke()

        poly(rightFace)
        ctx.fillStyle = `rgba(20,20,22,${alpha})`
        ctx.fill()
        ctx.strokeStyle = 'rgba(63,63,70,0.5)'
        ctx.stroke()
      }

      return { topFace, leftFace, rightFace, tx, ty }
    }

    function drawDottedLine(x1: number, y1: number, x2: number, y2: number, color: string) {
      ctx.setLineDash([3, 5])
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.strokeStyle = color
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.setLineDash([])
    }

    function drawLabel(x: number, y: number, name: string, color: string, align: 'left' | 'right') {
      // Pill bg
      const padX = 8,
        padY = 4
      const tw2 = ctx.measureText(name).width + padX * 2 + 10
      const th2 = 20
      const px = align === 'left' ? x - tw2 : x
      ctx.beginPath()
      ctx.roundRect(px, y - th2 / 2, tw2, th2, 4)
      ctx.fillStyle = '#18181b'
      ctx.fill()
      ctx.strokeStyle = '#27272a'
      ctx.lineWidth = 1
      ctx.stroke()

      // Color dot
      ctx.beginPath()
      ctx.arc(px + 10, y, 3, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.shadowColor = color
      ctx.shadowBlur = 6
      ctx.fill()
      ctx.shadowBlur = 0

      // Text
      ctx.font = '10px "JetBrains Mono", monospace'
      ctx.fillStyle = '#a1a1aa'
      ctx.textAlign = align === 'left' ? 'right' : 'left'
      ctx.textBaseline = 'middle'
      ctx.fillText(name, align === 'left' ? x - padX : x + 18, y)
    }

    // Pulse state
    const leftPulses = LEFT_PACKAGES.map(() => ({ t: Math.random(), speed: 0.003 + Math.random() * 0.003 }))
    const rightPulses = RIGHT_PACKAGES.map(() => ({ t: Math.random(), speed: 0.003 + Math.random() * 0.003 }))

    let frame = 0
    let raf: number

    function draw() {
      raf = requestAnimationFrame(draw)
      frame++
      ctx.clearRect(0, 0, W, H)

      const floatY = Math.sin(frame * 0.008) * 5

      // Stack center attachment point: left and right of the stack
      const stackCy = isoY(LAYER_COUNT, 0, 0) + floatY + (LAYER_COUNT * (lh + gap)) / 2

      // Label positions
      const leftX = cx - tw * 0.75
      const rightX = cx + tw * 0.75
      const spread = 52

      const leftY = LEFT_PACKAGES.map((_, i) => stackCy - ((LEFT_PACKAGES.length - 1) / 2 - i) * spread)
      const rightY = RIGHT_PACKAGES.map((_, i) => stackCy - ((RIGHT_PACKAGES.length - 1) / 2 - i) * spread)

      // Dotted lines + pulses
      LEFT_PACKAGES.forEach((pkg, i) => {
        const lx = leftX - 10
        const ly = leftY[i]
        const rx = cx - tw / 2 + 10
        const ry = stackCy
        drawDottedLine(lx, ly, rx, ry, 'rgba(63,63,70,0.6)')

        // Pulse
        leftPulses[i].t += leftPulses[i].speed
        if (leftPulses[i].t > 1) leftPulses[i].t = 0
        const t = leftPulses[i].t
        const px2 = lx + (rx - lx) * t
        const py2 = ly + (ry - ly) * t
        ctx.beginPath()
        ctx.arc(px2, py2, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = pkg.color
        ctx.shadowColor = pkg.color
        ctx.shadowBlur = 8
        ctx.fill()
        ctx.shadowBlur = 0
      })

      RIGHT_PACKAGES.forEach((pkg, i) => {
        const lx = cx + tw / 2 - 10
        const ly = stackCy
        const rx = rightX + 10
        const ry = rightY[i]
        drawDottedLine(lx, ly, rx, ry, 'rgba(63,63,70,0.6)')

        rightPulses[i].t += rightPulses[i].speed
        if (rightPulses[i].t > 1) rightPulses[i].t = 0
        const t = rightPulses[i].t
        const px2 = lx + (rx - lx) * t
        const py2 = ly + (ry - ly) * t
        ctx.beginPath()
        ctx.arc(px2, py2, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = pkg.color
        ctx.shadowColor = pkg.color
        ctx.shadowBlur = 8
        ctx.fill()
        ctx.shadowBlur = 0
      })

      // Draw layers bottom to top
      for (let i = 0; i < LAYER_COUNT; i++) {
        drawLayer(i, i === LAYER_COUNT - 1, floatY)
      }

      // Labels on sides
      ctx.setLineDash([])
      LEFT_PACKAGES.forEach((pkg, i) => {
        drawLabel(leftX - 10, leftY[i], pkg.name, pkg.color, 'left')
      })
      RIGHT_PACKAGES.forEach((pkg, i) => {
        drawLabel(rightX + 10, rightY[i], pkg.name, pkg.color, 'right')
      })
    }

    draw()

    const onResize = () => {
      resize()
    }
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas ref={canvasRef} className="mx-auto w-full max-w-[60rem]" style={{ height: '435px', display: 'block' }} />
  )
}
