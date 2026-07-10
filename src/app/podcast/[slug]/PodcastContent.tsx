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
  SpeakerWaveIcon,
  ChevronDownIcon,
  ChevronUpIcon,
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

const PLAYBACK_SPEEDS = [0.75, 1, 1.25, 1.5, 2] as const;

// ── Speaker color map ──────────────────────────────────────────────────

function speakerConfig(speaker: string) {
  const lower = speaker.toLowerCase();
  if (lower.includes("dayi") || lower.includes("male") || lower.includes("🧑"))
    return { bg: "var(--color-blue)", label: "D" };
  if (lower.includes("mizai") || lower.includes("female") || lower.includes("👩"))
    return { bg: "var(--color-accent)", label: "M" };
  return { bg: "var(--color-green)", label: "?" };
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
  const [showSubtitles, setShowSubtitles] = useState(true);
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
    if (activeSubtitleIndex < 0 || !subtitleContainerRef.current) return;
    if (!isPlaying) return;
    const container = subtitleContainerRef.current;
    const activeEl = container.querySelector('[data-active="true"]');
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
            HERO BANNER
           ═══════════════════════════════════════════════════════════════ */}
        <header className="flex flex-col gap-5">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs tracking-widest uppercase opacity-40 hover:opacity-100 transition-opacity w-fit"
            style={{ fontFamily: "var(--font-poppins)", color: "var(--fg-secondary)" }}
          >
            <ArrowLeftIcon className="w-3 h-3" />
            Home
          </Link>

          {/* Episode artwork + badge row */}
          <div className="flex items-start gap-5">
            {/* Artwork */}
            <div
              className="hidden sm:flex shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl items-center justify-center shadow-lg"
              style={{
                background: `linear-gradient(135deg, var(--color-accent), color-mix(in oklab, var(--color-accent) 40%, var(--color-blue)))`,
              }}
              aria-hidden="true"
            >
              <MicrophoneIcon className="w-10 h-10 sm:w-12 sm:h-12 text-white/80" />
            </div>

            <div className="flex flex-col gap-3 min-w-0">
              {/* Badges */}
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

              {/* Description (collapsible on mobile) */}
              {podcast.description && (
                <p
                  className="text-sm leading-relaxed line-clamp-3 sm:line-clamp-none"
                  style={{ color: "var(--fg-secondary)", opacity: 0.6 }}
                >
                  {podcast.description}
                </p>
              )}
            </div>
          </div>
        </header>

        {/* ═══════════════════════════════════════════════════════════════
            AUDIO PLAYER CARD
           ═══════════════════════════════════════════════════════════════ */}
        <div
          className="podcast-player-card rounded-2xl border shadow-sm overflow-hidden"
          style={{ borderColor: "var(--border-color)" }}
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

          <div className="p-5 sm:p-6 flex flex-col gap-5">
            {/* ══ Progress bar ══ */}
            <div className="flex flex-col gap-2">
              <div
                role="slider"
                aria-label="Audio progress"
                aria-valuemin={0}
                aria-valuemax={Math.floor(duration)}
                aria-valuenow={Math.floor(currentTime)}
                aria-valuetext={`${progressFormatted} of ${durationFormatted}`}
                tabIndex={0}
                className="group relative h-1.5 w-full cursor-pointer rounded-full hover:h-2 transition-[height]"
                style={{ background: "var(--border-color)" }}
                onClick={handleProgressClick}
                onKeyDown={(e) => {
                  if (e.key === "ArrowLeft")
                    seekTo(Math.max(0, currentTime - 5));
                  else if (e.key === "ArrowRight")
                    seekTo(Math.min(duration, currentTime + 5));
                }}
              >
                {/* Progress fill */}
                <div
                  className="absolute left-0 top-0 h-full rounded-full transition-[width] duration-75 ease-linear"
                  style={{
                    width: `${progressPct}%`,
                    background: `linear-gradient(90deg, var(--color-accent), color-mix(in oklab, var(--color-accent) 70%, var(--color-blue)))`,
                  }}
                />
                {/* Thumb */}
                <div
                  className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md ring-2 ring-white/20"
                  style={{
                    left: `${progressPct}%`,
                    background: "var(--color-accent)",
                  }}
                />
              </div>

              {/* Time display */}
              <div className="flex items-center justify-between">
                <span
                  className="text-xs tabular-nums font-medium"
                  style={{
                    fontFamily: "var(--font-poppins)",
                    color: "var(--fg-secondary)",
                    opacity: 0.7,
                  }}
                >
                  {progressFormatted}
                </span>
                <span
                  className="text-xs tabular-nums"
                  style={{
                    fontFamily: "var(--font-poppins)",
                    color: "var(--fg-secondary)",
                    opacity: 0.4,
                  }}
                >
                  {durationFormatted}
                </span>
              </div>
            </div>

            {/* ══ Controls row ══ */}
            <div className="flex items-center justify-between">
              {/* Speed control */}
              <div className="relative">
                <button
                  onClick={() => setShowSpeedMenu((v) => !v)}
                  className="flex items-center gap-0.5 rounded-full px-2.5 py-1 text-xs font-medium transition-all hover:opacity-70"
                  style={{
                    fontFamily: "var(--font-poppins)",
                    color: "var(--fg-secondary)",
                    background: "var(--code-bg)",
                  }}
                  aria-label={`Playback speed ${playbackRate}x`}
                >
                  <SpeakerWaveIcon className="w-3 h-3" />
                  {playbackRate}x
                </button>
                {showSpeedMenu && (
                  <div
                    className="absolute bottom-full left-0 mb-2 rounded-xl border py-1 shadow-lg z-10 min-w-[5rem]"
                    style={{
                      borderColor: "var(--border-color)",
                      background: "var(--bg)",
                    }}
                  >
                    {PLAYBACK_SPEEDS.map((speed) => (
                      <button
                        key={speed}
                        onClick={() => setSpeed(speed)}
                        className="block w-full text-left px-4 py-1.5 text-xs font-medium transition-colors hover:opacity-70"
                        style={{
                          fontFamily: "var(--font-poppins)",
                          color:
                            speed === playbackRate
                              ? "var(--color-accent)"
                              : "var(--fg-secondary)",
                          background:
                            speed === playbackRate
                              ? "color-mix(in oklab, var(--color-accent) 8%, transparent)"
                              : "transparent",
                        }}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Main controls */}
              <div className="flex items-center gap-3 sm:gap-5">
                {/* Skip back */}
                <button
                  onClick={skipBack}
                  aria-label="Skip back 15 seconds"
                  className="relative flex items-center justify-center rounded-full p-2 transition-all hover:scale-110 active:scale-95"
                  style={{ color: "var(--fg-secondary)" }}
                >
                  <BackwardIcon className="w-5 h-5" />
                  <span
                    className="absolute text-[0.5rem] font-bold"
                    style={{ fontFamily: "var(--font-poppins)" }}
                  >
                    15
                  </span>
                </button>

                {/* Play/Pause */}
                <button
                  onClick={togglePlay}
                  aria-label={isPlaying ? "Pause" : "Play"}
                  className={`podcast-play-btn ${isPlaying ? "playing" : ""} flex h-14 w-14 items-center justify-center rounded-full transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg`}
                  style={{
                    background: isPlaying
                      ? "color-mix(in oklab, var(--color-accent) 85%, var(--fg))"
                      : "var(--color-accent)",
                    color: "#fff",
                  }}
                >
                  {isPlaying ? (
                    <PauseIcon className="w-7 h-7" />
                  ) : (
                    <PlayIcon className="w-7 h-7 ml-0.5" />
                  )}
                </button>

                {/* Skip forward */}
                <button
                  onClick={skipForward}
                  aria-label="Skip forward 15 seconds"
                  className="relative flex items-center justify-center rounded-full p-2 transition-all hover:scale-110 active:scale-95"
                  style={{ color: "var(--fg-secondary)" }}
                >
                  <ForwardIcon className="w-5 h-5" />
                  <span
                    className="absolute text-[0.5rem] font-bold"
                    style={{ fontFamily: "var(--font-poppins)" }}
                  >
                    15
                  </span>
                </button>
              </div>

              {/* Spacer for balance */}
              <div className="w-[4.5rem]" aria-hidden="true" />
            </div>
          </div>

          {/* Playing indicator bar */}
          {isPlaying && (
            <div
              className="h-0.5 w-full animate-pulse opacity-60"
              style={{ background: "var(--color-accent)" }}
              aria-hidden="true"
            />
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            SUBTITLE TOGGLE + PANEL
           ═══════════════════════════════════════════════════════════════ */}
        {hasSubtitles ? (
          <section className="flex flex-col gap-3">
            {/* Toggle */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowSubtitles((prev) => !prev)}
                className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide transition-all hover:opacity-70"
                style={{
                  fontFamily: "var(--font-poppins)",
                  color: "var(--color-accent)",
                }}
              >
                <ChatBubbleLeftRightIcon className="w-4 h-4" />
                {showSubtitles ? "隐藏字幕" : "显示字幕"}
                <span
                  className="rounded-full px-2 py-0.5 text-[0.65rem] font-medium"
                  style={{
                    background: "color-mix(in oklab, var(--color-accent) 12%, transparent)",
                    color: "var(--color-accent)",
                  }}
                >
                  {subtitles.length}
                </span>
                {showSubtitles ? (
                  <ChevronUpIcon className="w-3 h-3 opacity-60" />
                ) : (
                  <ChevronDownIcon className="w-3 h-3 opacity-60" />
                )}
              </button>

              {/* Keyboard hints */}
              <div className="hidden sm:flex items-center gap-2 text-[0.65rem]" style={{ color: "var(--fg-secondary)", opacity: 0.35 }}>
                <kbd className="rounded border px-1.5 py-0.5 text-[0.6rem] font-mono" style={{ borderColor: "var(--border-color)" }}>Space</kbd>
                <span>play</span>
                <kbd className="rounded border px-1.5 py-0.5 text-[0.6rem] font-mono" style={{ borderColor: "var(--border-color)" }}>←→</kbd>
                <span>seek</span>
              </div>
            </div>

            {/* Subtitle list */}
            {showSubtitles && (
              <div
                ref={subtitleContainerRef}
                className="subtitle-panel flex max-h-[45vh] sm:max-h-[50vh] flex-col rounded-xl border overflow-y-auto"
                style={{ borderColor: "var(--border-color)" }}
              >
                {subtitles.map((sub, index) => {
                  const active = index === activeSubtitleIndex;
                  const speaker = speakerConfig(sub.speaker);

                  return (
                    <button
                      key={index}
                      data-active={active}
                      onClick={() => handleSubtitleClick(sub.start)}
                      className="flex items-start gap-3 px-3 sm:px-4 py-2.5 text-left transition-all duration-200 subtitle-row"
                      style={{
                        background: active
                          ? "color-mix(in oklab, var(--color-accent) 8%, transparent)"
                          : "transparent",
                        borderLeft: active
                          ? "3px solid var(--color-accent)"
                          : "3px solid transparent",
                        opacity: active ? 1 : 0.45,
                      }}
                    >
                      {/* Speaker avatar */}
                      <span
                        className="mt-0.5 shrink-0 flex h-6 w-6 items-center justify-center rounded-full text-[0.6rem] font-bold text-white"
                        style={{
                          background: speaker.bg,
                          fontFamily: "var(--font-poppins)",
                        }}
                        aria-label={`Speaker: ${sub.speaker}`}
                      >
                        {speaker.label}
                      </span>

                      {/* Timestamp */}
                      <span
                        className="mt-0.5 shrink-0 text-xs tabular-nums pt-0.5"
                        style={{
                          fontFamily: "var(--font-poppins)",
                          color: "var(--fg-secondary)",
                          minWidth: "2.5rem",
                        }}
                      >
                        {formatTime(sub.start)}
                      </span>

                      {/* Text */}
                      <span
                        className="text-sm leading-relaxed flex-1"
                        style={{ color: "var(--fg-secondary)" }}
                      >
                        {sub.text}
                      </span>
                    </button>
                  );
                })}

                {/* Scroll-to-playing hint */}
                {isPlaying && activeSubtitleIndex >= 0 && (
                  <div
                    className="sticky bottom-0 flex items-center justify-center py-2 text-[0.65rem] font-medium pointer-events-none"
                    style={{
                      fontFamily: "var(--font-poppins)",
                      color: "var(--color-accent)",
                      background:
                        "linear-gradient(transparent, color-mix(in oklab, var(--bg) 90%, transparent))",
                    }}
                  >
                    <SpeakerWaveIcon className="w-3 h-3 mr-1 animate-pulse" />
                    Now playing...
                  </div>
                )}
              </div>
            )}
          </section>
        ) : (
          /* Empty state */
          <div
            className="rounded-xl border p-5 flex flex-col items-center gap-2 text-center"
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
