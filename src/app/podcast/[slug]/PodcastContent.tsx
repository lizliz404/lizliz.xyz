"use client";

import { useState, useRef, useCallback, useEffect, type ReactNode } from "react";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────────────────────

interface Subtitle {
  start: number;
  end: number;
  speaker: string;
  text: string;
}

interface PodcastData {
  title: string;
  date: string;
  description?: string;
  duration: string;
  hosts: { name: string; role: string; gender: string }[];
  audioFile: string;
  subtitles?: Subtitle[];
}

// ── Helpers ────────────────────────────────────────────────────────────

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// ── Component ──────────────────────────────────────────────────────────

export default function PodcastContent({
  podcast,
  children,
}: {
  podcast: PodcastData;
  children: ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const subtitleContainerRef = useRef<HTMLDivElement>(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSubtitleIndex, setActiveSubtitleIndex] = useState(-1);
  const [showSubtitles, setShowSubtitles] = useState(true); // default ON

  const subtitles: Subtitle[] = podcast.subtitles ?? [];
  const hasSubtitles = subtitles.length > 0;

  // ── Audio event handlers ────────────────────────────────────────────

  const onTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(audio.currentTime);

    if (!hasSubtitles) return;
    const idx = subtitles.findIndex(
      (sub) => audio.currentTime >= sub.start && audio.currentTime < sub.end,
    );
    setActiveSubtitleIndex(idx);
  }, [hasSubtitles, subtitles]);

  const onLoadedMetadata = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setDuration(audio.duration);
  }, []);

  const onPlay = useCallback(() => setIsPlaying(true), []);
  const onPause = useCallback(() => setIsPlaying(false), []);

  // ── Controls ────────────────────────────────────────────────────────

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, []);

  const seekTo = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
  }, []);

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const ratio = (e.clientX - rect.left) / rect.width;
      seekTo(ratio * duration);
    },
    [duration, seekTo],
  );

  const skipBack = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, audio.currentTime - 15);
  }, []);

  const skipForward = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(duration, audio.currentTime + 15);
  }, [duration]);

  const handleSubtitleClick = useCallback(
    (start: number) => seekTo(start),
    [seekTo],
  );

  // Scroll active subtitle into view (only when playing)
  useEffect(() => {
    if (activeSubtitleIndex < 0 || !subtitleContainerRef.current) return;
    if (!isPlaying) return;
    const container = subtitleContainerRef.current;
    const activeEl = container.querySelector('[data-active="true"]');
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [activeSubtitleIndex, isPlaying]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        skipBack();
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        skipForward();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlay, skipBack, skipForward]);

  // ── Render ──────────────────────────────────────────────────────────

  const hostsStr = podcast.hosts.map((h) => `${h.role} ${h.name}`).join(" & ");

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 pt-20 pb-40">
      <article className="w-full max-w-lg md:max-w-[46rem] flex flex-col gap-8">
        {/* ── Header ───────────────────────────────────────────────── */}
        <header className="flex flex-col gap-4">
          <Link
            href="/"
            className="text-xs tracking-widest uppercase opacity-40 hover:opacity-100 transition-opacity"
            style={{ fontFamily: "var(--font-poppins)", color: "var(--fg-secondary)" }}
          >
            ← Home
          </Link>

          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1 rounded-full border px-3 py-0.5 text-xs font-medium"
              style={{ borderColor: "var(--color-accent)", color: "var(--color-accent)", fontFamily: "var(--font-poppins)" }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
              Podcast
            </span>
            <span className="text-xs" style={{ color: "var(--fg-secondary)", opacity: 0.4 }}>
              {podcast.duration}
            </span>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight" style={{ fontFamily: "var(--font-poppins)" }}>
            {podcast.title}
          </h1>

          <div className="flex flex-wrap items-baseline gap-3">
            <p className="text-xs" style={{ color: "var(--fg-secondary)", opacity: 0.5 }}>{podcast.date}</p>
            <p className="text-xs" style={{ color: "var(--fg-secondary)", opacity: 0.5 }}>{hostsStr}</p>
          </div>

          {podcast.description && (
            <p className="text-sm leading-relaxed" style={{ color: "var(--fg-secondary)", opacity: 0.6 }}>
              {podcast.description}
            </p>
          )}
        </header>

        {/* ── Audio Player ──────────────────────────────────────────── */}
        <div
          className="rounded-2xl border p-5 shadow-sm"
          style={{ borderColor: "var(--border-color)", background: "var(--code-bg)" }}
        >
          <audio
            ref={audioRef}
            src={podcast.audioFile}
            preload="metadata"
            onTimeUpdate={onTimeUpdate}
            onLoadedMetadata={onLoadedMetadata}
            onPlay={onPlay}
            onPause={onPause}
          />

          <div className="flex flex-col gap-4">
            {/* Progress bar */}
            <div
              role="slider"
              aria-label="Audio progress"
              aria-valuemin={0}
              aria-valuemax={duration}
              aria-valuenow={currentTime}
              tabIndex={0}
              className="group relative h-2 w-full cursor-pointer rounded-full"
              style={{ background: "var(--border-color)" }}
              onClick={handleProgressClick}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft") seekTo(Math.max(0, currentTime - 5));
                else if (e.key === "ArrowRight") seekTo(Math.min(duration, currentTime + 5));
              }}
            >
              <div
                className="absolute left-0 top-0 h-full rounded-full transition-[width] duration-100"
                style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : "0%", background: "var(--color-accent)", opacity: 0.7 }}
              />
              <div
                className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                style={{ left: duration > 0 ? `${(currentTime / duration) * 100}%` : "0%", background: "var(--color-accent)" }}
              />
            </div>

            {/* Time */}
            <div className="flex items-center justify-between">
              <span className="text-xs tabular-nums" style={{ fontFamily: "var(--font-poppins)", color: "var(--fg-secondary)", opacity: 0.6 }}>
                {formatTime(currentTime)}
              </span>
              <span className="text-xs tabular-nums" style={{ fontFamily: "var(--font-poppins)", color: "var(--fg-secondary)", opacity: 0.4 }}>
                {duration > 0 ? formatTime(duration) : "--:--"}
              </span>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-center gap-4">
              <button onClick={skipBack} aria-label="Skip back 15s" className="flex items-center justify-center rounded-full p-2 transition-opacity hover:opacity-70" style={{ color: "var(--fg-secondary)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 4v6h6" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                </svg>
                <span className="absolute text-[0.55rem] font-semibold" style={{ fontFamily: "var(--font-poppins)" }}>15</span>
              </button>

              <button onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"} className="flex h-14 w-14 items-center justify-center rounded-full transition-all hover:scale-105 active:scale-95" style={{ background: "var(--color-accent)", color: "#fff" }}>
                {isPlaying ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                )}
              </button>

              <button onClick={skipForward} aria-label="Skip forward 15s" className="flex items-center justify-center rounded-full p-2 transition-opacity hover:opacity-70" style={{ color: "var(--fg-secondary)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 4v6h-6" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
                <span className="absolute text-[0.55rem] font-semibold" style={{ fontFamily: "var(--font-poppins)" }}>15</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Subtitle Toggle ───────────────────────────────────────── */}
        {hasSubtitles ? (
          <button
            onClick={() => setShowSubtitles((prev) => !prev)}
            className="self-start text-xs font-medium transition-opacity hover:opacity-70"
            style={{ fontFamily: "var(--font-poppins)", color: "var(--color-accent)" }}
          >
            {showSubtitles ? "隐藏字幕" : "显示字幕"} ({subtitles.length} 条)
          </button>
        ) : (
          <div className="rounded-xl border p-4" style={{ borderColor: "var(--border-color)", background: "color-mix(in oklab, var(--code-bg) 80%, var(--bg))" }}>
            <p className="text-sm leading-relaxed" style={{ color: "var(--fg-secondary)", opacity: 0.6 }}>
              ⏳ 字幕数据暂未加载。
            </p>
          </div>
        )}

        {/* ── Subtitle List ─────────────────────────────────────────── */}
        {hasSubtitles && showSubtitles && (
          <div
            ref={subtitleContainerRef}
            className="flex max-h-[50vh] flex-col gap-1 overflow-y-auto rounded-xl border p-2"
            style={{ borderColor: "var(--border-color)" }}
          >
            {subtitles.map((sub, index) => (
              <button
                key={index}
                data-active={index === activeSubtitleIndex}
                onClick={() => handleSubtitleClick(sub.start)}
                className="flex items-start gap-3 rounded-lg px-3 py-2 text-left transition-colors"
                style={{
                  background: index === activeSubtitleIndex ? "color-mix(in oklab, var(--color-accent) 12%, transparent)" : "transparent",
                  borderLeft: index === activeSubtitleIndex ? "3px solid var(--color-accent)" : "3px solid transparent",
                  opacity: index === activeSubtitleIndex ? 1 : 0.5,
                }}
              >
                <span className="mt-0.5 shrink-0 text-xs tabular-nums" style={{ fontFamily: "var(--font-poppins)", color: "var(--fg-secondary)", minWidth: "2.5rem" }}>
                  {formatTime(sub.start)}
                </span>
                <span className="mt-0.5 shrink-0 text-base">{sub.speaker}</span>
                <span className="text-sm leading-relaxed" style={{ color: "var(--fg-secondary)" }}>{sub.text}</span>
              </button>
            ))}
          </div>
        )}

        {/* ── Show Notes ────────────────────────────────────────────── */}
        <div className="prose-custom pt-4">{children}</div>

        {/* ── Footer ────────────────────────────────────────────────── */}
        <footer className="footer-accent pt-10 pb-8 flex flex-col gap-6">
          <div className="rounded-xl border p-5" style={{ borderColor: "var(--border-color)", background: "color-mix(in oklab, var(--code-bg) 80%, var(--bg))" }}>
            <h3 className="mb-3 text-sm font-semibold" style={{ fontFamily: "var(--font-poppins)" }}>关于这期播客</h3>
            <div className="flex flex-col gap-2 text-sm leading-relaxed" style={{ color: "var(--fg-secondary)", opacity: 0.7 }}>
              <p><strong>主播：</strong>{hostsStr}</p>
              <p><strong>时长：</strong>{podcast.duration}</p>
              <p><strong>发布日期：</strong>{podcast.date}</p>
              <p><strong>音频格式：</strong>MP3, 96kbps, 24kHz mono</p>
              <p><strong>字幕来源：</strong>豆包 Flash ASR · speaker diarization + 词级时间戳</p>
            </div>
          </div>
          <Link href="/" className="self-start text-xs hover:opacity-100 transition-opacity" style={{ color: "var(--fg-secondary)", opacity: 0.4 }}>
            ← Back to Home
          </Link>
        </footer>
      </article>
    </main>
  );
}
