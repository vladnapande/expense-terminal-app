export default function FiltersBar({
  categories,
  filters,
  onFilterChange,
  selectedMonthLabel,
}) {
  return (
    <section className="border border-terminal-line bg-terminal-panel">
      <div className="border-b border-terminal-line px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-terminal-muted">
        фильтры
      </div>
      <div className="border-b border-terminal-line px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-terminal-muted/80">
        применяются внутри месяца: {selectedMonthLabel}
      </div>
      <div className="grid gap-4 px-4 py-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.22em] text-terminal-muted">
          <span>тип</span>
          <select
            value={filters.type}
            onChange={(event) => onFilterChange('type', event.target.value)}
            className="h-11 border border-terminal-line bg-black/20 px-3 text-sm uppercase tracking-[0.12em] text-terminal-strong outline-none transition focus:border-terminal-text"
          >
            <option value="all">все</option>
            <option value="expense">расход</option>
            <option value="income">приход</option>
          </select>
        </label>
        <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.22em] text-terminal-muted">
          <span>категория</span>
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
      </div>
    </section>
  );
}
