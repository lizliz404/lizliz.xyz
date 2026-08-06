'use client'

/**
 * HomeAmbientBg V2 — 「纸缘批注 / Annotated Margin」
 *
 * Round 2 draft ONLY. Lives under /tmp until Hermes/Liz merge.
 * Target production path (when approved): src/components/HomeAmbientBg.tsx
 *
 * Thesis: the homepage background is the quiet margin of a working page —
 * warm paper, fine grain, one terracotta proof mark — not a second product.
 *
 * Stack: Canvas 2D only. No three.js / R3F / EffectComposer / WebGPU.
 * Lifecycle mirrors V1 engineering standards without the GL tax:
 * IntersectionObserver + visibilitychange + dispose; reduced-motion → static frame;
 * data-theme MutationObserver + prefers-color-scheme; frame-rate-independent damp.
 */

import { useEffect, useRef, useState } from 'react'

interface HomeAmbientBgProps {
  className?: string
}

/** Design MD tokens as design source; map to live CSS vars at paint time. */
const MD = {
  paper: '#f7f5ef',
  ink: '#181716',
  muted: '#6f6a61',
  primary: '#c76f3a',
  darkPaper: '#1c1a16',
  darkInk: '#e8e4dd',
  darkMuted: '#9b9488',
} as const

const TUNING = {
  /** Canvas backing store cap — grain is 1px strokes; >1.5 wastes fill-rate. */
  maxPixelRatio: 1.5,
  grainCount: 110,
  washBreathAmp: 0.045,
  washBreathHz: 0.22,
  /** Annotation draw-in seconds, then permanent sleep (unless reduce → instant). */
  markDrawSeconds: 1.15,
  dampLambda: 3.2,
  /** Whole-layer pointer parallax in CSS px (micro only). */
  parallaxPx: 5,
  parallaxLambda: 6,
} as const

function resolveDark(): boolean {
  const explicit = document.documentElement.dataset.theme
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return explicit ? explicit === 'dark' : prefersDark
}

function damp(current: number, target: number, lambda: number, dt: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt))
}

function mulberry32(seed: number) {
  let t = seed >>> 0
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

type Palette = {
  paper: string
  ink: string
  muted: string
  primary: string
}

function readPalette(dark: boolean): Palette {
  const styles = getComputedStyle(document.documentElement)
  const cssBg = styles.getPropertyValue('--bg').trim()
  const cssFg = styles.getPropertyValue('--fg').trim()
  const cssMuted = styles.getPropertyValue('--fg-secondary').trim()
  const cssAccent = styles.getPropertyValue('--color-accent').trim()
  // Prefer live site tokens when present (zero drift); fall back to DESIGN.md.
  return {
    paper: cssBg || (dark ? MD.darkPaper : MD.paper),
    ink: cssFg || (dark ? MD.darkInk : MD.ink),
    muted: cssMuted || (dark ? MD.darkMuted : MD.muted),
    primary: cssAccent || MD.primary,
  }
}

export default function HomeAmbientBg({ className }: HomeAmbientBgProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)
  const [paletteKey, setPaletteKey] = useState<'light' | 'dark'>(() =>
    typeof document === 'undefined' ? 'light' : resolveDark() ? 'dark' : 'light',
  )

  useEffect(() => {
    const sync = () => setPaletteKey(resolveDark() ? 'dark' : 'light')
    sync()
    const mo = new MutationObserver(sync)
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener('change', sync)
    return () => {
      mo.disconnect()
      mq.removeEventListener('change', sync)
    }
  }, [])

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let disposed = false
    let animId = 0
    let running = false
    let isInView = false
    let startMs: number | null = null
    let lastT = performance.now()
    let markProgress = 0
    let washPhase = 0
    const mouse = { x: 0, y: 0 }
    const eased = { x: 0, y: 0 }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dark = paletteKey === 'dark'
    const palette = readPalette(dark)
    const rand = mulberry32(dark ? 0x91a2b3c4 : 0x51c07e11)

    type Grain = { x: number; y: number; len: number; ang: number; a: number }
    const grains: Grain[] = []
    for (let i = 0; i < TUNING.grainCount; i++) {
      grains.push({
        x: rand(),
        y: rand(),
        len: 0.004 + rand() * 0.012,
        ang: (rand() - 0.5) * 0.9,
        a: 0.03 + rand() * 0.05,
      })
    }

    const resize = () => {
      if (disposed) return
      const w = wrap.clientWidth || window.innerWidth
      const h = wrap.clientHeight || window.innerHeight
      const pr = Math.min(window.devicePixelRatio || 1, TUNING.maxPixelRatio)
      canvas.width = Math.max(1, Math.floor(w * pr))
      canvas.height = Math.max(1, Math.floor(h * pr))
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(pr, 0, 0, pr, 0, 0)
    }

    const drawFrame = (mark: number, washAmp: number) => {
      const w = wrap.clientWidth || window.innerWidth
      const h = wrap.clientHeight || window.innerHeight
      ctx.clearRect(0, 0, w, h)

      // 1) Paper field — transparent so body --bg shows; soft primary wash only.
      const washX = w * 0.62 + eased.x
      const washY = h * 0.38 + eased.y
      const washR = Math.max(w, h) * 0.55
      const wash = ctx.createRadialGradient(washX, washY, 0, washX, washY, washR)
      const washAlpha = (dark ? 0.1 : 0.08) + washAmp
      wash.addColorStop(0, hexAlpha(palette.primary, washAlpha))
      wash.addColorStop(0.45, hexAlpha(palette.primary, washAlpha * 0.35))
      wash.addColorStop(1, hexAlpha(palette.primary, 0))
      ctx.fillStyle = wash
      ctx.fillRect(0, 0, w, h)

      // 2) Paper grain — short ink ticks, fixed seed (editorial, not sparkle).
      ctx.lineCap = 'round'
      for (const g of grains) {
        const x = g.x * w
        const y = g.y * h
        const len = g.len * Math.min(w, h)
        ctx.strokeStyle = hexAlpha(palette.ink, g.a * (dark ? 0.7 : 1))
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x + Math.cos(g.ang) * len, y + Math.sin(g.ang) * len)
        ctx.stroke()
      }

      // 3) Margin rules — two faint vertical guides (notebook edge, not grid prison).
      ctx.strokeStyle = hexAlpha(palette.muted, dark ? 0.14 : 0.11)
      ctx.lineWidth = 1
      const left = w * 0.12
      const right = w * 0.88
      ctx.beginPath()
      ctx.moveTo(left, h * 0.18)
      ctx.lineTo(left, h * 0.82)
      ctx.moveTo(right, h * 0.22)
      ctx.lineTo(right, h * 0.78)
      ctx.stroke()

      // 4) One proofreading mark — draws once, then sleeps. Memory without theater.
      const mx = w * 0.58 + eased.x * 0.3
      const my = h * 0.52 + eased.y * 0.3
      const m = Math.min(1, Math.max(0, mark))
      const markLen = 54 * m
      ctx.strokeStyle = hexAlpha(palette.primary, 0.55 * m)
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(mx, my)
      ctx.lineTo(mx + markLen, my + 2 * m)
      ctx.stroke()
      // small registration cross at the start of the stroke
      if (m > 0.15) {
        const c = Math.min(1, (m - 0.15) / 0.35)
        const s = 5 * c
        ctx.strokeStyle = hexAlpha(palette.primary, 0.4 * c)
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(mx - s, my)
        ctx.lineTo(mx + s, my)
        ctx.moveTo(mx, my - s)
        ctx.lineTo(mx, my + s)
        ctx.stroke()
      }
    }

    const paint = (now: number) => {
      if (disposed) return
      const dt = Math.min((now - lastT) / 1000, 0.1)
      lastT = now
      if (startMs === null) startMs = now
      const elapsed = (now - startMs) / 1000

      if (reduceMotion) {
        markProgress = 1
      } else {
        const target = Math.min(1, elapsed / TUNING.markDrawSeconds)
        markProgress = damp(markProgress, target, TUNING.dampLambda, dt)
        washPhase += dt
      }

      eased.x = damp(eased.x, mouse.x * TUNING.parallaxPx, TUNING.parallaxLambda, dt)
      eased.y = damp(eased.y, mouse.y * TUNING.parallaxPx, TUNING.parallaxLambda, dt)

      const washAmp = reduceMotion
        ? 0
        : Math.sin(washPhase * Math.PI * 2 * TUNING.washBreathHz) * TUNING.washBreathAmp

      drawFrame(markProgress, washAmp)

      // After mark settles and reduce is off, keep a cheap breath loop.
      // When reduce: single frame only (caller stops loop).
      const markDone = markProgress > 0.995
      if (markDone && reduceMotion) {
        stopLoop()
      }
    }

    const animate = () => {
      if (!running || disposed) return
      animId = requestAnimationFrame(animate)
      paint(performance.now())
    }

    const startLoop = () => {
      if (running || disposed) return
      if (reduceMotion) {
        // One static frame at settled mark — no loop.
        resize()
        paint(performance.now())
        setReady(true)
        return
      }
      running = true
      lastT = performance.now()
      animId = requestAnimationFrame(animate)
    }

    const stopLoop = () => {
      running = false
      cancelAnimationFrame(animId)
    }

    const onPointer = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1
      const y = ((e.clientY - rect.top) / Math.max(1, rect.height)) * 2 - 1
      mouse.x = Math.max(-1, Math.min(1, x))
      mouse.y = Math.max(-1, Math.min(1, y))
    }

    // Shell is pointer-events:none — listen on window for micro parallax.
    const onMove = (e: PointerEvent) => onPointer(e)

    const onVisibility = () => {
      if (document.hidden) stopLoop()
      else if (isInView) startLoop()
    }

    resize()
    const ro = new ResizeObserver(() => {
      resize()
      if (!running && reduceMotion) paint(performance.now())
    })
    ro.observe(wrap)

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)

    const io = new IntersectionObserver(
      ([entry]) => {
        isInView = entry.isIntersecting
        if (isInView && !document.hidden) {
          setReady(true)
          startLoop()
        } else {
          stopLoop()
        }
      },
      { threshold: 0 },
    )
    io.observe(wrap)

    return () => {
      disposed = true
      stopLoop()
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [paletteKey])

  return (
    <div
      ref={wrapRef}
      className={className}
      aria-hidden="true"
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        opacity: ready ? 1 : 0,
        transition: 'opacity 0.9s ease-out',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '100%' }}
      />
    </div>
  )
}

/** #rrggbb + alpha 0–1 → rgba() */
function hexAlpha(hex: string, alpha: number): string {
  const raw = hex.trim()
  if (raw.startsWith('rgba') || raw.startsWith('rgb')) {
    // Already a computed color — approximate by overlaying with alpha via canvas-friendly form.
    return raw
  }
  let h = raw.replace('#', '')
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  if (h.length !== 6) return `rgba(199,111,58,${alpha})`
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${Math.max(0, Math.min(1, alpha))})`
}
