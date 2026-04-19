export default function TerminalHeader() {
  return (
    <header className="border border-terminal-line bg-terminal-panel/80 shadow-screen">
      <div className="flex items-center justify-between border-b border-terminal-line px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-terminal-muted">
        <div className="flex items-center gap-3">
          <span>root@expenses</span>
          <span className="text-terminal-text/60">session: active</span>
        </div>
        <span className="hidden sm:inline">ledger.console</span>
      </div>
      <div className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-terminal-muted">$ expense-tracker --watch</p>
          <h1 className="mt-2 text-2xl font-semibold uppercase tracking-[0.2em] text-terminal-strong sm:text-3xl">
            Expense Terminal
            <span className="ml-2 inline-block h-5 w-2 translate-y-1 bg-terminal-text/80 align-baseline animate-blink" />
          </h1>
        </div>
        <p className="max-w-md text-sm leading-6 text-terminal-muted">
          Fast expense input, strict visual noise budget, local-only persistence.
        </p>
      </div>
    </header>
  );
}
