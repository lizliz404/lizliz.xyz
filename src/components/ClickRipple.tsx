"use client";

import { useEffect, useState, useCallback, useRef, type CSSProperties } from "react";

interface Ripple {
  id: number;
  x: number;
  y: number;
  rotation: number;
}

const NOISE =
  "data:image/png;base64,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";

export default function InkRipple() {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [hold, setHold] = useState<{ x: number; y: number } | null>(null);
  const holdRef = useRef<{ x: number; y: number } | null>(null);
  const isTouchRef = useRef(false);
  const didReleaseRef = useRef(false);
  const rippleCount = useRef(0);

  const createRipple = useCallback((x: number, y: number) => {
    const id = rippleCount.current++;
    const rotation = Math.floor(Math.random() * 360);
    setRipples((prev) => [...prev, { id, x, y, rotation }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 550);
  }, []);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (isTouchRef.current) return;
      const pos = { x: e.clientX, y: e.clientY };
      holdRef.current = pos;
      setHold(pos);
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (holdRef.current) {
        createRipple(e.clientX, e.clientY);
        didReleaseRef.current = true;
        holdRef.current = null;
        setHold(null);
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (isTouchRef.current) return;
      if (didReleaseRef.current) {
        didReleaseRef.current = false;
        return;
      }
      createRipple(e.clientX, e.clientY);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      isTouchRef.current = true;
      const touch = e.changedTouches[0];
      createRipple(touch.clientX, touch.clientY);
      setTimeout(() => {
        isTouchRef.current = false;
      }, 400);
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("click", handleClick);
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [createRipple]);

  return (
    <>
      <style>{`
        @keyframes inkSpread {
          0%   { transform: translate(-50%, -50%) scale(0.3) rotate(var(--rot)); }
          100% { transform: translate(-50%, -50%) scale(1)   rotate(var(--rot)); }
        }
        @keyframes inkFade {
          0%   { opacity: 1; }
          60%  { opacity: 0.3; }
          100% { opacity: 0; }
        }
      `}</style>

      <div
        className="fixed inset-0 pointer-events-none overflow-hidden z-50"
        aria-hidden="true"
      >
        {/* Hold indicator — tiny dot while mouse is pressed */}
        {hold && (
          <div
            className="absolute rounded-full"
            style={{
              left: hold.x,
              top: hold.y,
              width: "8px",
              height: "8px",
              transform: "translate(-50%, -50%)",
              background: "rgba(199, 111, 58, 0.25)",
              mixBlendMode: "multiply",
            }}
          />
        )}

        {/* Release ripples */}
        {ripples.map((ripple) => (
          <div
            key={ripple.id}
            className="absolute"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: "60px",
              height: "60px",
              ["--rot" as string]: `${ripple.rotation}deg`,
              // Pigment core + solvent halo via box-shadow
              background:
                "radial-gradient(circle at center, rgba(199,111,58,0.7) 0%, rgba(199,111,58,0.4) 30%, transparent 65%)",
              boxShadow:
                "0 0 18px 6px rgba(199,111,58,0.06), 0 0 36px 14px rgba(199,111,58,0.03)",
              borderRadius: "45% 55% 40% 60% / 55% 45% 60% 40%",
              // Multiply: ink-on-paper color mixing
              mixBlendMode: "multiply",
              // Noise mask: irregular edges mimic paper fiber
              maskImage: `url("${NOISE}")`,
              maskSize: "20px 20px",
              maskRepeat: "repeat",
              WebkitMaskImage: `url("${NOISE}")`,
              WebkitMaskSize: "20px 20px",
              WebkitMaskRepeat: "repeat",
              // Asymmetric timing: fast spread (150ms), slow fade (500ms)
              animation:
                "inkSpread 150ms cubic-bezier(0.1, 0.9, 0.2, 1) forwards," +
                "inkFade 500ms ease-out forwards",
            } as CSSProperties}
          />
        ))}
      </div>
    </>
  );
}
