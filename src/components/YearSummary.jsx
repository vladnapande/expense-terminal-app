function formatMoney(value) {
  const sign = value > 0 ? '+' : value < 0 ? '-' : '';
  return `${sign}₽${Math.abs(value).toFixed(2)}`;
}

export default function YearSummary({ summary }) {
  return (
    <section className="overflow-hidden border border-terminal-line bg-terminal-panel">
      <div className="border-b border-terminal-line px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-terminal-muted">
        годовая сводка / {summary.year}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead className="text-left text-[11px] uppercase tracking-[0.24em] text-terminal-muted">
            <tr className="border-b border-terminal-line">
              <th className="px-4 py-3 font-normal">месяц</th>
              <th className="px-4 py-3 font-normal text-right">доходы</th>
              <th className="px-4 py-3 font-normal text-right">расходы</th>
              <th className="px-4 py-3 font-normal text-right">баланс</th>
            </tr>
          </thead>
          <tbody>
            {summary.rows.map((row) => (
              <tr key={row.key} className="border-b border-terminal-line/70 last:border-b-0">
                <td className="px-4 py-3 uppercase text-terminal-strong">{row.label}</td>
                <td className="px-4 py-3 text-right text-terminal-text">
                  {formatMoney(row.income)}
                </td>
                <td className="px-4 py-3 text-right text-terminal-strong">
                  {formatMoney(-row.expense)}
                </td>
                <td className="px-4 py-3 text-right text-terminal-strong">
                  {formatMoney(row.balance)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-px border-t border-terminal-line bg-terminal-line md:grid-cols-4">
        <div className="bg-terminal-panel px-4 py-4">
          <p className="text-[11px] uppercase tracking-[0.22em] text-terminal-muted">доходы за год</p>
          <p className="mt-2 text-lg text-terminal-strong">{formatMoney(summary.totalIncome)}</p>
        </div>
        <div className="bg-terminal-panel px-4 py-4">
          <p className="text-[11px] uppercase tracking-[0.22em] text-terminal-muted">расходы за год</p>
          <p className="mt-2 text-lg text-terminal-strong">{formatMoney(-summary.totalExpense)}</p>
        </div>
        <div className="bg-terminal-panel px-4 py-4">
          <p className="text-[11px] uppercase tracking-[0.22em] text-terminal-muted">итог за год</p>
          <p className="mt-2 text-lg text-terminal-strong">{formatMoney(summary.totalBalance)}</p>
        </div>
        <div className="bg-terminal-panel px-4 py-4">
          <p className="text-[11px] uppercase tracking-[0.22em] text-terminal-muted">среднее за месяц</p>
          <p className="mt-2 text-lg text-terminal-strong">{formatMoney(summary.avgMonth)}</p>
        </div>
      </div>
    </section>
  );
}
