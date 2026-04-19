function formatAmount(value) {
  return `$${value.toFixed(2)}`;
}

export default function ExpenseTable({ expenses, onDelete }) {
  return (
    <section className="overflow-hidden border border-terminal-line bg-terminal-panel">
      <div className="border-b border-terminal-line px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-terminal-muted">
        ledger.entries
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead className="text-left text-[11px] uppercase tracking-[0.24em] text-terminal-muted">
            <tr className="border-b border-terminal-line">
              <th className="px-4 py-3 font-normal">date</th>
              <th className="px-4 py-3 font-normal">category</th>
              <th className="px-4 py-3 font-normal">note</th>
              <th className="px-4 py-3 font-normal text-right">amount</th>
              <th className="px-4 py-3 font-normal text-right">rm</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-10 text-center uppercase tracking-[0.18em] text-terminal-muted">
                  no records for current filter
                </td>
              </tr>
            ) : (
              expenses.map((expense) => (
                <tr key={expense.id} className="border-b border-terminal-line/70 last:border-b-0">
                  <td className="px-4 py-3 text-terminal-muted">{expense.date}</td>
                  <td className="px-4 py-3 uppercase text-terminal-strong">{expense.category}</td>
                  <td className="px-4 py-3 text-terminal-text/80">{expense.note || 'n/a'}</td>
                  <td className="px-4 py-3 text-right text-terminal-strong">
                    {formatAmount(expense.amount)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => onDelete(expense.id)}
                      className="border border-terminal-line px-2 py-1 text-xs uppercase tracking-[0.16em] text-terminal-danger transition hover:border-terminal-danger hover:text-terminal-danger"
                    >
                      del
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
