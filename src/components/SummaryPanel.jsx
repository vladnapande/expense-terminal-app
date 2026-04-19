const items = [
  { key: 'today', label: 'today' },
  { key: 'month', label: 'month' },
  { key: 'avgDay', label: 'avg/day' },
];

export default function SummaryPanel({ summary }) {
  return (
    <section className="grid gap-px border border-terminal-line bg-terminal-line sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.key} className="bg-terminal-panel px-4 py-4">
          <p className="text-[11px] uppercase tracking-[0.28em] text-terminal-muted">{item.label}</p>
          <p className="mt-3 text-2xl text-terminal-strong">{summary[item.key]}</p>
        </div>
      ))}
    </section>
  );
}
