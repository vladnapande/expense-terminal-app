export default function MonthInsights({ insights }) {
  return (
    <section className="border border-terminal-line bg-terminal-panel">
      <div className="border-b border-terminal-line px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-terminal-muted">
        изменения месяца
      </div>
      <div className="border-b border-terminal-line px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-terminal-muted/80">
        сравнение {insights.currentMonthLabel} к {insights.previousMonthLabel}
      </div>
      <div className="grid gap-px border-b border-terminal-line bg-terminal-line lg:grid-cols-4">
        {insights.comparison.map((item) => (
          <div key={item.key} className="bg-terminal-panel px-4 py-4">
            <p className="text-[11px] uppercase tracking-[0.22em] text-terminal-muted">{item.label}</p>
            <p className="mt-2 text-lg text-terminal-strong">{item.current}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.14em] text-terminal-muted">
              было {item.previous}
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.14em] text-terminal-text">
              {item.delta}
            </p>
          </div>
        ))}
      </div>
      <div className="px-4 py-4">
        <p className="text-[11px] uppercase tracking-[0.22em] text-terminal-muted">наблюдения</p>
        <div className="mt-3 flex flex-col gap-2">
          {insights.observations.map((line) => (
            <p key={line} className="text-sm leading-6 text-terminal-strong">
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
