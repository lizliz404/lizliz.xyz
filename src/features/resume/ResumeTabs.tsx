"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ResumeData } from "./types";

type Tab = "rendered" | "json" | "editor";
type AuthState = "locked" | "unlocked";

function formatDateRange(start?: string, end?: string) {
  if (!start && !end) return "";
  if (!start) return end || "";
  return `${start} — ${end || "Present"}`;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  if (!children) return null;
  return (
    <section className="resume-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function RenderedResume({ resume }: { resume: ResumeData }) {
  const basic = resume.basic_info;

  return (
    <article className="resume-paper" aria-label="Rendered resume">
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
        <Section title="Education">
          <div className="resume-entry-list">
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
          </div>
        </Section>
      )}

      {!!resume.skills?.length && (
        <Section title="Skills">
          <div className="resume-skills">
            {resume.skills.map((skill) => (
              <div className="resume-skill" key={skill.name}>
                <strong>{skill.name}</strong>
                {skill.description && <span>{skill.description}</span>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {!!resume.projects?.length && (
        <Section title="Projects">
          <div className="resume-entry-list">
            {resume.projects.map((project) => (
              <article className="resume-entry" key={project.name}>
                <div className="resume-entry-head">
                  <div>
                    <h3>{project.name}</h3>
                    {project.description && <p>{project.description}</p>}
                  </div>
                </div>
                {!!project.links?.length && (
                  <div className="resume-entry-links">
                    {project.links.map((link) => (
                      <a key={`${project.name}-${link.url}`} href={link.url} target="_blank" rel="noopener noreferrer">
                        {link.label} ↗
                      </a>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </Section>
      )}
    </article>
  );
}

function JsonViewer({ json }: { json: string }) {
  return (
    <pre className="resume-json-viewer" aria-label="Raw JSON resume data">
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
  const [authState, setAuthState] = useState<AuthState>("locked");
  const [password, setPassword] = useState("");
  const [draft, setDraft] = useState(json);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function unlock(event: React.FormEvent) {
    event.preventDefault();
    if (!password) return;
    setAuthState("unlocked");
    setMessage("");
  }

  async function save() {
    setMessage("");
    setIsSaving(true);
    try {
      const parsed = JSON.parse(draft) as ResumeData;
      const pretty = JSON.stringify(parsed, null, 2) + "\n";
      const payload = await fetch("/api/resume-save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, resume: parsed }),
      }).then(parseResponse);
      setDraft(pretty);
      onSaved(parsed);
      setMessage(`Saved. Commit: ${payload.commit?.sha || "created"}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Save failed");
    } finally {
      setIsSaving(false);
    }
  }

  if (authState !== "unlocked") {
    return (
      <form className="resume-editor-lock" onSubmit={unlock}>
        <h2>Admin editor</h2>
        <p>This tab commits resume JSON to GitHub through a Cloudflare Pages Worker.</p>
        <label>
          Password
          <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete="current-password" />
        </label>
        <button type="submit" disabled={!password}>Unlock editor</button>
        {message && <p className="resume-editor-message">{message}</p>}
      </form>
    );
  }

  return (
    <section className="resume-editor">
      <div className="resume-editor-bar">
        <p>Edit JSON, validate, then commit to GitHub.</p>
        <button type="button" onClick={save} disabled={isSaving}>
          {isSaving ? "Saving…" : "Save & Commit"}
        </button>
      </div>
      <textarea value={draft} onChange={(event) => setDraft(event.target.value)} spellCheck={false} />
      {message && <p className="resume-editor-message">{message}</p>}
    </section>
  );
}

export default function ResumeTabs({ initialResume, initialJson }: { initialResume: ResumeData; initialJson: string }) {
  const [activeTab, setActiveTab] = useState<Tab>("rendered");
  const [resume, setResume] = useState(initialResume);
  const json = useMemo(() => JSON.stringify(resume, null, 2), [resume]);

  return (
    <main className="resume-shell">
      <div className="resume-toolbar print:hidden">
        <Link href="/" className="resume-back-link">← Home</Link>
        <div className="resume-tabs" role="tablist" aria-label="Resume views">
          {([
            ["rendered", "Resume"],
            ["json", "JSON"],
            ["editor", "Editor"],
          ] as const).map(([tab, label]) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            >
              {label}
            </button>
          ))}
        </div>
        <button type="button" className="resume-print-button" onClick={() => window.print()}>
          Print
        </button>
      </div>

      {activeTab === "rendered" && <RenderedResume resume={resume} />}
      {activeTab === "json" && <JsonViewer json={json} />}
      {activeTab === "editor" && <EditorPanel json={initialJson} onSaved={setResume} />}
    </main>
  );
}
