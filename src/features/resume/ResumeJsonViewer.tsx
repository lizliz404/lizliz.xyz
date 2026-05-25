export default function ResumeJsonViewer({ json }: { json: string }) {
  return (
    <pre className="resume-json-viewer resume-card-face" aria-label="Raw JSON resume data">
      <code>{json}</code>
    </pre>
  );
}
