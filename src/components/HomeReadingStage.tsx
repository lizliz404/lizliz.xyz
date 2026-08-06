'use client'

/**
 * HomeReadingStage V4 — 「校样追光 / Reading Stage」
 *
 * Round 4 draft (anti-mediocrity). NOT a variant of V1/V2/V3 paper-margin family.
 *
 * Thesis: the ambient layer is a reading spotlight — brighten the active
 * section, softly veil the rest. Life comes from where you read, not from
 * sine-wave "aliveness" or craft metaphors (garden / margin / grain).
 *
 * Domain character (from Track A "Boundary Haze", subdued):
 *   projects → agent bias (spotlight slightly left)
 *   writing  → language bias (slightly right)
 *   connect  → market bias (slightly lower)
 *   top/skills → balanced
 * No second hue: still single accent ticks only; veil uses --fg.
 *
 * Forbidden (mediocrity genes): paper grain, wash orb, margin growth,
 * section glyphs, pointer torch, sin breath / Lissajous idle.
 *
 * Stack: Canvas 2D. No three.js. Shell contract unchanged.
 */

import { useEffect, useRef, useState } from 'react'

interface HomeReadingStageProps {
  className?: string
}

const SECTIONS = [
  { id: 'top', domain: 'balance' as const },
  { id: 'projects', domain: 'agent' as const },
  { id: 'skills', domain: 'balance' as const },
  { id: 'writing', domain: 'language' as const },
  { id: 'connect', domain: 'market' as const },
]

const TUNING = {
  maxPixelRatio: 1.5,
  mobileMaxPixelRatio: 1.25,
  /** Veil darkness — keep shallow so type stays king. */
  veilAlphaLight: 0.055,
  veilAlphaDark: 0.09,
  /** Spotlight pad around section rect (px). */
  padX: 18,
  padY: 22,
  feather: 72,
  /** Scroll-velocity briefly widens feather (print shake). */
  velocityWiden: 40,
  velocityRef: 1800, // px/s → full widen
  dampRect: 7,
  dampFeather: 6,
  /** Corner crop ticks — subordinate wayfinding, not decoration stack. */
  tickSize: 7,
  tickAlpha: 0.35,
} as const

type Rect = { x: number; y: number; w: number; h: number }

function resolveDark(): boolean {
  const explicit = document.documentElement.dataset.theme
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return explicit ? explicit === 'dark' : prefersDark
}

function damp(current: number, target: number, lambda: number, dt: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt))
}

function dampRect(r: Rect, t: Rect, lambda: number, dt: number): Rect {
  return {
    x: damp(r.x, t.x, lambda, dt),
    y: damp(r.y, t.y, lambda, dt),
    w: damp(r.w, t.w, lambda, dt),
    h: damp(r.h, t.h, lambda, dt),
  }
}

function readAccent(): string {
  const v = getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim()
  return v || '#b14e22'
}

function readFg(): string {
  const v = getComputedStyle(document.documentElement).getPropertyValue('--fg').trim()
  return v || '#141413'
}

function hexAlpha(hex: string, alpha: number): string {
  const raw = hex.trim()
  if (raw.startsWith('rgb')) return raw
  let h = raw.replace('#', '')
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  if (h.length !== 6) return `rgba(20,20,19,${alpha})`
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${Math.max(0, Math.min(1, alpha))})`
}

function domainBias(domain: (typeof SECTIONS)[number]['domain']): { dx: number; dy: number } {
  switch (domain) {
    case 'agent':
      return { dx: -0.04, dy: 0 }
    case 'language':
      return { dx: 0.04, dy: 0 }
    case 'market':
      return { dx: 0, dy: 0.05 }
    default:
      return { dx: 0, dy: 0 }
  }
}

function sectionScore(id: string): { score: number; rect: DOMRect | null } {
  const node = document.getElementById(id)
  if (!node) return { score: 0, rect: null }
  const rect = node.getBoundingClientRect()
  const vh = window.innerHeight || 1
  const visible = Math.min(rect.bottom, vh) - Math.max(rect.top, 0)
  if (visible <= 0) return { score: 0, rect }
  const visibility = visible / Math.min(rect.height, vh)
  // Prefer sections whose top sits near the upper reading band.
  const band = 1 - Math.min(1, Math.abs(rect.top - vh * 0.2) / (vh * 0.7))
  return { score: visibility * 0.65 + band * 0.35, rect }
}

function isMobile(): boolean {
  return (
    window.matchMedia('(max-width: 720px)').matches ||
    window.matchMedia('(pointer: coarse)').matches
  )
}

export default function HomeReadingStage({ className }: HomeReadingStageProps) {
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
    let lastT = performance.now()
    let lastScrollY = window.scrollY
    let scrollVel = 0
    let feather = TUNING.feather
    let activeDomain: (typeof SECTIONS)[number]['domain'] = 'balance'

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = isMobile()
    const dark = paletteKey === 'dark'
    const fg = readFg()
    const accent = readAccent()
    const veilAlpha = dark ? TUNING.veilAlphaDark : TUNING.veilAlphaLight

    const vw = () => wrap.clientWidth || window.innerWidth
    const vh = () => wrap.clientHeight || window.innerHeight

    let spot: Rect = {
      x: vw() * 0.15,
      y: vh() * 0.2,
      w: vw() * 0.7,
      h: vh() * 0.35,
    }

    const pickTarget = (): { rect: Rect; domain: (typeof SECTIONS)[number]['domain'] } => {
      let best = 0
      let bestId = SECTIONS[0]
      let bestDom: DOMRect | null = null
      for (const sec of SECTIONS) {
        const { score, rect } = sectionScore(sec.id)
        if (score > best && rect) {
          best = score
          bestId = sec
          bestDom = rect
        }
      }
      const wrapRect = wrap.getBoundingClientRect()
      if (!bestDom) {
        return {
          rect: { x: vw() * 0.12, y: vh() * 0.18, w: vw() * 0.76, h: vh() * 0.4 },
          domain: 'balance',
        }
      }
      const bias = domainBias(bestId.domain)
      const padX = TUNING.padX + Math.abs(bias.dx) * 40
      const padY = TUNING.padY + Math.abs(bias.dy) * 40
      let x = bestDom.left - wrapRect.left - padX + bias.dx * bestDom.width
      let y = bestDom.top - wrapRect.top - padY + bias.dy * bestDom.height
      let w = bestDom.width + padX * 2
      let h = bestDom.height + padY * 2
      // Clamp into viewport shell
      x = Math.max(-40, Math.min(x, vw() - 40))
      y = Math.max(-40, Math.min(y, vh() - 40))
      w = Math.min(w, vw() + 80)
      h = Math.min(h, vh() + 80)
      return { rect: { x, y, w, h }, domain: bestId.domain }
    }

    const resize = () => {
      if (disposed) return
      const w = vw()
      const h = vh()
      const pr = Math.min(
        window.devicePixelRatio || 1,
        mobile ? TUNING.mobileMaxPixelRatio : TUNING.maxPixelRatio,
      )
      canvas.width = Math.max(1, Math.floor(w * pr))
      canvas.height = Math.max(1, Math.floor(h * pr))
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(pr, 0, 0, pr, 0, 0)
    }

    const drawTicks = (r: Rect, alpha: number) => {
      if (alpha < 0.05) return
      const s = TUNING.tickSize
      ctx.strokeStyle = hexAlpha(accent, TUNING.tickAlpha * alpha)
      ctx.lineWidth = 1.25
      ctx.lineCap = 'butt'
      const corners: Array<[number, number, number, number, number, number]> = [
        // x,y, dx1,dy1, dx2,dy2 for two segments of an L
        [r.x, r.y, s, 0, 0, s],
        [r.x + r.w, r.y, -s, 0, 0, s],
        [r.x, r.y + r.h, s, 0, 0, -s],
        [r.x + r.w, r.y + r.h, -s, 0, 0, -s],
      ]
      for (const [x, y, dx1, dy1, dx2, dy2] of corners) {
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x + dx1, y + dy1)
        ctx.moveTo(x, y)
        ctx.lineTo(x + dx2, y + dy2)
        ctx.stroke()
      }
    }

    const drawFrame = () => {
      const w = vw()
      const h = vh()
      ctx.clearRect(0, 0, w, h)

      // 1) Full-viewport veil (ink at low alpha)
      ctx.fillStyle = hexAlpha(fg, veilAlpha)
      ctx.fillRect(0, 0, w, h)

      // 2) Soft punch-out: radial destination-out centered on spotlight
      const cx = spot.x + spot.w / 2
      const cy = spot.y + spot.h / 2
      const rx = spot.w * 0.55 + feather
      const ry = spot.h * 0.55 + feather
      const g = ctx.createRadialGradient(cx, cy, Math.max(8, Math.min(rx, ry) * 0.25), cx, cy, Math.max(rx, ry))
      g.addColorStop(0, 'rgba(0,0,0,1)')
      g.addColorStop(0.55, 'rgba(0,0,0,0.55)')
      g.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
      ctx.fill()
      // Also clear a softer axis-aligned core so long sections read as a stage
      ctx.fillStyle = 'rgba(0,0,0,0.7)'
      const corePad = feather * 0.35
      roundRect(
        ctx,
        spot.x - corePad * 0.25,
        spot.y - corePad * 0.25,
        spot.w + corePad * 0.5,
        spot.h + corePad * 0.5,
        18,
      )
      ctx.fill()
      ctx.globalCompositeOperation = 'source-over'

      // 3) Subordinate crop ticks on the stage edge (wayfinding, not grain theater)
      drawTicks(spot, 1)
    }

    const paint = (now: number) => {
      if (disposed) return
      const dt = Math.min((now - lastT) / 1000, 0.1)
      lastT = now

      const sy = window.scrollY
      const instVel = Math.abs(sy - lastScrollY) / Math.max(dt, 1 / 120)
      lastScrollY = sy
      scrollVel = damp(scrollVel, instVel, 8, dt)

      const { rect: target, domain } = pickTarget()
      activeDomain = domain

      if (reduceMotion) {
        spot = target
        feather = TUNING.feather * (mobile ? 0.75 : 1)
      } else {
        spot = dampRect(spot, target, TUNING.dampRect, dt)
        const widen = mobile
          ? 0
          : TUNING.velocityWiden * Math.min(1, scrollVel / TUNING.velocityRef)
        const featherTarget = (TUNING.feather + widen) * (mobile ? 0.8 : 1)
        feather = damp(feather, featherTarget, TUNING.dampFeather, dt)
      }

      drawFrame()
      void activeDomain // reserved for future domain-only debug; bias already in pickTarget
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

    const onScroll = () => {
      if (!running && isInView && !document.hidden && !reduceMotion) startLoop()
      if (reduceMotion && isInView) paint(performance.now())
    }

    const onVisibility = () => {
      if (document.hidden) stopLoop()
      else if (isInView) startLoop()
    }

    resize()
    const ro = new ResizeObserver(() => {
      resize()
      if (!running) paint(performance.now())
    })
    ro.observe(wrap)

    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)

    // Also observe sections so spotlight retargets without waiting for scroll sample gaps
    const sectionIo = new IntersectionObserver(
      () => {
        if (reduceMotion && isInView) paint(performance.now())
      },
      { threshold: [0, 0.2, 0.5, 0.8] },
    )
    for (const sec of SECTIONS) {
      const el = document.getElementById(sec.id)
      if (el) sectionIo.observe(el)
    }

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
      sectionIo.disconnect()
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
        transition: 'opacity 0.7s ease-out',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '100%' }}
      />
    </div>
  )
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const rr = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + rr, y)
  ctx.arcTo(x + w, y, x + w, y + h, rr)
  ctx.arcTo(x + w, y + h, x, y + h, rr)
  ctx.arcTo(x, y + h, x, y, rr)
  ctx.arcTo(x, y, x + w, y, rr)
  ctx.closePath()
}
