/** Structured data must be readable from the exported HTML without JavaScript. */
export default function JsonLd({
  id,
  data,
}: {
  id?: string;
  data: Record<string, unknown>;
}) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
