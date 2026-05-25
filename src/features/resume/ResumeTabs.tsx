"use client";

import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";
import type { ResumeData } from "./types";

type View = "rendered" | "json" | "editor";

function formatDateRange(start?: string, end?: string) {
  if (!start && !end) return "";
  if (!start) return end || "";
  return `${start} — ${end || "Present"}`;
}

function RenderedResume({ resume }: { resume: ResumeData }) {
  const basic = resume.basic_info;

  return (
    <article className="resume-paper resume-card-face" aria-label="Rendered resume">
      <header className="resume-hero">
        <div>
          <h1>{basic.name}</h1>
          <p className="resume-label">预防医学本科 · 英语教学 / 学术辅导 / AI 协作</p>
          <div className="resume-contact">
            {basic.email && <a href={`mailto:${basic.email}`}>{basic.email}</a>}
            {basic.phone && <a href={`tel:${basic.phone}`}>{basic.phone}</a>}
            {basic.location && <span>{basic.location}</span>}
            {basic.birth_date && <span>{basic.birth_date}</span>}
          </div>
          {!!resume.profiles?.length && (
            <div className="resume-profiles">
              {resume.profiles.map((profile) => (
                <a key={`${profile.network}-${profile.url}`} href={profile.url} target="_blank" rel="noopener noreferrer">
                  {profile.network}{profile.description ? ` · ${profile.description}` : ""}
                </a>
              ))}
            </div>
          )}
        </div>
      </header>

      {!!resume.education?.length && (
        <section className="resume-section">
          <h2>Education</h2>
          {resume.education.map((item) => (
            <article className="resume-entry" key={`${item.school}-${item.major}`}>
              <div className="resume-entry-head">
                <div>
                  <h3>{item.school}</h3>
                  <p>{[item.major, item.current_status].filter(Boolean).join(" · ")}</p>
                </div>
                {formatDateRange(item.start_date, item.end_date) && <time>{formatDateRange(item.start_date, item.end_date)}</time>}
              </div>
            </article>
          ))}
        </section>
      )}

      {!!resume.skills?.length && (
        <section className="resume-section">
          <h2>Skills</h2>
          <div className="resume-skills">
            {resume.skills.map((skill) => (
              <div className="resume-skill" key={skill.name}>
                <strong>{skill.name}</strong>
                {skill.description && <span>{skill.description}</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {!!resume.projects?.length && (
        <section className="resume-section">
          <h2>Projects</h2>
          {resume.projects.map((project) => (
            <article className="resume-entry" key={project.name}>
              <div className="resume-entry-head">
                <div>
                  <h3>{project.name}</h3>
                  {project.description && <p>{project.description}</p>}
                </div>
              </div>
              {!!project.links?.length && (
                <div className="resume-inline-list" style={{ marginTop: "0.45rem" }}>
                  {project.links.map((link) => (
                    <a key={`${project.name}-${link.url}`} href={link.url} target="_blank" rel="noopener noreferrer">
                      {link.label} ↗
                    </a>
                  ))}
                </div>
              )}
            </article>
          ))}
        </section>
      )}
    </article>
  );
}

function JsonViewer({ json }: { json: string }) {
  return (
    <pre className="resume-json-viewer resume-card-face" aria-label="Raw JSON resume data">
      <code>{json}</code>
    </pre>
  );
}

async function parseResponse(response: Response) {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || `Request failed: ${response.status}`);
  return payload;
}

function EditorPanel({ json, onSaved }: { json: string; onSaved: (resume: ResumeData) => void }) {
  const [password, setPassword] = useState("");
  const [draft, setDraft] = useState(json);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  function unlock(event: React.FormEvent) {
    event.preventDefault();
    if (!password) return;
    setIsUnlocked(true);
    setMessage("");
  }

  async function save() {
    setMessage("");
    setIsSaving(true);
    try {
      const parsed = JSON.parse(draft) as ResumeData;
      const payload = await fetch("/api/resume-save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, resume: parsed }),
      }).then(parseResponse);
      setDraft(JSON.stringify(parsed, null, 2) + "\n");
      onSaved(parsed);
      setMessage(`Saved ✓`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Save failed");
    } finally {
      setIsSaving(false);
    }
  }

  if (!isUnlocked) {
    return (
      <form className="resume-editor-lock" onSubmit={unlock}>
        <h2>Editor</h2>
        <p>Enter password to edit</p>
        <label>
          Password
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="current-password" />
        </label>
        <button type="submit" disabled={!password}>Unlock</button>
        {message && <p className="resume-editor-message">{message}</p>}
      </form>
    );
  }

  return (
    <section className="resume-editor">
      <div className="resume-editor-bar">
        <p>Edit JSON — Save commits to GitHub</p>
        <button type="button" onClick={save} disabled={isSaving}>
          {isSaving ? "Saving…" : "Save & Commit"}
        </button>
      </div>
      <textarea value={draft} onChange={(e) => setDraft(e.target.value)} spellCheck={false} />
      {message && <p className="resume-editor-message">{message}</p>}
    </section>
  );
}

export default function ResumeTabs({ initialResume, initialJson }: { initialResume: ResumeData; initialJson: string }) {
  const [resume, setResume] = useState(initialResume);
  const json = useMemo(() => JSON.stringify(resume, null, 2), [resume]);
  const [view, setView] = useState<View>("rendered");
  const [isFlipped, setIsFlipped] = useState(false);

  const clicksRef = useRef<number[]>([]);
  const CLICK_WINDOW = 2000;

  const handleCardTap = useCallback(() => {
    const now = Date.now();
    clicksRef.current = [...clicksRef.current, now].filter((t) => now - t <= CLICK_WINDOW);

    if (clicksRef.current.length >= 3) {
      // 3 taps → enter editor
      clicksRef.current = [];
      setView("editor");
      setIsFlipped(false);
    } else if (clicksRef.current.length === 1) {
      // 1 tap → flip card (toggle rendered/JSON)
      setIsFlipped((prev) => !prev);
    }
  }, []);

  const exitEditor = useCallback(() => {
    setView("rendered");
    setIsFlipped(false);
  }, []);

  return (
    <main className="resume-shell">
      <div className="resume-toolbar print:hidden">
        <Link href="/" className="resume-back-link">← Home</Link>
        <span className="text-xs" style={{ color: "var(--fg-secondary)", opacity: 0.5 }}>
          {view === "editor" ? "Editor mode" : isFlipped ? "JSON — tap to flip back" : "Tap card to flip · triple-tap for editor"}
        </span>
        <button type="button" className="resume-print-button" onClick={() => window.print()}>
          Print
        </button>
      </div>

      {view === "editor" ? (
        <div className="resume-editor-wrapper">
          <button type="button" onClick={exitEditor} className="resume-print-button" style={{ marginBottom: "1rem" }}>
            ← Back to resume
          </button>
          <EditorPanel json={initialJson} onSaved={setResume} />
        </div>
      ) : (
        <div className="resume-card" onClick={handleCardTap} role="button" tabIndex={0} aria-label={isFlipped ? "JSON view — tap to flip" : "Resume — tap to flip"}>
          <div className={`resume-card-inner ${isFlipped ? "flipped" : ""}`}>
            <div className="resume-card-front">
              <RenderedResume resume={resume} />
            </div>
            <div className="resume-card-back">
              <JsonViewer json={json} />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
