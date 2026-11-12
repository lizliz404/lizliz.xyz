import { Calendar as CalendarDays, OpenInWindow as ExternalLink, MapPin, Compass as Target, SecurityPass as Ticket, Alarm as AlarmClock, Wallet } from "iconoir-react";
import { cn } from "@/lib/utils";
import type { Fair } from "./fairs";

/** 展开后的细节：月清单和分时段列表共用。 */
export function FairDetail({ fair: f, className }: { fair: Fair; className?: string }) {
  return (
    <div className={cn("space-y-3.5 text-base leading-relaxed", className)}>
      <dl className="grid grid-cols-[6.75rem_minmax(0,1fr)] gap-x-4 gap-y-2.5">
        <dt className="inline-flex items-center gap-1.5 text-muted-foreground"><CalendarDays className="size-4 shrink-0 opacity-70" aria-hidden="true" />日期</dt>
        <dd>{f.dates}</dd>
        {f.venue ? (
          <>
            <dt className="inline-flex items-center gap-1.5 text-muted-foreground"><MapPin className="size-4 shrink-0 opacity-70" aria-hidden="true" />场馆</dt>
            <dd>{f.venue}</dd>
          </>
        ) : null}
        <dt className="inline-flex items-center gap-1.5 text-muted-foreground"><Target className="size-4 shrink-0 opacity-70" aria-hidden="true" />匹配度</dt>
        <dd>{f.fit}</dd>
        {f.entry ? (
          <>
            <dt className="inline-flex items-center gap-1.5 text-muted-foreground"><Ticket className="size-4 shrink-0 opacity-70" aria-hidden="true" />入场</dt>
            <dd>{f.entry}</dd>
          </>
        ) : null}
        {f.deadline ? (
          <>
            <dt className="inline-flex items-center gap-1.5 text-muted-foreground"><AlarmClock className="size-4 shrink-0 opacity-70" aria-hidden="true" />截止</dt>
            <dd>{f.deadline}</dd>
          </>
        ) : null}
        {f.cost ? (
          <>
            <dt className="inline-flex items-center gap-1.5 text-muted-foreground"><Wallet className="size-4 shrink-0 opacity-70" aria-hidden="true" />2 人费用</dt>
            <dd>{f.cost}</dd>
          </>
        ) : null}
      </dl>
      {f.details?.length ? (
        <ul className="list-disc space-y-1.5 pl-6 text-muted-foreground leading-relaxed">
          {f.details.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      ) : null}
      {f.links?.length ? (
        <p className="flex flex-wrap gap-x-4 gap-y-2 text-[15px]">
          {f.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sky-700 underline underline-offset-2 hover:text-sky-900 dark:text-sky-400"
            >
              {l.label}
              <ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
            </a>
          ))}
        </p>
      ) : null}
    </div>
  );
}
