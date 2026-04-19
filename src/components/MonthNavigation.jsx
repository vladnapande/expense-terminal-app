function shiftMonth(monthValue, delta) {
  const [year, month] = monthValue.split('-').map(Number);
  const nextDate = new Date(year, month - 1 + delta, 1);
  const nextYear = nextDate.getFullYear();
  const nextMonth = String(nextDate.getMonth() + 1).padStart(2, '0');

  return `${nextYear}-${nextMonth}`;
}

export default function MonthNavigation({ currentMonth, selectedMonth, onChangeMonth }) {
  const isCurrentMonth = selectedMonth === currentMonth;

  return (
    <section className="border border-terminal-line bg-terminal-panel">
      <div className="border-b border-terminal-line px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-terminal-muted">
        обзор месяца
      </div>
      <div className="flex flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-terminal-muted">
            активный период
          </p>
          <p className="mt-2 text-2xl uppercase tracking-[0.12em] text-terminal-strong">
            {selectedMonth}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onChangeMonth(shiftMonth(selectedMonth, -1))}
            className="h-11 border border-terminal-line px-4 text-sm uppercase tracking-[0.16em] text-terminal-strong transition hover:bg-terminal-text/5"
          >
            [ прошлый ]
          </button>
          <button
            type="button"
            onClick={() => onChangeMonth(currentMonth)}
            className={`h-11 border px-4 text-sm uppercase tracking-[0.16em] transition ${
              isCurrentMonth
                ? 'border-terminal-text text-terminal-strong'
                : 'border-terminal-line text-terminal-muted hover:text-terminal-strong'
            }`}
          >
            [ текущий ]
          </button>
          <button
            type="button"
            onClick={() => onChangeMonth(shiftMonth(selectedMonth, 1))}
            className="h-11 border border-terminal-line px-4 text-sm uppercase tracking-[0.16em] text-terminal-strong transition hover:bg-terminal-text/5"
          >
            [ следующий ]
          </button>
        </div>
      </div>
    </section>
  );
}
