import { cn } from "@/lib/utils";
import type { Fair } from "./fairs";

/** 展开后的细节：月清单和分时段列表共用。 */
export function FairDetail({ fair: f, className }: { fair: Fair; className?: string }) {
  return (
    <div className={cn("space-y-2 text-sm", className)}>
      <dl className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-3 gap-y-1">
        <dt className="text-muted-foreground">日期</dt>
        <dd>{f.dates}</dd>
        {f.venue ? (
          <>
            <dt className="text-muted-foreground">场馆</dt>
            <dd>{f.venue}</dd>
          </>
        ) : null}
        <dt className="text-muted-foreground">对我们</dt>
        <dd>{f.fit}</dd>
        {f.entry ? (
          <>
            <dt className="text-muted-foreground">入场</dt>
            <dd>{f.entry}</dd>
          </>
        ) : null}
        {f.deadline ? (
          <>
            <dt className="text-muted-foreground">截止</dt>
            <dd>{f.deadline}</dd>
          </>
        ) : null}
        {f.cost ? (
          <>
            <dt className="text-muted-foreground">2 人费用</dt>
            <dd>{f.cost}</dd>
          </>
        ) : null}
      </dl>
      {f.details?.length ? (
        <ul className="list-disc space-y-0.5 pl-5 text-muted-foreground">
          {f.details.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      ) : null}
      {f.links?.length ? (
        <p className="flex flex-wrap gap-x-3 gap-y-1">
          {f.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="text-sky-700 underline underline-offset-2 hover:text-sky-900 dark:text-sky-400"
            >
              {l.label} ↗
            </a>
          ))}
        </p>
      ) : null}
    </div>
  );
}
