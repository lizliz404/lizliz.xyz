"use client";

import { useState } from "react";
import type { ResumeData } from "./types";

async function parseResponse(response: Response) {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || `Request failed: ${response.status}`);
  return payload;
}

export default function ResumeEditor({ json, onSaved }: { json: string; onSaved: (resume: ResumeData) => void }) {
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
      setMessage(`Saved ✓ Commit: ${payload.commit?.sha?.slice(0, 7) || "created"}`);
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
          <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete="current-password" />
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
      <textarea value={draft} onChange={(event) => setDraft(event.target.value)} spellCheck={false} />
      {message && <p className="resume-editor-message">{message}</p>}
    </section>
  );
}
