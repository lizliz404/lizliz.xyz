'use client'

/**
 * HomeV5 — 「读场 / Reading Field」
 *
 * Thesis (plain language): sparse ink field-lines quietly lean toward
 * whatever section you're reading. Stay on the page and the field slowly
 * "sets" (V1-style irreversible session progress — not a sine breath).
 * Leave a section and one soft impress fades out (short memory).
 *
 * Escapes V1–V4 mediocrity genes: no garden, no grain/wash/margin glyphs,
 * no torch, no full-page veil spotlight, no sin idle life-support.
 *
 * Stack: Canvas 2D only. Engineering red lines preserved.
 */

import { useEffect, useRef, useState } from 'react'

interface HomeV5Props {
  className?: string
}

const SECTION_IDS = ['top', 'projects', 'skills', 'writing', 'connect'] as const

const TUNING = {
  maxPixelRatio: 1.5,
  mobileMaxPixelRatio: 1.25,
  lineCountDesktop: 24,
  lineCountMobile: 14,
  samples: 28,
  /** Rest wave amplitude as fraction of width. */
  restAmp: 0.018,
  /** Pull toward reading attractor (scales with session progress). */
  pullBase: 0.12,
  pullProgressGain: 0.22,
  pullFalloff: 280,
  dampPoints: 6,
  dampAttractor: 7,
  /** Session progress: irreversible floor while present (V1 idleFloor idea). */
  idleProgressPerSec: 0.008,
  scrollProgressBoost: 0.04,
  progressMax: 0.72,
  progressDamp: 3.2,
  /** Leave-section impress. */
  impressLife: 2.8,
  impressMax: 2,
  lineAlpha: 0.07,
  accentAlpha: 0.2,
  impressAlpha: 0.28,
} as const

type Pt = { x: number; y: number }
type Line = {
  phase: number
  turns: number
  weight: number // 0..1 → muted vs accent proximity bias
  rest: Pt[]
  cur: Pt[]
}

function resolveDark(): boolean {
  const explicit = document.documentElement.dataset.theme
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return explicit ? explicit === 'dark' : prefersDark
}

function damp(current: number, target: number, lambda: number, dt: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt))
}

function readCss(name: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return v || fallback
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

function mulberry32(seed: number) {
  let t = seed >>> 0
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

function sectionPresence(id: string): { score: number; cx: number; cy: number; w: number; h: number } {
  const node = document.getElementById(id)
  if (!node) return { score: 0, cx: 0, cy: 0, w: 0, h: 0 }
  const rect = node.getBoundingClientRect()
  const vh = window.innerHeight || 1
  const visible = Math.min(rect.bottom, vh) - Math.max(rect.top, 0)
  if (visible <= 0) return { score: 0, cx: 0, cy: 0, w: 0, h: 0 }
  const visibility = visible / Math.min(rect.height, vh)
  const band = 1 - Math.min(1, Math.abs(rect.top - vh * 0.22) / (vh * 0.75))
  return {
    score: visibility * 0.62 + band * 0.38,
    cx: rect.left + rect.width / 2,
    cy: rect.top + rect.height / 2,
    w: rect.width,
    h: rect.height,
  }
}

function isMobile() {
  return (
    window.matchMedia('(max-width: 720px)').matches ||
    window.matchMedia('(pointer: coarse)').matches
  )
}

export default function HomeV5({ className }: HomeV5Props) {
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
    let progress = 0
    let progressTarget = 0
    let activeId: string = 'top'
    let attractor = { x: 0, y: 0 }
    let attractorTarget = { x: 0, y: 0 }
    const impress: Array<{ x: number; y: number; age: number; side: number }> = []

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = isMobile()
    const dark = paletteKey === 'dark'
    const fg = readCss('--fg', dark ? '#e8e4dd' : '#141413')
    const accent = readCss('--color-accent', '#b14e22')
    const rand = mulberry32(dark ? 0xc0ffee01 : 0x51c07e11)
    const lineCount = mobile ? TUNING.lineCountMobile : TUNING.lineCountDesktop
    const samples = mobile ? 20 : TUNING.samples

    const vw = () => wrap.clientWidth || window.innerWidth
    const vh = () => wrap.clientHeight || window.innerHeight

    const buildLines = (): Line[] => {
      const w = vw()
      const h = vh()
      const lines: Line[] = []
      for (let i = 0; i < lineCount; i++) {
        const t = (i + 0.5) / lineCount
        const phase = rand() * Math.PI * 2
        const turns = 0.6 + rand() * 1.1
        const weight = rand()
        const rest: Pt[] = []
        const cur: Pt[] = []
        const baseX = w * (0.06 + t * 0.88)
        for (let s = 0; s < samples; s++) {
          const u = s / (samples - 1)
          const y = h * (0.06 + u * 0.88)
          const x =
            baseX +
            Math.sin(u * Math.PI * 2 * turns + phase) * w * TUNING.restAmp * (0.6 + weight)
          rest.push({ x, y })
          cur.push({ x, y })
        }
        lines.push({ phase, turns, weight, rest, cur })
      }
      return lines
    }

    let lines = buildLines()

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
      lines = buildLines()
    }

    const pickAttractor = () => {
      let best = 0
      let bestId: string = activeId
      let cx = vw() / 2
      let cy = vh() * 0.35
      for (const id of SECTION_IDS) {
        const p = sectionPresence(id)
        if (p.score > best) {
          best = p.score
          bestId = id
          const wrapRect = wrap.getBoundingClientRect()
          cx = p.cx - wrapRect.left
          cy = p.cy - wrapRect.top
        }
      }
      if (bestId !== activeId && best > 0.2) {
        // Leaving previous section → one impress (session memory, then fade).
        const wrapRect = wrap.getBoundingClientRect()
        const prev = sectionPresence(activeId)
        if (prev.score >= 0 || prev.w > 0) {
          // Place impress near previous section edge in shell coords if possible
          const px = prev.w
            ? prev.cx - wrapRect.left + (rand() > 0.5 ? prev.w * 0.42 : -prev.w * 0.42)
            : attractor.x
          const py = prev.h ? prev.cy - wrapRect.top : attractor.y
          impress.push({ x: px, y: py, age: 0, side: rand() > 0.5 ? 1 : -1 })
          while (impress.length > TUNING.impressMax) impress.shift()
        }
        activeId = bestId
      }
      attractorTarget.x = cx
      attractorTarget.y = cy
    }

    const drawFrame = () => {
      const w = vw()
      const h = vh()
      ctx.clearRect(0, 0, w, h)

      // Field lines
      for (const line of lines) {
        const near =
          Math.hypot(line.cur[Math.floor(samples / 2)].x - attractor.x, line.cur[Math.floor(samples / 2)].y - attractor.y) <
          Math.min(w, h) * 0.28
        const useAccent = near && line.weight > 0.55
        const a = (useAccent ? TUNING.accentAlpha : TUNING.lineAlpha) * (0.55 + progress * 0.7)
        ctx.strokeStyle = hexAlpha(useAccent ? accent : fg, a * (dark ? 0.9 : 1))
        ctx.lineWidth = useAccent ? 1.35 : 1
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.beginPath()
        for (let s = 0; s < line.cur.length; s++) {
          const p = line.cur[s]
          if (s === 0) ctx.moveTo(p.x, p.y)
          else ctx.lineTo(p.x, p.y)
        }
        ctx.stroke()
      }

      // Impress marks (fade)
      for (const m of impress) {
        const t = Math.min(1, m.age / TUNING.impressLife)
        const fade = 1 - t
        if (fade <= 0.02) continue
        const len = 10 + 16 * fade
        ctx.strokeStyle = hexAlpha(accent, TUNING.impressAlpha * fade)
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(m.x, m.y - len * 0.15)
        ctx.lineTo(m.x + m.side * len, m.y + len * 0.05)
        ctx.stroke()
      }
    }

    const stepField = (dt: number) => {
      const pull =
        TUNING.pullBase + progress * TUNING.pullProgressGain
      for (const line of lines) {
        for (let s = 0; s < line.cur.length; s++) {
          const rest = line.rest[s]
          let tx = rest.x
          let ty = rest.y
          const dx = attractor.x - rest.x
          const dy = attractor.y - rest.y
          const dist = Math.hypot(dx, dy) + 1
          const fall = TUNING.pullFalloff
          const k = pull * (fall / (fall + dist))
          tx += dx * k
          ty += dy * k * 0.85
          line.cur[s].x = damp(line.cur[s].x, tx, TUNING.dampPoints, dt)
          line.cur[s].y = damp(line.cur[s].y, ty, TUNING.dampPoints, dt)
        }
      }
    }

    const paint = (now: number) => {
      if (disposed) return
      const dt = Math.min((now - lastT) / 1000, 0.1)
      lastT = now

      const sy = window.scrollY
      const scrolled = Math.abs(sy - lastScrollY) > 0.5
      if (scrolled) {
        progressTarget = Math.min(
          TUNING.progressMax,
          progressTarget + TUNING.scrollProgressBoost * Math.min(1, Math.abs(sy - lastScrollY) / 400),
        )
      }
      lastScrollY = sy

      pickAttractor()

      if (reduceMotion) {
        progress = progressTarget
        attractor.x = attractorTarget.x
        attractor.y = attractorTarget.y
        // Snap field once
        for (const line of lines) {
          for (let s = 0; s < line.cur.length; s++) {
            const rest = line.rest[s]
            const dx = attractor.x - rest.x
            const dy = attractor.y - rest.y
            const dist = Math.hypot(dx, dy) + 1
            const k =
              (TUNING.pullBase + progress * TUNING.pullProgressGain) *
              (TUNING.pullFalloff / (TUNING.pullFalloff + dist))
            line.cur[s].x = rest.x + dx * k
            line.cur[s].y = rest.y + dy * k * 0.85
          }
        }
        impress.length = 0
      } else {
        // V1-like idle floor: presence alone advances irreversible progress.
        progressTarget = Math.min(
          TUNING.progressMax,
          Math.max(progressTarget, progressTarget + TUNING.idleProgressPerSec * dt),
        )
        // Actually idle should raise a floor independent of scroll boosts:
        const idleFloor = Math.min(
          TUNING.progressMax * 0.55,
          (now / 1000) * TUNING.idleProgressPerSec * 0.35,
        )
        progressTarget = Math.max(progressTarget, idleFloor)
        progress = damp(progress, progressTarget, TUNING.progressDamp, dt)
        attractor.x = damp(attractor.x, attractorTarget.x, TUNING.dampAttractor, dt)
        attractor.y = damp(attractor.y, attractorTarget.y, TUNING.dampAttractor, dt)
        stepField(dt)
        for (let i = impress.length - 1; i >= 0; i--) {
          impress[i].age += dt
          if (impress[i].age >= TUNING.impressLife) impress.splice(i, 1)
        }
      }

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

    const onScroll = () => {
      if (!running && isInView && !document.hidden && !reduceMotion) startLoop()
      if (reduceMotion && isInView) paint(performance.now())
    }

    const onVisibility = () => {
      if (document.hidden) stopLoop()
      else if (isInView) startLoop()
    }

    resize()
    pickAttractor()
    attractor.x = attractorTarget.x
    attractor.y = attractorTarget.y

    const ro = new ResizeObserver(() => {
      resize()
      if (!running) paint(performance.now())
    })
    ro.observe(wrap)

    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)

    const sectionIo = new IntersectionObserver(
      () => {
        if (reduceMotion && isInView) paint(performance.now())
      },
      { threshold: [0, 0.25, 0.5, 0.75] },
    )
    for (const id of SECTION_IDS) {
      const el = document.getElementById(id)
      if (el) sectionIo.observe(el)
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        isInView = entry.isIntersecting
        if (isInView && !document.hidden) {
          setReady(true)
          startLoop()
        } else stopLoop()
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
        transition: 'opacity 0.75s ease-out',
      }}
    >
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  )
}
