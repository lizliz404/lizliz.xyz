import type { ResumeData } from "./types";

function formatDateRange(start?: string, end?: string) {
  if (!start && !end) return "";
  if (!start) return end || "";
  return `${start} — ${end || "Present"}`;
}

export default function RenderedResume({ resume }: { resume: ResumeData }) {
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
