import { createEffect, createSignal, Show } from 'solid-js';
import { ShaderMount, meshGradientFragmentShader, getShaderColorFromString, ShaderFitOptions } from '@paper-design/shaders';

const INK = ['#fffdf8', '#faf9f5', '#e8d4c4', '#b14e22', '#141413'];
const INK_DARK = ['#1c1a16', '#2a2620', '#4a382e', '#b14e22', '#fff8ee'];

const BASE_SPEED = 0.36;
const BASE_SWIRL = 0.42;
const BASE_DISTORTION = 0.58;
const LERP = 0.08;
const BOOST_DECAY = 0.045;
const PTR_OFFSET_AMP = 0.1;
const BOOST_OFFSET_AMP = 0.06;
const KNOB_EPS = 1e-4;

function resolveDark(): boolean {
  const explicit = document.documentElement.dataset.theme;
  return explicit ? explicit === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function PaperMesh() {
  const [reduceMotion, setReduceMotion] = createSignal(false);
  const [hidden, setHidden] = createSignal(false);
  const [dark, setDark] = createSignal(false);
  const [offset, setOffset] = createSignal({ x: 0, y: 0 });

  const targetPtr = { x: 0.5, y: 0.5 };
  const currentPtr = { x: 0.5, y: 0.5 };
  let targetBoost = 0;
  let currentBoost = 0;
  let mount: ShaderMount | undefined;

  createEffect(() => true, () => {
    const syncVisibility = () => {
      const isHidden = document.visibilityState === 'hidden';
      setHidden(isHidden);
      document.documentElement.toggleAttribute('data-page-hidden', isHidden);
    };
    syncVisibility();
    document.addEventListener('visibilitychange', syncVisibility);
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => setReduceMotion(motionMq.matches);
    syncMotion();
    motionMq.addEventListener('change', syncMotion);
    const syncDark = () => setDark(resolveDark());
    syncDark();
    const mo = new MutationObserver(syncDark);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    const darkMq = window.matchMedia('(prefers-color-scheme: dark)');
    darkMq.addEventListener('change', syncDark);
    return () => {
      document.removeEventListener('visibilitychange', syncVisibility);
      motionMq.removeEventListener('change', syncMotion);
      mo.disconnect();
      darkMq.removeEventListener('change', syncDark);
      document.documentElement.removeAttribute('data-page-hidden');
    };
  });

  createEffect(() => reduceMotion(), reduced => {
    if (reduced) return;
    let rafId = 0;
    const onMove = (event: PointerEvent) => {
      targetPtr.x = event.clientX / Math.max(window.innerWidth, 1);
      targetPtr.y = event.clientY / Math.max(window.innerHeight, 1);
      startTick();
    };
    const onClick = () => { targetBoost = 1; startTick(); };
    const tick = () => {
      if (document.hidden) { rafId = 0; return; }
      currentPtr.x += (targetPtr.x - currentPtr.x) * LERP;
      currentPtr.y += (targetPtr.y - currentPtr.y) * LERP;
      targetBoost *= 1 - BOOST_DECAY;
      if (targetBoost < KNOB_EPS) targetBoost = 0;
      currentBoost += (targetBoost - currentBoost) * LERP;
      if (currentBoost < KNOB_EPS && targetBoost === 0) currentBoost = 0;
      setOffset({ x: (currentPtr.x - 0.5) * PTR_OFFSET_AMP + currentBoost * BOOST_OFFSET_AMP, y: (currentPtr.y - 0.5) * PTR_OFFSET_AMP + currentBoost * BOOST_OFFSET_AMP });
      const settled = Math.abs(currentPtr.x - targetPtr.x) < KNOB_EPS && Math.abs(currentPtr.y - targetPtr.y) < KNOB_EPS && targetBoost === 0 && currentBoost === 0;
      if (settled) { rafId = 0; return; }
      rafId = requestAnimationFrame(tick);
    };
    const startTick = () => { if (!rafId) rafId = requestAnimationFrame(tick); };
    const onVisibility = () => { if (document.hidden) { cancelAnimationFrame(rafId); rafId = 0; return; } startTick(); };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('click', onClick);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('click', onClick);
      document.removeEventListener('visibilitychange', onVisibility);
      cancelAnimationFrame(rafId);
      rafId = 0;
    };
  });

  let element: HTMLDivElement | undefined;
  createEffect(() => reduceMotion(), reduced => {
    if (reduced || !element) return;
    let m: ShaderMount;
    try {
      m = new ShaderMount(element, meshGradientFragmentShader, {
      u_colors: (dark() ? INK_DARK : INK).map(getShaderColorFromString),
      u_colorsCount: INK.length,
      u_distortion: BASE_DISTORTION,
      u_swirl: BASE_SWIRL,
      u_grainMixer: 0.12,
      u_grainOverlay: 0.06,
      u_fit: ShaderFitOptions.contain,
      u_rotation: 0,
      u_scale: 1,
      u_offsetX: offset().x,
      u_offsetY: offset().y,
      u_originX: 0.5,
      u_originY: 0.5,
      u_worldWidth: 0,
      u_worldHeight: 0,
      }, undefined, hidden() ? 0 : BASE_SPEED);
    } catch {
      element.hidden = true;
      return;
    }
    mount = m;
    return () => { m.dispose(); mount = undefined; };
  });

  createEffect(() => ({ off: offset(), dark: dark(), hidden: hidden() }), state => {
    mount?.setUniforms({ u_offsetX: state.off.x, u_offsetY: state.off.y, u_colors: (state.dark ? INK_DARK : INK).map(getShaderColorFromString) });
    mount?.setSpeed(state.hidden ? 0 : BASE_SPEED);
  });

  return <Show when={!reduceMotion()}><div class="paper-shader" ref={element}/></Show>;
}
