function formatMoney(value) {
  const sign = value > 0 ? '+' : value < 0 ? '-' : '';
  return `${sign}₽${Math.abs(value).toFixed(2)}`;
}

export default function CategorySummary({ summary }) {
  return (
    <section className="overflow-hidden border border-terminal-line bg-terminal-panel">
      <div className="border-b border-terminal-line px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-terminal-muted">
        итог по категориям
      </div>
      <div className="border-b border-terminal-line px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-terminal-muted/80">
        сводка за {summary.monthLabel}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead className="text-left text-[11px] uppercase tracking-[0.24em] text-terminal-muted">
            <tr className="border-b border-terminal-line">
              <th className="px-4 py-3 font-normal">категория</th>
              <th className="px-4 py-3 font-normal text-right">расходы</th>
              <th className="px-4 py-3 font-normal text-right">доходы</th>
              <th className="px-4 py-3 font-normal text-right">баланс</th>
              <th className="px-4 py-3 font-normal text-right">записей</th>
            </tr>
          </thead>
          <tbody>
            {summary.rows.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-4 py-10 text-center uppercase tracking-[0.18em] text-terminal-muted"
                >
                  нет данных за выбранный месяц
                </td>
              </tr>
            ) : (
              summary.rows.map((row) => (
                <tr key={row.category} className="border-b border-terminal-line/70 last:border-b-0">
                  <td className="px-4 py-3 uppercase text-terminal-strong">{row.category}</td>
                  <td className="px-4 py-3 text-right text-terminal-strong">
                    {formatMoney(-row.expense)}
                  </td>
                  <td className="px-4 py-3 text-right text-terminal-text">
                    {formatMoney(row.income)}
                  </td>
                  <td className="px-4 py-3 text-right text-terminal-strong">
                    {formatMoney(row.balance)}
                  </td>
                  <td className="px-4 py-3 text-right text-terminal-muted">{row.count}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
