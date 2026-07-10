"use client";

import { useState, useRef, useCallback, useEffect, useMemo, type ReactNode } from "react";
import Link from "next/link";
import {
  PlayIcon,
  PauseIcon,
  BackwardIcon,
  ForwardIcon,
  MicrophoneIcon,
  ClockIcon,
  ArrowLeftIcon,
  ChatBubbleLeftRightIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

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
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Clean speaker label: strip emoji prefix, lowercase. "🧑 dayi" → "dayi" */
function speakerLabel(raw: string): string {
  return raw.replace(/^[^\w\s]+/, "").trim().toLowerCase();
}

const PLAYBACK_SPEEDS = [0.75, 1, 1.25, 1.5, 2] as const;

// ── Component ──────────────────────────────────────────────────────────

export default function PodcastContent({
  podcast,
  children,
}: {
  podcast: PodcastData;
  children: ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSubtitleIndex, setActiveSubtitleIndex] = useState(-1);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const subtitles: Subtitle[] = useMemo(
    () => podcast.subtitles ?? [],
    [podcast.subtitles],
  );
  const hasSubtitles = subtitles.length > 0;
  const hostsStr = useMemo(
    () => podcast.hosts.map((h) => `${h.role} ${h.name}`).join(" & "),
    [podcast.hosts],
  );

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
  const onEnded = useCallback(() => setIsPlaying(false), []);

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
    audio.currentTime = Math.max(0, Math.min(time, audio.duration || time));
  }, []);

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
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
    audio.currentTime = Math.min(audio.duration || duration, audio.currentTime + 15);
  }, [duration]);

  const handleSubtitleClick = useCallback(
    (start: number) => seekTo(start),
    [seekTo],
  );

  const setSpeed = useCallback((speed: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = speed;
    setPlaybackRate(speed);
    setShowSpeedMenu(false);
  }, []);

  // ── Auto-scroll active subtitle ─────────────────────────────────────

  useEffect(() => {
    if (activeSubtitleIndex < 0 || !transcriptRef.current) return;
    if (!isPlaying) return;
    const activeEl = transcriptRef.current.querySelector('[data-active="true"]');
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [activeSubtitleIndex, isPlaying]);

  // ── Keyboard shortcuts ──────────────────────────────────────────────

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
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

  // ── Progress helpers ────────────────────────────────────────────────

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;
  const progressFormatted = formatTime(currentTime);
  const durationFormatted = duration > 0 ? formatTime(duration) : "--:--";

  // ── Render ──────────────────────────────────────────────────────────

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 sm:px-6 pt-16 sm:pt-20 pb-32">
      <article className="w-full max-w-lg md:max-w-[46rem] flex flex-col gap-8 sm:gap-10">

        {/* ═══════════════════════════════════════════════════════════════
            HEADER — no artwork, just metadata
           ═══════════════════════════════════════════════════════════════ */}
        <header className="flex flex-col gap-4">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs tracking-widest uppercase opacity-40 hover:opacity-100 transition-opacity w-fit"
            style={{ fontFamily: "var(--font-poppins)", color: "var(--fg-secondary)" }}
          >
            <ArrowLeftIcon className="w-3 h-3" />
            Home
          </Link>

          {/* Badges row */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide"
              style={{
                borderColor: "var(--color-accent)",
                color: "var(--color-accent)",
                fontFamily: "var(--font-poppins)",
              }}
            >
              <MicrophoneIcon className="w-3 h-3" />
              Podcast
            </span>
            <span
              className="inline-flex items-center gap-1 text-xs"
              style={{ color: "var(--fg-secondary)", opacity: 0.5 }}
            >
              <ClockIcon className="w-3 h-3" />
              {podcast.duration}
            </span>
          </div>

          {/* Title */}
          <h1
            className="text-2xl sm:text-3xl font-semibold tracking-tight leading-tight"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            {podcast.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span
              className="text-xs"
              style={{ color: "var(--fg-secondary)", opacity: 0.5 }}
            >
              {podcast.date}
            </span>
            <span
              className="text-xs"
              style={{ color: "var(--fg-secondary)", opacity: 0.5 }}
            >
              {hostsStr}
            </span>
          </div>

          {/* Description */}
          {podcast.description && (
            <p
              className="text-sm leading-relaxed line-clamp-3 sm:line-clamp-none"
              style={{ color: "var(--fg-secondary)", opacity: 0.6 }}
            >
              {podcast.description}
            </p>
          )}
        </header>

        {/* ═══════════════════════════════════════════════════════════════
            AUDIO PLAYER — thin control strip
           ═══════════════════════════════════════════════════════════════ */}
        <div
          className="flex items-center gap-2.5 sm:gap-3 py-2.5 px-3 rounded-lg border"
          style={{
            borderColor: "var(--border-color)",
            background: "color-mix(in oklab, var(--bg) 97%, var(--fg) 3%)",
          }}
        >
          {/* Hidden audio element */}
          <audio
            ref={audioRef}
            src={podcast.audioFile}
            preload="metadata"
            onTimeUpdate={onTimeUpdate}
            onLoadedMetadata={onLoadedMetadata}
            onPlay={onPlay}
            onPause={onPause}
            onEnded={onEnded}
          />

          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full transition-all duration-150 hover:scale-105 active:scale-95"
            style={{
              background: isPlaying
                ? "color-mix(in oklab, var(--color-accent) 85%, var(--fg))"
                : "var(--color-accent)",
              color: "#fff",
            }}
          >
            {isPlaying ? (
              <PauseIcon className="w-3.5 h-3.5" />
            ) : (
              <PlayIcon className="w-3.5 h-3.5 ml-0.5" />
            )}
          </button>

          {/* Skip back (desktop only) */}
          <button
            onClick={skipBack}
            aria-label="Skip back 15 seconds"
            className="shrink-0 hidden sm:flex items-center justify-center w-5 h-5 rounded transition-opacity hover:opacity-70"
            style={{ color: "var(--fg-secondary)", opacity: 0.5 }}
          >
            <BackwardIcon className="w-3.5 h-3.5" />
          </button>

          {/* Progress bar + time */}
          <div className="flex-1 min-w-0 flex flex-col gap-0.5">
            <div
              role="slider"
              aria-label="Audio progress"
              aria-valuemin={0}
              aria-valuemax={Math.floor(duration)}
              aria-valuenow={Math.floor(currentTime)}
              aria-valuetext={`${progressFormatted} of ${durationFormatted}`}
              tabIndex={0}
              className="group relative h-1 w-full cursor-pointer rounded-full hover:h-1.5 transition-[height]"
              style={{ background: "var(--border-color)" }}
              onClick={handleProgressClick}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft")
                  seekTo(Math.max(0, currentTime - 5));
                else if (e.key === "ArrowRight")
                  seekTo(Math.min(duration, currentTime + 5));
              }}
            >
              <div
                className="absolute left-0 top-0 h-full rounded-full"
                style={{
                  width: `${progressPct}%`,
                  background: "var(--color-accent)",
                }}
              />
              {/* Thumb */}
              <div
                className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `${progressPct}%`, background: "var(--color-accent)" }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span
                className="text-[0.6rem] tabular-nums"
                style={{
                  fontFamily: "var(--font-poppins)",
                  color: "var(--fg-secondary)",
                  opacity: 0.7,
                }}
              >
                {progressFormatted}
              </span>
              <span
                className="text-[0.6rem] tabular-nums"
                style={{
                  fontFamily: "var(--font-poppins)",
                  color: "var(--fg-secondary)",
                  opacity: 0.35,
                }}
              >
                {durationFormatted}
              </span>
            </div>
          </div>

          {/* Skip forward (desktop only) */}
          <button
            onClick={skipForward}
            aria-label="Skip forward 15 seconds"
            className="shrink-0 hidden sm:flex items-center justify-center w-5 h-5 rounded transition-opacity hover:opacity-70"
            style={{ color: "var(--fg-secondary)", opacity: 0.5 }}
          >
            <ForwardIcon className="w-3.5 h-3.5" />
          </button>

          {/* Speed control */}
          <div className="relative shrink-0">
            <button
              onClick={() => setShowSpeedMenu((v) => !v)}
              className="flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[0.6rem] font-medium transition-opacity hover:opacity-70"
              style={{
                fontFamily: "var(--font-poppins)",
                color: "var(--fg-secondary)",
                opacity: 0.6,
              }}
              aria-label={`Playback speed ${playbackRate}x`}
            >
              {playbackRate}x
            </button>
            {showSpeedMenu && (
              <div
                className="absolute bottom-full right-0 mb-1.5 rounded-lg border py-1 shadow-lg z-10 min-w-[3.5rem]"
                style={{
                  borderColor: "var(--border-color)",
                  background: "var(--bg)",
                }}
              >
                {PLAYBACK_SPEEDS.map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setSpeed(speed)}
                    className="block w-full text-left px-2.5 py-1 text-xs font-medium transition-colors hover:opacity-70"
                    style={{
                      fontFamily: "var(--font-poppins)",
                      color:
                        speed === playbackRate
                          ? "var(--color-accent)"
                          : "var(--fg-secondary)",
                    }}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Keyboard hints (subtle, desktop only) */}
        <div
          className="hidden sm:flex items-center gap-1.5 text-[0.6rem]"
          style={{ color: "var(--fg-secondary)", opacity: 0.3 }}
        >
          <kbd
            className="rounded border px-1 py-0.5 text-[0.55rem] font-mono"
            style={{ borderColor: "var(--border-color)" }}
          >
            Space
          </kbd>
          <span>play/pause</span>
          <kbd
            className="rounded border px-1 py-0.5 text-[0.55rem] font-mono ml-1"
            style={{ borderColor: "var(--border-color)" }}
          >
            ←→
          </kbd>
          <span>seek</span>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            TRANSCRIPT — always visible, flowing as page content
           ═══════════════════════════════════════════════════════════════ */}
        {hasSubtitles ? (
          <section ref={transcriptRef} className="flex flex-col">
            {subtitles.map((sub, index) => {
              const active = index === activeSubtitleIndex;
              const label = speakerLabel(sub.speaker);

              return (
                <button
                  key={index}
                  data-active={active}
                  onClick={() => handleSubtitleClick(sub.start)}
                  className="group flex items-start gap-2 sm:gap-3 py-2.5 px-2 -mx-2 text-left transition-colors rounded-md"
                  style={{
                    background: active
                      ? "color-mix(in oklab, var(--color-accent) 5%, transparent)"
                      : "transparent",
                    opacity: active ? 1 : 0.48,
                  }}
                >
                  {/* Speaker label */}
                  <span
                    className="shrink-0 w-10 sm:w-12 text-[0.7rem] sm:text-xs font-medium pt-0.5 text-right select-none"
                    style={{
                      fontFamily: "var(--font-poppins)",
                      color: active
                        ? "var(--color-accent)"
                        : "var(--fg-secondary)",
                    }}
                  >
                    {label}
                  </span>

                  {/* Timestamp (desktop only) */}
                  <span
                    className="shrink-0 hidden sm:inline text-[0.6rem] tabular-nums pt-[0.35rem] select-none"
                    style={{
                      fontFamily: "var(--font-poppins)",
                      color: "var(--fg-secondary)",
                      opacity: 0.3,
                    }}
                  >
                    {formatTime(sub.start)}
                  </span>

                  {/* Text */}
                  <span
                    className="flex-1 text-sm leading-relaxed"
                    style={{ color: "var(--fg)" }}
                  >
                    {sub.text}
                  </span>
                </button>
              );
            })}
          </section>
        ) : (
          /* Empty state — no subtitles available */
          <div
            className="rounded-lg border p-5 flex flex-col items-center gap-2 text-center"
            style={{
              borderColor: "var(--border-color)",
              background: "color-mix(in oklab, var(--code-bg) 80%, var(--bg))",
            }}
          >
            <ChatBubbleLeftRightIcon
              className="w-6 h-6"
              style={{ color: "var(--fg-secondary)", opacity: 0.3 }}
            />
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--fg-secondary)", opacity: 0.5 }}
            >
              字幕数据暂未加载
            </p>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            SHOW NOTES (Markdown content)
           ═══════════════════════════════════════════════════════════════ */}
        <div className="prose-custom pt-2">{children}</div>

        {/* ═══════════════════════════════════════════════════════════════
            FOOTER
           ═══════════════════════════════════════════════════════════════ */}
        <footer className="footer-accent pt-10 pb-8 flex flex-col gap-6">
          <div
            className="rounded-xl border p-5"
            style={{
              borderColor: "var(--border-color)",
              background:
                "color-mix(in oklab, var(--code-bg) 80%, var(--bg))",
            }}
          >
            <h3
              className="mb-3 flex items-center gap-2 text-sm font-semibold"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              <InformationCircleIcon className="w-4 h-4" style={{ color: "var(--color-accent)" }} />
              关于这期播客
            </h3>
            <div
              className="flex flex-col gap-2 text-sm leading-relaxed"
              style={{ color: "var(--fg-secondary)", opacity: 0.7 }}
            >
              <p>
                <strong>主播：</strong>
                {hostsStr}
              </p>
              <p>
                <strong>时长：</strong>
                {podcast.duration}
              </p>
              <p>
                <strong>发布日期：</strong>
                {podcast.date}
              </p>
              <p>
                <strong>音频格式：</strong>
                MP3, 96kbps, 24kHz mono
              </p>
              <p>
                <strong>字幕来源：</strong>
                豆包 Flash ASR · speaker diarization + 词级时间戳
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 self-start text-xs transition-opacity hover:opacity-100"
            style={{ color: "var(--fg-secondary)", opacity: 0.4 }}
          >
            <ArrowLeftIcon className="w-3 h-3" />
            Back to Home
          </Link>
        </footer>
      </article>
    </main>
  );
}
