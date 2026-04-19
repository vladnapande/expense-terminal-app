export default function FiltersBar({ categories, filters, onFilterChange }) {
  return (
    <section className="border border-terminal-line bg-terminal-panel">
      <div className="border-b border-terminal-line px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-terminal-muted">
        filters
      </div>
      <div className="grid gap-4 px-4 py-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.22em] text-terminal-muted">
          <span>category</span>
          <select
            value={filters.category}
            onChange={(event) => onFilterChange('category', event.target.value)}
            className="h-11 border border-terminal-line bg-black/20 px-3 text-sm uppercase tracking-[0.12em] text-terminal-strong outline-none transition focus:border-terminal-text"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.22em] text-terminal-muted">
          <span>month</span>
          <input
            type="month"
            value={filters.month}
            onChange={(event) => onFilterChange('month', event.target.value)}
            className="h-11 border border-terminal-line bg-black/20 px-3 text-sm uppercase tracking-[0.12em] text-terminal-strong outline-none transition focus:border-terminal-text"
          />
        </label>
      </div>
    </section>
  );
}
