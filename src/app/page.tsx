export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24">
      <div className="w-full max-w-lg flex flex-col gap-12">
        {/* Name + tagline */}
        <header className="flex flex-col gap-2">
          <h1 className="text-4xl font-semibold tracking-tight">lizliz</h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">
            building at the edge of agents, markets, and words.
          </p>
        </header>

        {/* What I do */}
        <section className="flex flex-col gap-2">
          <h2 className="text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            What I do
          </h2>
          <ul className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-zinc-600 dark:text-zinc-300">
            <li>agent infrastructure</li>
            <li aria-hidden="true" className="text-zinc-300 dark:text-zinc-700">·</li>
            <li>trading &amp; investing</li>
            <li aria-hidden="true" className="text-zinc-300 dark:text-zinc-700">·</li>
            <li>writing &amp; research</li>
          </ul>
        </section>

        {/* Links */}
        <section className="flex flex-col gap-2">
          <h2 className="text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            Find me
          </h2>
          <ul className="flex flex-col gap-1 text-sm">
            <li>
              <a
                href="https://github.com/lizliz404"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-900 dark:text-zinc-100 underline underline-offset-4 decoration-zinc-300 dark:decoration-zinc-700 hover:decoration-zinc-900 dark:hover:decoration-zinc-100 transition-colors"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://x.com/yourhandle"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-900 dark:text-zinc-100 underline underline-offset-4 decoration-zinc-300 dark:decoration-zinc-700 hover:decoration-zinc-900 dark:hover:decoration-zinc-100 transition-colors"
              >
                X / Twitter
              </a>
            </li>
          </ul>
        </section>

        {/* Coming soon */}
        <section className="flex flex-col gap-2">
          <h2 className="text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            Coming soon
          </h2>
          <ul className="flex flex-col gap-1 text-sm text-zinc-500 dark:text-zinc-400">
            <li>/articles — essays &amp; notes</li>
            <li>/projects — things I&apos;m building</li>
            <li>/now — what I&apos;m up to</li>
          </ul>
        </section>

        {/* Footer */}
        <footer className="pt-8">
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            lizliz.xyz
          </p>
        </footer>
      </div>
    </main>
  );
}
