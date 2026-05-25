"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ResumeData, ResumeEntry } from "./types";

type Tab = "rendered" | "json" | "editor";

type AuthState = "locked" | "authenticating" | "unlocked";

function formatDateRange(entry: ResumeEntry) {
  const start = entry.startDate || entry.date;
  const end = entry.endDate || "Present";
  if (!start && !entry.endDate) return "";
  if (!start) return end;
  return `${start} — ${end}`;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="resume-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function EntryList({ entries }: { entries?: ResumeEntry[] }) {
  if (!entries?.length) return null;

  return (
    <div className="resume-entry-list">
      {entries.map((entry, index) => (
        <article className="resume-entry" key={`${entry.name || entry.company || entry.institution || entry.position}-${index}`}>
          <div className="resume-entry-head">
            <div>
              <h3>{entry.position || entry.name || entry.studyType || entry.area}</h3>
              {(entry.company || entry.institution) && <p>{entry.company || entry.institution}</p>}
            </div>
            {formatDateRange(entry) && <time>{formatDateRange(entry)}</time>}
          </div>
          {(entry.summary || entry.description) && <p className="resume-entry-summary">{entry.summary || entry.description}</p>}
          {entry.url && (
            <a href={entry.url} target="_blank" rel="noopener noreferrer">
              {entry.url}
            </a>
          )}
          {!!entry.highlights?.length && (
            <ul>
              {entry.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          )}
        </article>
      ))}
    </div>
  );
}

function RenderedResume({ resume }: { resume: ResumeData }) {
  const basics = resume.basics;

  return (
    <article className="resume-paper" aria-label="Rendered resume">
      <header className="resume-hero">
        {basics.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={basics.image} alt="" className="resume-avatar" />
        )}
        <div>
          <h1>{basics.name}</h1>
          {basics.label && <p className="resume-label">{basics.label}</p>}
          {basics.summary && <p className="resume-summary">{basics.summary}</p>}
          <div className="resume-contact">
            {basics.email && <a href={`mailto:${basics.email}`}>{basics.email}</a>}
            {basics.phone && <a href={`tel:${basics.phone}`}>{basics.phone}</a>}
            {basics.url && <a href={basics.url}>{basics.url.replace(/^https?:\/\//, "")}</a>}
            {basics.location?.city && <span>{[basics.location.city, basics.location.region, basics.location.countryCode].filter(Boolean).join(", ")}</span>}
          </div>
          {!!basics.profiles?.length && (
            <div className="resume-profiles">
              {basics.profiles.map((profile) => (
                <a key={`${profile.network}-${profile.username}`} href={profile.url} target="_blank" rel="noopener noreferrer">
                  {profile.network}{profile.username ? ` / ${profile.username}` : ""}
                </a>
              ))}
            </div>
          )}
        </div>
      </header>

      <Section title="Work">
        <EntryList entries={resume.work} />
      </Section>
      <Section title="Projects">
        <EntryList entries={resume.projects} />
      </Section>
      <Section title="Education">
        <EntryList entries={resume.education} />
      </Section>
      {!!resume.skills?.length && (
        <Section title="Skills">
          <div className="resume-skills">
            {resume.skills.map((skill) => (
              <div className="resume-skill" key={skill.name}>
                <strong>{skill.name}</strong>
                {!!skill.keywords?.length && <span>{skill.keywords.join(" · ")}</span>}
              </div>
            ))}
          </div>
        </Section>
      )}
      {!!resume.languages?.length && (
        <Section title="Languages">
          <ul className="resume-inline-list">
            {resume.languages.map((item) => (
              <li key={item.language}>{item.language}{item.fluency ? ` — ${item.fluency}` : ""}</li>
            ))}
          </ul>
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
  const [token, setToken] = useState("");
  const [draft, setDraft] = useState(json);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function authenticate(event: React.FormEvent) {
    event.preventDefault();
    setAuthState("authenticating");
    setMessage("");
    try {
      const payload = await fetch("/api/resume-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      }).then(parseResponse);
      setToken(payload.token);
      setAuthState("unlocked");
      setPassword("");
    } catch (error) {
      setAuthState("locked");
      setMessage(error instanceof Error ? error.message : "Authentication failed");
    }
  }

  async function save() {
    setMessage("");
    setIsSaving(true);
    try {
      const parsed = JSON.parse(draft) as ResumeData;
      const pretty = JSON.stringify(parsed, null, 2) + "\n";
      const payload = await fetch("/api/resume-save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ resume: parsed }),
      }).then(parseResponse);
      setDraft(pretty);
      onSaved(parsed);
      setMessage(`Saved. Commit: ${payload.commit?.sha || "queued"}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Save failed");
    } finally {
      setIsSaving(false);
    }
  }

  if (authState !== "unlocked") {
    return (
      <form className="resume-editor-lock" onSubmit={authenticate}>
        <h2>Admin editor</h2>
        <p>This tab writes changes back to GitHub through a Cloudflare Pages Worker.</p>
        <label>
          Password
          <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete="current-password" />
        </label>
        <button type="submit" disabled={authState === "authenticating" || !password}>
          {authState === "authenticating" ? "Checking…" : "Unlock editor"}
        </button>
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
