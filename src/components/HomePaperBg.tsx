'use client'

/**
 * Quiet full-page cream paper. Live PaperTexture when motion is allowed;
 * returns null so the CSS veil in HomeContent stays for reduced-motion.
 */

import { PaperTexture } from '@paper-design/shaders-react'
import { useEffect, useState } from 'react'

interface HomePaperBgProps {
  className?: string
}

function resolveDark(): boolean {
  const explicit = document.documentElement.dataset.theme
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return explicit ? explicit === 'dark' : prefersDark
}

export default function HomePaperBg({ className }: HomePaperBgProps) {
  const [reduceMotion, setReduceMotion] = useState(true)
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncMotion = () => setReduceMotion(motionMq.matches)
    syncMotion()
    motionMq.addEventListener('change', syncMotion)

    const syncDark = () => setDark(resolveDark())
    syncDark()
    const mo = new MutationObserver(syncDark)
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
    const darkMq = window.matchMedia('(prefers-color-scheme: dark)')
    darkMq.addEventListener('change', syncDark)

    return () => {
      motionMq.removeEventListener('change', syncMotion)
      mo.disconnect()
      darkMq.removeEventListener('change', syncDark)
    }
  }, [])

  if (reduceMotion) return null

  return (
    <PaperTexture
      className={className ? `home-paper-shader ${className}` : 'home-paper-shader'}
      colorBack={dark ? '#2a2620' : '#fff8ee'}
      colorFront={dark ? '#8a8174' : '#b9a48a'}
      contrast={0.26}
      roughness={0.42}
      fiber={0.44}
      fiberSize={0.18}
      crumples={0.12}
      crumpleSize={0.32}
      folds={0.08}
      foldCount={2}
      drops={0.06}
      fade={0.18}
      seed={5.8}
      scale={0.65}
      fit="cover"
      speed={0.12}
      minPixelRatio={1}
      maxPixelCount={1920 * 1080}
      style={{ width: '100%', height: '100%' }}
    />
  )
}
