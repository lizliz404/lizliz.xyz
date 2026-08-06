'use client'

/**
 * HomeAmbientBg V3 — 「活页边 / Living Margin」
 *
 * Round 3 draft. Drop-in replacement for V2 HomeAmbientBg
 * (same default export + `className` contract).
 *
 * Direction (kept): warm paper · deep ink · single accent · 留白 · serif first.
 * Correction vs V2: V2 died after ~2s (one mark sleeps forever; grain frozen;
 * wash ±4.5% @ 0.22Hz ≈ static). V3 restores a visible time axis without
 * returning to V1's WebGL garden density.
 *
 * Diversity axes:
 *   1) Scroll — margin ink grows; section glyphs bloom (nav semantics)
 *   2) Idle time — grain drift + wash wander (alive paper)
 *   3) Pointer — local grain lift + wash bias (cursor feedback)
 *   4) Theme — dark vs light grain/wash character
 *
 * Stack: Canvas 2D only. No three.js. Engineering red lines from V2 preserved.
 */

import { useEffect, useRef, useState } from 'react'

interface HomeAmbientBgProps {
  className?: string
}

const MD = {
  paper: '#f7f5ef',
  ink: '#181716',
  muted: '#6f6a61',
  primary: '#c76f3a',
  darkPaper: '#1c1a16',
  darkInk: '#e8e4dd',
  darkMuted: '#9b9488',
} as const

/** Section → margin glyph. IDs match HomeContent.tsx. */
const SECTIONS = [
  { id: 'top', yNorm: 0.22, side: 'left' as const, kind: 'cross' as const },
  { id: 'projects', yNorm: 0.36, side: 'left' as const, kind: 'bracket' as const },
  { id: 'skills', yNorm: 0.48, side: 'left' as const, kind: 'dot' as const },
  { id: 'writing', yNorm: 0.62, side: 'right' as const, kind: 'line' as const },
  { id: 'connect', yNorm: 0.78, side: 'right' as const, kind: 'caret' as const },
]

const TUNING = {
  maxPixelRatio: 1.5,
  grainCountDesktop: 120,
  grainCountMobile: 64,
  /** Visible breath — V2's 0.045/0.22Hz was below perception. */
  washBreathAmp: 0.09,
  washBreathHz: 0.35,
  /** Slow Lissajous wander of wash center (cycles / sec). */
  washWanderHzX: 0.045,
  washWanderHzY: 0.032,
  washWanderAmpX: 0.08,
  washWanderAmpY: 0.06,
  /** Grain vertical drift (normalized page / sec). */
  grainDriftPerSec: 0.012,
  dampLambda: 4,
  parallaxPx: 7,
  parallaxLambda: 7,
  /** Pointer "flashlight" radius as fraction of min(w,h). */
  torchRadius: 0.22,
  torchBoost: 0.55,
  /** Hero underline still draws on load — then keeps living via scroll glyphs. */
  heroMarkSeconds: 1.0,
  scrollDamp: 5,
  sectionDamp: 4,
} as const

type Palette = { paper: string; ink: string; muted: string; primary: string }
type Grain = { x: number; y: number; len: number; ang: number; a: number; phase: number }

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

function readPalette(dark: boolean): Palette {
  const styles = getComputedStyle(document.documentElement)
  const cssBg = styles.getPropertyValue('--bg').trim()
  const cssFg = styles.getPropertyValue('--fg').trim()
  const cssMuted = styles.getPropertyValue('--fg-secondary').trim()
  const cssAccent = styles.getPropertyValue('--color-accent').trim()
  return {
    paper: cssBg || (dark ? MD.darkPaper : MD.paper),
    ink: cssFg || (dark ? MD.darkInk : MD.ink),
    muted: cssMuted || (dark ? MD.darkMuted : MD.muted),
    primary: cssAccent || MD.primary,
  }
}

function hexAlpha(hex: string, alpha: number): string {
  const raw = hex.trim()
  if (raw.startsWith('rgb')) return raw
  let h = raw.replace('#', '')
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  if (h.length !== 6) return `rgba(177,78,34,${alpha})`
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${Math.max(0, Math.min(1, alpha))})`
}

function readScrollProgress(): number {
  const el = document.documentElement
  const max = el.scrollHeight - el.clientHeight
  if (max <= 0) return 0
  return Math.min(1, Math.max(0, el.scrollTop / max))
}

/** 0 = below fold, 1 = section top near viewport center. */
function sectionPresence(id: string): number {
  const node = document.getElementById(id)
  if (!node) return 0
  const rect = node.getBoundingClientRect()
  const vh = window.innerHeight || 1
  // Peak when section top is around 28% of viewport.
  const target = vh * 0.28
  const dist = Math.abs(rect.top - target)
  const span = vh * 0.55
  return Math.max(0, 1 - dist / span)
}

function isCoarseMobile(): boolean {
  return (
    window.matchMedia('(max-width: 720px)').matches ||
    window.matchMedia('(pointer: coarse)').matches
  )
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
    let heroMark = 0
    let washPhase = 0
    let grainShift = 0
    let scrollP = 0
    let scrollTarget = 0
    const sectionAmt: number[] = SECTIONS.map(() => 0)
    const sectionTarget: number[] = SECTIONS.map(() => 0)
    const mouse = { x: 0, y: 0, px: 0.5, py: 0.4 }
    const eased = { x: 0, y: 0 }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = isCoarseMobile()
    const dark = paletteKey === 'dark'
    const palette = readPalette(dark)
    const rand = mulberry32(dark ? 0x91a2b3c4 : 0x51c07e11)
    const grainCount = mobile ? TUNING.grainCountMobile : TUNING.grainCountDesktop

    const grains: Grain[] = []
    for (let i = 0; i < grainCount; i++) {
      grains.push({
        x: rand(),
        y: rand(),
        len: 0.004 + rand() * 0.014,
        ang: (rand() - 0.5) * 0.95,
        a: 0.028 + rand() * 0.055,
        phase: rand() * Math.PI * 2,
      })
    }

    const resize = () => {
      if (disposed) return
      const w = wrap.clientWidth || window.innerWidth
      const h = wrap.clientHeight || window.innerHeight
      const pr = Math.min(
        window.devicePixelRatio || 1,
        mobile ? Math.min(TUNING.maxPixelRatio, 1.25) : TUNING.maxPixelRatio,
      )
      canvas.width = Math.max(1, Math.floor(w * pr))
      canvas.height = Math.max(1, Math.floor(h * pr))
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(pr, 0, 0, pr, 0, 0)
    }

    const drawGlyph = (
      kind: (typeof SECTIONS)[number]['kind'],
      x: number,
      y: number,
      amt: number,
      scale: number,
    ) => {
      if (amt <= 0.02) return
      const a = amt * (dark ? 0.5 : 0.58)
      ctx.strokeStyle = hexAlpha(palette.primary, a)
      ctx.fillStyle = hexAlpha(palette.primary, a * 0.85)
      ctx.lineWidth = 1.25
      ctx.lineCap = 'round'
      const s = scale * amt

      if (kind === 'cross') {
        ctx.beginPath()
        ctx.moveTo(x - s, y)
        ctx.lineTo(x + s, y)
        ctx.moveTo(x, y - s)
        ctx.lineTo(x, y + s)
        ctx.stroke()
      } else if (kind === 'bracket') {
        ctx.beginPath()
        ctx.moveTo(x + s * 0.4, y - s)
        ctx.lineTo(x - s * 0.5, y - s)
        ctx.lineTo(x - s * 0.5, y + s)
        ctx.lineTo(x + s * 0.4, y + s)
        ctx.stroke()
      } else if (kind === 'dot') {
        ctx.beginPath()
        ctx.arc(x, y, Math.max(1.2, s * 0.35), 0, Math.PI * 2)
        ctx.fill()
      } else if (kind === 'line') {
        ctx.beginPath()
        ctx.moveTo(x - s * 1.8, y)
        ctx.lineTo(x + s * 1.8, y + 1.5 * amt)
        ctx.stroke()
      } else if (kind === 'caret') {
        ctx.beginPath()
        ctx.moveTo(x - s * 0.7, y + s * 0.5)
        ctx.lineTo(x, y - s * 0.6)
        ctx.lineTo(x + s * 0.7, y + s * 0.5)
        ctx.stroke()
      }
    }

    const drawFrame = () => {
      const w = wrap.clientWidth || window.innerWidth
      const h = wrap.clientHeight || window.innerHeight
      ctx.clearRect(0, 0, w, h)

      // --- 1) Accent wash: breath + slow wander + pointer bias ---
      const wanderX =
        reduceMotion || mobile
          ? 0
          : Math.sin(washPhase * Math.PI * 2 * TUNING.washWanderHzX) * TUNING.washWanderAmpX * w
      const wanderY =
        reduceMotion || mobile
          ? 0
          : Math.cos(washPhase * Math.PI * 2 * TUNING.washWanderHzY) * TUNING.washWanderAmpY * h
      const washX = w * (dark ? 0.58 : 0.62) + eased.x + wanderX
      const washY = h * (dark ? 0.42 : 0.36) + eased.y + wanderY
      const washR = Math.max(w, h) * 0.58
      const breath = reduceMotion
        ? 0
        : Math.sin(washPhase * Math.PI * 2 * TUNING.washBreathHz) * TUNING.washBreathAmp
      const washAlpha = (dark ? 0.11 : 0.085) + breath + scrollP * 0.025
      const wash = ctx.createRadialGradient(washX, washY, 0, washX, washY, washR)
      wash.addColorStop(0, hexAlpha(palette.primary, washAlpha))
      wash.addColorStop(0.42, hexAlpha(palette.primary, washAlpha * 0.32))
      wash.addColorStop(1, hexAlpha(palette.primary, 0))
      ctx.fillStyle = wash
      ctx.fillRect(0, 0, w, h)

      // --- 2) Living grain (drift + torch boost near pointer) ---
      ctx.lineCap = 'round'
      const minDim = Math.min(w, h)
      const torchR = minDim * TUNING.torchRadius
      const mx = mouse.px * w
      const my = mouse.py * h
      for (const g of grains) {
        const gy = ((g.y + grainShift) % 1 + 1) % 1
        const x = g.x * w
        const y = gy * h
        const len = g.len * minDim
        let alpha = g.a * (dark ? 0.75 : 1)
        if (!reduceMotion) {
          const dx = x - mx
          const dy = y - my
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < torchR) {
            alpha *= 1 + TUNING.torchBoost * (1 - d / torchR)
          }
          // micro shimmer — phase offset, not sparkle rain
          alpha *= 0.92 + 0.08 * Math.sin(washPhase * 1.7 + g.phase)
        }
        ctx.strokeStyle = hexAlpha(palette.ink, Math.min(0.2, alpha))
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x + Math.cos(g.ang) * len, y + Math.sin(g.ang) * len)
        ctx.stroke()
      }

      // --- 3) Margin rules grow with scroll (progress ink) ---
      const leftX = w * 0.11
      const rightX = w * 0.89
      const ruleTop = h * 0.14
      const ruleBottom = h * 0.88
      const grow = 0.18 + scrollP * 0.82 // always a stub, then fills
      const leftEnd = ruleTop + (ruleBottom - ruleTop) * grow
      const rightEnd = ruleTop + (ruleBottom - ruleTop) * Math.min(1, grow * 0.92 + 0.05)

      ctx.strokeStyle = hexAlpha(palette.muted, dark ? 0.16 : 0.13)
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(leftX, ruleTop)
      ctx.lineTo(leftX, leftEnd)
      ctx.moveTo(rightX, ruleTop + h * 0.04)
      ctx.lineTo(rightX, rightEnd)
      ctx.stroke()

      // scroll head — small primary tick at growing tip (useful: "where you are")
      if (scrollP > 0.02) {
        const tipY = leftEnd
        ctx.strokeStyle = hexAlpha(palette.primary, 0.45 + scrollP * 0.25)
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(leftX - 4, tipY)
        ctx.lineTo(leftX + 4, tipY)
        ctx.stroke()
      }

      // --- 4) Hero proof mark (load-in), stays as soft anchor ---
      {
        const hx = w * 0.56 + eased.x * 0.25
        const hy = h * 0.48 + eased.y * 0.25
        const m = heroMark
        if (m > 0.02) {
          ctx.strokeStyle = hexAlpha(palette.primary, 0.42 * m)
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.moveTo(hx, hy)
          ctx.lineTo(hx + 48 * m, hy + 2 * m)
          ctx.stroke()
          if (m > 0.2) {
            const c = Math.min(1, (m - 0.2) / 0.35)
            const s = 5 * c
            ctx.strokeStyle = hexAlpha(palette.primary, 0.35 * c)
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(hx - s, hy)
            ctx.lineTo(hx + s, hy)
            ctx.moveTo(hx, hy - s)
            ctx.lineTo(hx, hy + s)
            ctx.stroke()
          }
        }
      }

      // --- 5) Section glyphs on the margin (diversity via scroll) ---
      for (let i = 0; i < SECTIONS.length; i++) {
        const sec = SECTIONS[i]
        const amt = sectionAmt[i]
        if (amt < 0.03) continue
        const x = (sec.side === 'left' ? leftX : rightX) + (sec.side === 'left' ? -14 : 14)
        // Mix authored yNorm with live section presence for slight organic shift
        const y = h * (sec.yNorm * 0.55 + 0.2 + scrollP * 0.15)
        drawGlyph(sec.kind, x, y, amt, 7)
      }
    }

    const sampleTargets = () => {
      scrollTarget = readScrollProgress()
      for (let i = 0; i < SECTIONS.length; i++) {
        sectionTarget[i] = sectionPresence(SECTIONS[i].id)
      }
    }

    const paint = (now: number) => {
      if (disposed) return
      const dt = Math.min((now - lastT) / 1000, 0.1)
      lastT = now
      if (startMs === null) startMs = now
      const elapsed = (now - startMs) / 1000

      sampleTargets()

      if (reduceMotion) {
        heroMark = 1
        scrollP = scrollTarget
        for (let i = 0; i < SECTIONS.length; i++) sectionAmt[i] = sectionTarget[i] > 0.35 ? 1 : 0
        grainShift = 0
      } else {
        heroMark = damp(
          heroMark,
          Math.min(1, elapsed / TUNING.heroMarkSeconds),
          TUNING.dampLambda,
          dt,
        )
        washPhase += dt
        if (!mobile) grainShift = (grainShift + TUNING.grainDriftPerSec * dt) % 1
        scrollP = damp(scrollP, scrollTarget, TUNING.scrollDamp, dt)
        for (let i = 0; i < SECTIONS.length; i++) {
          sectionAmt[i] = damp(sectionAmt[i], sectionTarget[i], TUNING.sectionDamp, dt)
        }
      }

      eased.x = damp(eased.x, mouse.x * TUNING.parallaxPx, TUNING.parallaxLambda, dt)
      eased.y = damp(eased.y, mouse.y * TUNING.parallaxPx, TUNING.parallaxLambda, dt)

      drawFrame()
    }

    const animate = () => {
      if (!running || disposed) return
      animId = requestAnimationFrame(animate)
      paint(performance.now())
    }

    const startLoop = () => {
      if (running || disposed) return
      if (reduceMotion) {
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
      const width = Math.max(1, rect.width)
      const height = Math.max(1, rect.height)
      mouse.px = (e.clientX - rect.left) / width
      mouse.py = (e.clientY - rect.top) / height
      mouse.x = Math.max(-1, Math.min(1, mouse.px * 2 - 1))
      mouse.y = Math.max(-1, Math.min(1, mouse.py * 2 - 1))
    }

    const onScroll = () => {
      // Targets sampled in paint; ensure loop runs while scrolling even if
      // wash would otherwise look "idle".
      if (!running && isInView && !document.hidden && !reduceMotion) startLoop()
      if (reduceMotion && isInView) paint(performance.now())
    }

    const onVisibility = () => {
      if (document.hidden) stopLoop()
      else if (isInView) startLoop()
    }

    resize()
    sampleTargets()

    const ro = new ResizeObserver(() => {
      resize()
      if (!running) paint(performance.now())
    })
    ro.observe(wrap)

    window.addEventListener('pointermove', onPointer, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
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
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('scroll', onScroll)
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
        transition: 'opacity 0.85s ease-out',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '100%' }}
      />
    </div>
  )
}
